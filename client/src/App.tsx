import {RouterProvider} from "react-router-dom";
import {AppRouter} from "@/config/router.tsx";
import {DynamicUserProfile} from "@dynamic-labs/sdk-react-core";

const MainApp = () => {
    return (
        <div>
            <DynamicUserProfile />
            <RouterProvider router={AppRouter}/>
        </div>

    );
};
export default MainApp;