import {createBrowserRouter} from 'react-router-dom';
import SuspenseWrapper from "@/components/suspense-wrapper.tsx";
import {lazy} from "react";
import AppDashboard from "@/views/app/views/dashboard.tsx";
import {ROUTES} from "@/constants/routes.tsx";
import {AppContextProvider} from "@/views/app/contexts/app-context.tsx";

const LandingPage = lazy(() => import("@/views/landing"));
const AuthPage = lazy(() => import("@/views/auth"));
const App = lazy(() => import("@/views/app"));
const MyReports = lazy(() => import("@/views/app/views/my-reports.tsx"));
const NewReport = lazy(() => import("@/views/app/views/new-report.tsx"));
const AppRewards = lazy(() => import("@/views/app/views/rewards.tsx"));

const AppRouter = createBrowserRouter([
    {
        path: ROUTES.home,
        element: <SuspenseWrapper><LandingPage/></SuspenseWrapper>
    },
    {
        path: ROUTES.auth,
        element: <SuspenseWrapper><AuthPage/></SuspenseWrapper>
    },
    {
        path: ROUTES.app._base,
        element: <AppContextProvider>
            <SuspenseWrapper>
                <App/>
            </SuspenseWrapper>
        </AppContextProvider>,
        children: [
            {
                path: ROUTES.app.dashboard,
                element: <SuspenseWrapper><AppDashboard/></SuspenseWrapper>
            },
            {
                path: `${ROUTES.app.reports}`,
                element: <SuspenseWrapper><MyReports/></SuspenseWrapper>
            },
            {
                path: ROUTES.app['create-report'],
                element: <SuspenseWrapper><NewReport/></SuspenseWrapper>
            },
            {
                path: ROUTES.app.rewards,
                element: <SuspenseWrapper>
                   <AppRewards />
                </SuspenseWrapper>
            },
            {
                path: ROUTES.app['follow-us'],
                element: <SuspenseWrapper>
                    <div>Follow Us</div>
                </SuspenseWrapper>
            },
            {
                path: ROUTES.app['help-feedback'],
                element: <SuspenseWrapper>
                    <div>Help & Feedback</div>
                </SuspenseWrapper>
            }
        ]
    }
]);

export {AppRouter};