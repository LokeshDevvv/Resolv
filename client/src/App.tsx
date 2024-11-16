import React from 'react';
import {RouterProvider} from "react-router-dom";
import {AppRouter} from "@/config/router.tsx";
import {GlobalContext} from "@/contexts/global-context.tsx";
import {DynamicUserProfile, useDynamicContext} from "@dynamic-labs/sdk-react-core";
import {getWeb3Provider, getSigner,} from '@dynamic-labs/ethers-v6'
const MainApp = () => {
    // const isMounted = React.useRef(false);
    // const {user, primaryWallet, handleLogOut} = useDynamicContext();

    // React.useEffect(() => {
    //     if (authLayer.primaryWallet !== null) {
    //         console.log(authLayer.primaryWallet)
    //     }
    // }, [authLayer.primaryWallet])

    return (
        <div>
            <DynamicUserProfile />
            <RouterProvider router={AppRouter}/>
        </div>

    );
};
export default MainApp;