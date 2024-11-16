import React from 'react';
import {AppContext} from "@/views/app/contexts/app-context.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ArrowUpRight, Loader, Paperclip} from "lucide-react";
import lighthouse from "@lighthouse-web3/sdk";
import {base64ToFile} from "@/views/app/components/apis.ts";
import {createPublicClient, createWalletClient, custom, http} from "viem";
import {scrollSepolia} from "viem/chains";
import {CommonABI, ScrollSepolia} from "@/constants/multichain-contracts.ts";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "@/constants/routes.tsx";

const publicClient = createPublicClient({
    chain: scrollSepolia,
    transport: http()
})
const walletClient = createWalletClient({
    chain: scrollSepolia,
    transport: custom(window.ethereum)
})
const [account] = await walletClient.getAddresses()

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
    const navigate = useNavigate();
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        //validate if the file is an image
        if (files && files[0].type.split('/')[0] !== 'image') {
            utils.toast.error('Please upload an image file');
            return;
        }
        // dont allow svg
        if (files && files[0].type === 'image/svg+xml') {
            utils.toast.error('SVG files are not allowed');
            return;
        }
        //dont allow gif
        if (files && files[0].type === 'image/gif') {
            utils.toast.error('GIF files are not allowed');
            return;
        }
        //dont allow webp
        if (files && files[0].type === 'image/webp') {
            utils.toast.error('WebP files are not allowed');
            return;
        }
        //validate if the file is under 2MB
        //if not, compress the image to 1.5MB
        if (files && files[0].size > 2 * 1024 * 1024) {
            utils.toast.error('Please upload an image file under 2MB');
            return;
        }
        //compress the image using canvas
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    canvas.toBlob((blob) => {
                        // @ts-ignore
                        const compressedFile = new File([blob as Blob], files[0].name, {
                            // @ts-ignore
                            type: files[0].type,
                            lastModified: Date.now()
                        });
                        console.log(compressedFile);
                        // setFile(compressedFile);
                        // // create a blob url of the compressed image
                        // const blobUrl = URL.createObjectURL(compressedFile);
                        // console.log(blobUrl);

                        //convert the image to base64 and set it to the state
                        const in_reader = new FileReader();
                        in_reader.onloadend = () => {
                            setFileBase64(in_reader.result as string);
                        };
                        in_reader.readAsDataURL(compressedFile);
                        // @ts-ignore
                    }, files[0].type, 0.5);
                }
            }
            img.src = e.target?.result as string;
        }
        // @ts-ignore
        reader.readAsDataURL(files[0]);
    };

    const handleGPSLocGet = () => {
        setGpsProcessing(true);
        if (navigator.geolocation) {
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

        setProcessing(true);
        fetch("/api/submit-content", {
            method: "POST",
            body: new URLSearchParams(payload),
        }).then(ir => ir.json())
            .then((response) => {
                if (response?.isMatching === true) {
                    if (response?.score >= 80) {
                        if (response?.severity_score) {
                            let sev_score = response?.severity_score; // this will be of type number range from 0-10
                            //convert the above score from 10 to 5 without floating point
                            let severity_score = Math.round(sev_score / 2);
                            let category = response?.category || "Others";
                            let suggestions = response?.suggestions || "";
                            let description = `<div class="uploaded-text">
                                        <b>AI Summary: </b> ${response?.reason_severity_score || "-"} <br>
                                        <b>AI Suggestions: </b> ${suggestions || "-"} <br>
                            </div>`
                            const details = JSON.stringify({title, description})
                            const location = JSON.stringify({lat, long})


                            //store in filecoin -> get _mediaCID
                            const file = base64ToFile(fileBase64, `${Date.now()}.jpg`);
                            setProcessing(true);
                            lighthouse.upload([file], '1d7a4666.078c09b786c844d8ab70d56054d33836').then(async (uploadResp) => {
                                console.log(uploadResp);
                                const cID = uploadResp.data.Hash;
                                // console.log(details, location, category, severity_score, cID)

                                //write in blockchain
                                setProcessing(true);
                                const {request} = await publicClient.simulateContract({
                                    address: ScrollSepolia,
                                    abi: CommonABI,
                                    functionName: 'submitReport',
                                    args: [
                                        details, location, cID, category, severity_score
                                    ],
                                    account
                                })
                                const tx = await walletClient.writeContract(request);
                                setProcessing(false);
                                utils.toast.success(
                                    <>
                                        <p>Report submitted successfully!</p>
                                        <p>View <a target={'_blank'} className={'underline'}
                                                   href={`https://scroll-sepolia.blockscout.com/tx/${tx}`}>Transaction.</a>
                                        </p>
                                    </>
                                )
                                navigate(ROUTES.app.reports);
                            });


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
