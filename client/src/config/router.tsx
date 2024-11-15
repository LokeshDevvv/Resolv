import {createBrowserRouter} from 'react-router-dom';
import SuspenseWrapper from "@/components/suspense-wrapper.tsx";
import {lazy} from "react";
import AppDashboard from "@/views/app/views/dashboard.tsx";
import {ROUTES} from "@/constants/routes.tsx";

const LandingPage = lazy(() => import("@/views/landing"));
const AuthPage = lazy(() => import("@/views/auth"));
const App = lazy(() => import("@/views/app"));
const MyReports = lazy(() => import("@/views/app/views/my-reports.tsx"));

const AppRouter = createBrowserRouter([
    {
        path: ROUTES.home,
        element: <SuspenseWrapper><LandingPage/></SuspenseWrapper>
    },
    {
        path: '/auth',
        element: <SuspenseWrapper><AuthPage /></SuspenseWrapper>
    },
    {
        path: ROUTES.app._base,
        element: <SuspenseWrapper><App /></SuspenseWrapper>,
        children: [
            {
                path: ROUTES.app.dashboard,
                element: <SuspenseWrapper><AppDashboard /></SuspenseWrapper>
            },
            {
                path: `${ROUTES.app.reports}`,
                element: <SuspenseWrapper><MyReports /></SuspenseWrapper>
            },
            {
                path: ROUTES.app['create-report'],
                element: <SuspenseWrapper><div>Create new report</div></SuspenseWrapper>
            },
            {
                path: ROUTES.app.rewards,
                element: <SuspenseWrapper><div>Reward Points</div></SuspenseWrapper>
            },
            {
                path: ROUTES.app['follow-us'],
                element: <SuspenseWrapper><div>Follow Us</div></SuspenseWrapper>
            },
            {
                path: ROUTES.app['help-feedback'],
                element: <SuspenseWrapper><div>Help & Feedback</div></SuspenseWrapper>
            }
        ]
    }
]);

export {AppRouter};