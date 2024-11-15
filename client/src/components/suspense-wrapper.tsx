import React from "react";
import Preloader from "@/components/ui/preloader.tsx";

type SuspenseWrapperProps = {
    className?: string;
    fallback?: React.ReactNode;
    children: React.ReactNode;
}
const SuspenseWrapper = ({className, fallback, children}: SuspenseWrapperProps) => {
    return (
        <React.Suspense
            fallback={fallback || <Preloader className={className}/>}
        >
            {children}
        </React.Suspense>
    );
};

export default SuspenseWrapper;