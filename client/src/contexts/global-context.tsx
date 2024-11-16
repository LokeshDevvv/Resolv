import React from "react";
import {useDynamicContext} from "@dynamic-labs/sdk-react-core";
import {getWeb3Provider, getSigner,} from '@dynamic-labs/ethers-v6'
import {createPublicClient, createWalletClient, custom, http} from "viem";
import {baseSepolia, polygonZkEvmTestnet, scrollSepolia, zircuitTestnet} from "viem/chains";

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
        534351: {
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
                address: '0x562db143B891D2D05A9e8B72c7DA59077E66A081'
            },
            534351: {
                publicClient: createPublicClient({
                    chain: scrollSepolia,
                    transport: http()
                }),
                walletClient: createWalletClient({
                    chain: scrollSepolia,
                    transport: custom(window.ethereum)
                }),
                block_explorer: 'https://scroll-sepolia.blockscout.com/tx',
                address: '0x13d31A2Eac646a6828b7A118204077Fb790fc0B7'
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
                address: '0x82B66862E605d5365128dcA5709Ab598b31D0e34'
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
                address: "0xB6dd2F403c14bB495B505724b4dA21582a1377aB"
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