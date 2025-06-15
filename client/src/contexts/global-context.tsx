import React from "react";
import {useDynamicContext} from "@dynamic-labs/sdk-react-core";
import {getWeb3Provider, getSigner,} from '@dynamic-labs/ethers-v6'
import {createPublicClient, createWalletClient, custom, http} from "viem";
import {baseSepolia, polygonZkEvmTestnet, sapphireTestnet, zircuitTestnet} from "viem/chains";

type GlobalContextProps = {
    primaryWallet: any,
    walletTools: any,
    setWalletTools: (tools: any) => void,
    user: {
        points: number,
        reportsSubmitted: number,
        setPoints: (points: number) => void,
        setReportsSubmitted: (reports: number) => void
    },
    networks: {
        1442: {
            publicClient: typeof createPublicClient,
            walletClient: typeof createWalletClient,
            block_explorer: string,
            address: string
        },
        23295: {
            publicClient: typeof createPublicClient,
            walletClient: typeof createWalletClient,
            block_explorer: string,
            address: string
        },
        84532: {
            publicClient: typeof createPublicClient,
            walletClient: typeof createWalletClient,
            block_explorer: string,
            address: string
        },
        zircuit: {
            publicClient: typeof createPublicClient,
            walletClient: typeof createWalletClient,
            block_explorer: string,
            address: string
        }
    }
}

const GlobalContext = React.createContext<GlobalContextProps>({} as GlobalContextProps);


const GlobalContextProvider = ({children}: { children: React.ReactNode }) => {
    const { primaryWallet } = useDynamicContext();
    const [userPoints, setUserPoints] = React.useState<number>(0);
    const [userReportsSubmitted, setUserReportsSubmitted] = React.useState<number>(0);
    const [walletTools, setWalletTools] = React.useState<any>(null);
    const out: GlobalContextProps = {
        primaryWallet,
        walletTools,
        setWalletTools,
        user: {
            points: userPoints,
            reportsSubmitted: userReportsSubmitted,
            setPoints: setUserPoints,
            setReportsSubmitted: setUserReportsSubmitted
        },
        networks: {
            1442: {
                publicClient: createPublicClient({
                    chain: polygonZkEvmTestnet,
                    transport: http(),
                }),
                walletClient: createWalletClient({
                    chain: polygonZkEvmTestnet,
                    transport: custom(window.ethereum)
                }),
                block_explorer: 'https://explorer-ui.cardona.zkevm-rpc.com/tx',
                address: '0x17910372dFfca2332391Ce04Bccc0f3e7959330F'
            },
            23295: {
                publicClient: createPublicClient({
                    chain: sapphireTestnet,
                    transport: http()
                }),
                walletClient: createWalletClient({
                    chain: sapphireTestnet,
                    transport: custom(window.ethereum)
                }),
                block_explorer: 'https://explorer.oasis.io/testnet/sapphire/tx',
                address: '0x05553E4A4276432c21AC54931566872554A62DE5'
            },
            84532: {
                publicClient: createPublicClient({
                    chain: baseSepolia,
                    transport: http()
                }),
                walletClient: createWalletClient({
                    chain: baseSepolia,
                    transport: custom(window.ethereum)
                }),
                block_explorer: 'https://base-sepolia.blockscout.com/tx',
                address: '0x6C142517a6afb661Ccb96566a6394917011c9428'
            },
            48899: {
                publicClient: createPublicClient({
                    chain: zircuitTestnet,
                    transport: http()
                }),
                walletClient: createWalletClient({
                    chain: zircuitTestnet,
                    transport: custom(window.ethereum)
                }),
                block_explorer: 'https://explorer.testnet.zircuit.com/tx',
                address: "0xD197b96051b32159104df4c172D0393e84EbcC1c"
            },
        }
    }
    return (
        <GlobalContext.Provider value={out}>
            {children}
        </GlobalContext.Provider>
    );
};

export {GlobalContext, GlobalContextProvider};