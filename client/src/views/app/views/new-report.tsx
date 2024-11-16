import React from 'react';
import {AppContext} from "@/views/app/contexts/app-context.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ArrowUpRight, Loader, Paperclip} from "lucide-react";
import * as util from "node:util";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";

const NewReport = () => {
    const {API, utils} = React.useContext(AppContext);
    const fileInputRef = React.useRef<null | HTMLInputElement>(null);
    const [fileBase64, setFileBase64] = React.useState<string | null>(null);
    const [title, setTitle] = React.useState<string>("");
    const [description, setDescription] = React.useState<string>("");
    const [processing, setProcessing] = React.useState<boolean>(false);
    const [lat, setLat] = React.useState<number | null>(null);
    const [long, setLong] = React.useState<number | null>(null);
    API.components.category.setDisplay(false);
    const [gpsProcessing, setGpsProcessing] = React.useState<boolean>(false);
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];
        if (file.type.split('/')[0] !== 'image') {
            utils.toast.error('Please upload an image file');
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            utils.toast.error('Please upload an image file under 2MB');
            return;
        }

        // Convert the image to Base64
        const reader = new FileReader();
        reader.onloadend = () => {
            setFileBase64(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleGPSLocGet = () => {
        setGpsProcessing(true);
        if(navigator.geolocation){
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const {latitude, longitude} = position.coords;
                    setLat(latitude);
                    setLong(longitude);
                    setGpsProcessing(false);
                }, (error) => {
                    console.error(error);
                    setGpsProcessing(false);
                    utils.toast.error("Something went wrong while fetching your location. Please try again later.")
                }, {
                    enableHighAccuracy: true,
                    timeout: 30000,
                    maximumAge: 0
                });
            }
        }
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        //validate form
        if (title === '' || description === '' || !fileBase64) {
            utils.toast.error('Please fill all the fields!');
            return;
        }
        const payload = {
            proof_text: `${title} - ${description}`,
            proof_image: fileBase64,
        };

        console.log("Payload JSON:", JSON.stringify(payload, null, 2));
        setProcessing(true);
        fetch("/api/submit-content", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        }).then(ir => ir.json())
            .then(response => {
                if (response?.isMatching === true) {
                    if (response?.score >= 80) {
                        if (response?.severity_score) {
                            let sev_score = response?.severity_score; // this will be of type number range from 0-10
                            //convert the above score from 10 to 5 without floating point
                            let severity_score = Math.round(sev_score / 2);

                        } else {
                            utils.toast.error("DS mismatch! [D-500]")
                        }
                    } else {
                        utils.toast.error(response?.reason_severity_score || "It seems like the content is not matching with the provided documents!");
                    }
                } else {
                    utils.toast.error(response?.reason_severity_score || "It seems like the content is not matching the requirements!");
                }
            }).catch(error => {
            console.error("Error response from server:", error);
            utils.toast.error("Failed to submit the report");
        }).finally(() => {
            setProcessing(false);
        });

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
                <div className={'flex items-end justify-end gap-4'}>
                    <div className={'flex flex-col md:flex-row items-center gap-4 w-full'}>
                        <div className="space-y-1 w-full">
                            <Label>Latitude</Label>
                            <Input
                                disabled={true}
                                value={lat}
                                id="report-latitude"
                                className="py-5 rounded-xl border-black"
                            />
                        </div>
                        <div className="space-y-1 w-full">
                            <Label>Longitude</Label>
                            <Input
                                disabled={true}
                                id="report-long"
                                value={long}
                                className="py-5 rounded-xl border-black"
                            />
                        </div>
                    </div>
                    <Button
                        type={'button'}
                        onClick={handleGPSLocGet}
                        className={'py-5'}
                        disabled={gpsProcessing}>Get Location {gpsProcessing && <Loader
                        className={'animate-spin'}/>}</Button>
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
                        accept="image/*"
                        onChange={handleFileUpload}
                    />
                    <Button
                        onClick={() => fileInputRef.current?.click()}
                        type="button"
                        className="bg-[#F8F8FD] text-[#515B6F] outline-dashed border-t-transparent outline-2"
                        variant="outline"
                    >
                        <Paperclip className="size-5 mr-1 text-[#4A8209]"/> Attach Photos
                    </Button>
                    <Button onClick={() => fileInputRef.current?.click()} type={'button'}
                            className={'bg-[#F8F8FD] text-[#515B6F] outline-dashed border-t-transparent outline-2'}
                            variant={'outline'}>
                        <Paperclip className={'size-5 mr-1 text-[#4A8209]'}/> Attach Videos
                    </Button>
                </div>
                {fileBase64 && (
                    <p className="text-gray-500">
                        <b>Selected File:</b>
                        <img alt={'selected image'}
                             src={fileBase64}
                             className="mt-2 rounded-lg border border-gray max-h-[200px] w-auto"
                        />
                    </p>
                )}
                <div className="pt-5">
                    <Button
                        type="submit"
                        disabled={processing}
                        className="bg-[#b9ff66] hover:bg-[#a3ff66] border-[#4A8209] border-[1.6px] rounded-full w-full text-black py-6 text-lg font-semibold"
                    >
                        Submit Report {processing && <Loader className="size-8 animate-spin"/> ||
                        <ArrowUpRight className="size-8"/>}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default NewReport;
