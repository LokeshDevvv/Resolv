import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {RouterProvider} from "react-router-dom";
import {AppRouter} from "@/config/router.tsx";
import {DynamicContextProvider} from '@dynamic-labs/sdk-react-core';
import {EthereumWalletConnectors} from "@dynamic-labs/ethereum";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <DynamicContextProvider
            settings={{
                environmentId: '0890eecf-d68a-4d99-985f-2665ba32bb90',
                walletConnectors: [EthereumWalletConnectors],
                cssOverrides: <link rel={'stylesheet'} href={'https://cdn.webxspark.com/hackathons/ethbangkok/dynamic-shadow-dom.css'} />
            }}>
            <RouterProvider router={AppRouter}/>
        </DynamicContextProvider>
    </StrictMode>,
)
