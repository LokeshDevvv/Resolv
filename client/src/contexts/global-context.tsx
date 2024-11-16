import React from "react";
import {useDynamicContext} from "@dynamic-labs/sdk-react-core";
import {getWeb3Provider, getSigner,} from '@dynamic-labs/ethers-v6'

type GlobalContextProps = {
    authLayer: {
        primaryWallet: any,
        web3Provider?: typeof getWeb3Provider,
        signer: typeof getSigner
    },
    isAuthenticated: boolean,
    user: {
        email: string,
        walletAddress: string,
        username: string
    },
    API: {
        user: {
            setEmail: (email: string) => void,
            setWalletAddress: (walletAddress: string) => void,
            setUsername: (username: string) => void
        },
        setAuthenticated: (isAuthenticated: boolean) => void
    }
}

const GlobalContext = React.createContext<GlobalContextProps>({} as GlobalContextProps);


const GlobalContextProvider = ({children}: { children: React.ReactNode }) => {
    const {primaryWallet, handleLogOut} = useDynamicContext();
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [walletAddress, setWalletAddress] = React.useState('');
    const [username, setUsername] = React.useState('');

    const out: GlobalContextProps = {
        authLayer: {
            primaryWallet: primaryWallet,
            web3Provider: getWeb3Provider,
            signer: getSigner
        },
        isAuthenticated: isAuthenticated,
        user: {
            email: email,
            walletAddress: walletAddress,
            username: username
        },
        API: {
            user: {
                setEmail: setEmail,
                setWalletAddress: setWalletAddress,
                setUsername: setUsername
            },
            setAuthenticated: setIsAuthenticated
        }
    }
    return (
        <GlobalContext.Provider value={out}>
            {children}
        </GlobalContext.Provider>
    );
};

export {GlobalContext, GlobalContextProvider};