import React from 'react';
import { AppContext } from "@/views/app/contexts/app-context.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ArrowUpRight, Loader, Paperclip } from "lucide-react";
import lighthouse from "@lighthouse-web3/sdk";
import { base64ToFile } from "@/views/app/components/apis.ts";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { sapphireTestnet } from "viem/chains";
import { CommonABI } from "@/constants/multichain-contracts.ts";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes.tsx";
import imageCompression from "browser-image-compression";
import { GlobalContext } from "@/contexts/global-context.tsx";

const publicClient = createPublicClient({
    chain: sapphireTestnet,
    transport: http()
});

const NewReport = () => {
    const { API, utils } = React.useContext(AppContext);
    const { walletTools } = React.useContext(GlobalContext);
    const fileInputRef = React.useRef<null | HTMLInputElement>(null);
    const [fileBase64, setFileBase64] = React.useState<string | null>(null);
    const [title, setTitle] = React.useState<string>("");
    const [description, setDescription] = React.useState<string>("");
    const [processing, setProcessing] = React.useState<boolean>(false);
    const [lat, setLat] = React.useState<number | null>(null);
    const [long, setLong] = React.useState<number | null>(null);
    const [gpsProcessing, setGpsProcessing] = React.useState<boolean>(false);
    API.components.category.setDisplay(false);
    const navigate = useNavigate();

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];
        const fileType = file.type.split('/')[0];

        // Validate file type
        if (fileType !== 'image' && fileType !== 'video') {
            utils.toast.error('Please upload an image or video file');
            return;
        }

        try {
            // Compress image to be under 25KB
            if (fileType === 'image') {
                const options = {
                    maxSizeMB: 0.025, // Target file size in MB (25KB)
                    maxWidthOrHeight: 1920, // Maximum resolution
                    useWebWorker: true, // Use Web Workers for better performance
                };

                const compressedFile = await imageCompression(file, options);

                if (compressedFile.size > 25 * 1024) {
                    utils.toast.error("Unable to compress the image to 25KB or less. Please upload a smaller image.");
                    return;
                }

                const reader = new FileReader();
                reader.onload = () => {
                    setFileBase64(reader.result as string);
                    utils.toast.success("Image compressed and uploaded successfully!");
                };
                reader.readAsDataURL(compressedFile);
            } else {
                // If video, directly read the file
                const reader = new FileReader();
                reader.onload = () => {
                    setFileBase64(reader.result as string);
                    utils.toast.success("Video uploaded successfully!");
                };
                reader.readAsDataURL(file);
            }
        } catch (error) {
            console.error("Error during file compression/upload:", error);
            utils.toast.error("Failed to process the file. Please try again.");
        }
    };

    const handleGPSLocGet = () => {
        setGpsProcessing(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLat(latitude);
                    setLong(longitude);
                    setGpsProcessing(false);
                },
                (error) => {
                    console.error(error);
                    setGpsProcessing(false);
                    utils.toast.error("Something went wrong while fetching your location. Please try again later.");
                },
                {
                    enableHighAccuracy: true,
                    timeout: 30000,
                    maximumAge: 0,
                }
            );
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate fields before submission
        if (title === '' || description === '' || !fileBase64) {
            utils.toast.error('Please fill all the fields!');
            return;
        }

        setProcessing(true);

        try {
            // Send the payload to your backend (for content check)
            const response = await fetch("/api/submit-content", {
                method: "POST",
                body: new URLSearchParams({
                    proof_text: `${title} - ${description}`,
                    proof_image: fileBase64,
                }),
            }).then((ir) => ir.json());

            if (response?.isMatching) {
                if (response?.score >= 80 && response?.severity_score) {
                    const sevScore = Math.round(response.severity_score / 2);
                    const category = response?.category || "Others";
                    
                    // Save to localStorage
                    const localReports = JSON.parse(localStorage.getItem('localReports') || '[]');
                    const newReport = {
                        title,
                        description,
                        fileBase64,
                        lat: lat ?? 0,
                        long: long ?? 0,
                        category,
                        priority: sevScore,
                        upvotes: 0,
                        downvotes: 0,
                        timestamp: new Date().toISOString(),
                        details: { title, description },
                        publicLocation: { 
                            lat: lat?.toString() ?? "0", 
                            long: long?.toString() ?? "0" 
                        }
                    };
                    
                    localReports.push(newReport);
                    localStorage.setItem('localReports', JSON.stringify(localReports));

                    utils.toast.success("Report submitted successfully!");
                    navigate(ROUTES.app.reports);
                } else {
                    utils.toast.error("Content mismatch detected!");
                }
            } else {
                utils.toast.error("Content mismatch detected!");
            }
        } catch (error) {
            console.error("Error during report submission:", error);
            utils.toast.error("Failed to submit the report");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div>
            <h1 className="text-lg font-semibold">Create a new report</h1>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-1">
                    <Label htmlFor="report-title">Title</Label>
                    <Input
                        id="report-title"
                        className="py-5 rounded-xl border-black"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="flex items-end justify-end gap-4">
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full">
                        <div className="space-y-1 w-full">
                            <Label>Latitude</Label>
                            <Input disabled value={lat} className="py-5 rounded-xl border-black"/>
                        </div>
                        <div className="space-y-1 w-full">
                            <Label>Longitude</Label>
                            <Input disabled value={long} className="py-5 rounded-xl border-black"/>
                        </div>
                    </div>
                    <Button type="button" onClick={handleGPSLocGet} className="py-5" disabled={gpsProcessing}>
                        Get Location {gpsProcessing && <Loader className="animate-spin"/>}
                    </Button>
                </div>
                <div className="space-y-1">
                    <Label htmlFor="report-description">Description</Label>
                    <Textarea
                        id="report-description"
                        rows={4}
                        className="rounded-xl border-black resize-none"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-x-4">
                    <input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        accept="image/*,video/*"
                        onChange={handleFileUpload}
                    />
                    <Button
                        onClick={() => fileInputRef.current?.click()}
                        type="button"
                        className="bg-[#F8F8FD] text-[#515B6F] outline-dashed border-t-transparent outline-2"
                        variant="outline"
                    >
                        <Paperclip className="size-5 mr-1 text-[#4A8209]"/> Attach Photos/Videos
                    </Button>
                </div>
                <div className={'font-semibold text-gray-600'}>
                    Our AI Agents will be verifying your POV and updates will be shared with you immediately.
                </div>
                {fileBase64 && (
                    <p className="text-gray-500">
                        <b>Selected File:</b>
                        {fileBase64.startsWith("data:image/") ? (
                            <img alt="selected" src={fileBase64}
                                 className="mt-2 rounded-lg border border-gray max-h-[200px] w-auto"/>
                        ) : (
                            <video controls className="mt-2 rounded-lg border border-gray max-h-[200px] w-auto">
                                <source src={fileBase64}/>
                            </video>
                        )}
                    </p>
                )}
                <div className="pt-5 flex justify-center gap-4">
                    <Button
                        type="submit"
                        disabled={processing}
                        className="bg-[#b9ff66] hover:bg-[#a3ff66] border-[#4A8209] border-[1.5px] py-5 rounded-xl w-[220px] text-black font-semibold"
                    >
                        {processing ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Submit Report <ArrowUpRight className="size-5 ml-1"/>
                    </Button>
                    <Button
                        type="button"
                        onClick={() => window.open('https://analysis-page.vercel.app/', '_blank')}
                        className="bg-[#b9ff66] hover:bg-[#a3ff66] border-[#4A8209] border-[1.5px] py-5 rounded-xl w-[220px] text-black font-semibold"
                    >
                        Review Analysis <ArrowUpRight className="size-5 ml-1"/>
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default NewReport;
