import React from 'react';
import {AppContext} from "@/views/app/contexts/app-context.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ArrowUpRight, Paperclip} from "lucide-react";

const NewReport = () => {
    const {API, utils} = React.useContext(AppContext);
    const fileInputRef = React.useRef<null | HTMLInputElement>(null);
    const [file, setFile] = React.useState<File | null>(null);
    API.components.category.setDisplay(false);

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
                        setFile(compressedFile);
                        // create a blob url of the compressed image
                        const blobUrl = URL.createObjectURL(compressedFile);
                        console.log(blobUrl);
                    // @ts-ignore
                    }, files[0].type, 0.5);
                }
            }
            img.src = e.target?.result as string;
        }
        // @ts-ignore
        reader.readAsDataURL(files[0]);

    };
    return (
        <div>
            <h1 className={'text-lg font-semibold'}>Create a new report</h1>
            <form className={'mt-6 space-y-4'}>
                <div className={'space-y-1'}>
                    <Label htmlFor={"report-title"}>Title</Label>
                    <Input
                        id={'report-title'}
                        className={'py-5 rounded-xl border-black'}
                    />
                </div>
                <div className={'space-y-1'}>
                    <Label htmlFor={'report-description'}>Description</Label>
                    <Textarea
                        id={'report-description'}
                        rows={4}
                        className={'rounded-xl border-black resize-none'}
                    />
                </div>
                <div className={'flex items-center gap-x-4'}>
                    <input onChange={handleFileUpload} type={'file'} className={'hidden'} ref={fileInputRef} accept={'image/*'} multiple={false}/>
                    <Button onClick={() => fileInputRef.current?.click()} type={'button'}
                            className={'bg-[#F8F8FD] text-[#515B6F] outline-dashed border-t-transparent outline-2'}
                            variant={'outline'}>
                        <Paperclip className={'size-5 mr-1 text-[#4A8209]'}/> Attach Photos
                    </Button>
                    <Button onClick={() => fileInputRef.current?.click()} type={'button'}
                            className={'bg-[#F8F8FD] text-[#515B6F] outline-dashed border-t-transparent outline-2'}
                            variant={'outline'}>
                        <Paperclip className={'size-5 mr-1 text-[#4A8209]'}/> Attach Videos
                    </Button>
                </div>
                {file && <p className={'text-gray-500'}>
                    <b>Selected: </b> {file.name}
                </p>}
                <div className={'pt-5'}>
                    <Button
                        className={'bg-[#b9ff66] hover:bg-[#a3ff66] border-[#4A8209] border-[1.6px] rounded-full w-full text-black py-6 text-lg font-semibold'}>
                        Submit Report <ArrowUpRight className={'size-8'}/>
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default NewReport;