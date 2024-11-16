import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {DynamicContextProvider} from '@dynamic-labs/sdk-react-core';
import {EthereumWalletConnectors} from "@dynamic-labs/ethereum";

import MainApp from "@/App.tsx";
import {GlobalContextProvider} from "@/contexts/global-context.tsx";
const evmNetworks = [
    {
        blockExplorerUrls: ['https://explorer.oasis.io/testnet/sapphire/'],
        chainId: 23295,
        chainName: 'Oasis Sapphire Testnet',
        iconUrls: ['https://chainlist.org/unknown-logo.png'],
        name: 'Sapphire',
        nativeCurrency: {
            decimals: 18,
            name: 'TEST',
            symbol: 'TEST',
            iconUrl: 'https://chainlist.org/unknown-logo.png',
        },
        networkId: 23295,

        rpcUrls: ['https://testnet.sapphire.oasis.io'],
        vanityName: 'Sapphire Testnet',
    },
    {
        blockExplorerUrls: ['https://sepolia.scrollscan.com'],
        chainId: 534351,
        chainName: 'Scroll Sepolia Testnet',
        iconUrls: ['https://icons.llamao.fi/icons/chains/rsz_scroll.jpg'],
        name: 'Scroll',
        nativeCurrency: {
            decimals: 18,
            name: 'ETH',
            symbol: 'ETH',
            iconUrl: 'https://icons.llamao.fi/icons/chains/rsz_scroll.jpg',
        },
        networkId: 534351,

        rpcUrls: ['https://sepolia-rpc.scroll.io'],
        vanityName: 'Scroll Sepolia Testnet',
    },
]
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <DynamicContextProvider
            settings={{
                environmentId: '0890eecf-d68a-4d99-985f-2665ba32bb90',
                walletConnectors: [EthereumWalletConnectors],
                overrides: { evmNetworks },
                cssOverrides: <link rel={'stylesheet'}
                                    href={'https://cdn.webxspark.com/hackathons/ethbangkok/dynamic-shadow-dom.css'}/>,
                events: {
                    onLogout: (args) => {
                        console.log(args)
                        // localStorage.removeItem('__verified')
                    }
                }

            }}>
            {/*    <RouterProvider router={AppRouter}/>*/}
            {/*    /!*<DynamicWidget />*!/*/}
            <GlobalContextProvider>
                <MainApp/>
            </GlobalContextProvider>
        </DynamicContextProvider>
    </StrictMode>,
)
