import React, { useState, useRef, useContext } from 'react';
import { AppContext } from "@/views/app/contexts/app-context.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ArrowUpRight, Paperclip } from "lucide-react";

const Verify = () => {
    const { API, utils } = useContext(AppContext);
    const fileInputRef = useRef<null | HTMLInputElement>(null);
    const [fileBase64, setFileBase64] = useState<string | null>(null);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    API.components.category.setDisplay(false);

    // Handle file upload
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            verify_text: `${title}: ${description}`,
            verify_image: fileBase64,
        };

        console.log("Payload JSON:", JSON.stringify(payload, null, 2));

        try {
            const response = await fetch("/api/verify-content", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            console.log("Response status:", response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error response from server:", errorText);
                utils.toast.error("Failed to submit the verification");
                return;
            }

            const result = await response.json();
            console.log("Parsed response:", result);
            utils.toast.success("Verification submitted successfully");
        } catch (error) {
            console.error("Network or other error:", error);
            utils.toast.error("An error occurred while submitting the verification");
        }
    };

    return (
        <div>
            <h1 className="text-lg font-semibold">Submit Verification</h1>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-1">
                    <Label htmlFor="verify-title">Title</Label>
                    <Input
                        id="verify-title"
                        className="py-5 rounded-xl border-black"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="verify-description">Description</Label>
                    <Textarea
                        id="verify-description"
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
                        <Paperclip className="size-5 mr-1 text-[#4A8209]" /> Attach Photos
                    </Button>
                    <Button onClick={() => fileInputRef.current?.click()} type={'button'}
                        className={'bg-[#F8F8FD] text-[#515B6F] outline-dashed border-t-transparent outline-2'}
                        variant={'outline'}>
                        <Paperclip className={'size-5 mr-1 text-[#4A8209]'} /> Attach Videos
                    </Button>
                </div>
                {fileBase64 && (
                    <p className="text-gray-500">
                        <b>Image uploaded successfully</b>
                    </p>
                )}
                <div className="pt-5">
                    <Button
                        type="submit"
                        className="bg-[#b9ff66] hover:bg-[#a3ff66] border-[#4A8209] border-[1.6px] rounded-full w-full text-black py-6 text-lg font-semibold"
                    >
                        Submit Verification <ArrowUpRight className="size-8" />
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Verify;
