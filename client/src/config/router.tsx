import {createBrowserRouter} from 'react-router-dom';
import SuspenseWrapper from "@/components/suspense-wrapper.tsx";
import {lazy} from "react";

const LandingPage = lazy(() => import("@/views/landing.tsx"));

const AppRouter = createBrowserRouter([
    {
        path: "/",
        element: <SuspenseWrapper><LandingPage/></SuspenseWrapper>
    }
]);

export {AppRouter};