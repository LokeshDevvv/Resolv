import {cn} from "@/lib/utils.ts";
import {LoaderCircle} from "lucide-react";

type PreloaderProps = {
    className?: string;
    loaderClassName?: string;
};
const Preloader = ({className, loaderClassName}: PreloaderProps) => {
    return (
        <div className={cn("h-[90dvh] flex items-center justify-center", className)}>
            <div className={'bg-[#B9FF66] p-2 rounded-full'}>
                <LoaderCircle className={cn('animate-spin size-6', loaderClassName)} />
            </div>
        </div>
    );
};

export default Preloader;