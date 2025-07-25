import AppNavbar from "@/views/app/components/navbar.tsx";
import {Button} from "@/components/ui/button.tsx";
import AppAside from "@/views/app/components/appAside.tsx";
import {Outlet, useNavigate} from "react-router-dom";
import React from "react";
import {AppContext} from "@/views/app/contexts/app-context.tsx";
import {cn} from "@/lib/utils.ts";
import {useDynamicContext, useIsLoggedIn, useSwitchNetwork} from '@dynamic-labs/sdk-react-core';
import {ROUTES} from "@/constants/routes.tsx";
import {getWeb3Provider, getSigner} from '@dynamic-labs/ethers-v6'
import {sapphireTestnet, scrollSepolia} from "viem/chains"
import {createPublicClient, createWalletClient, custom, http} from "viem";
import {OasisContractABI, OasisContractAddress} from "@/constants/oasis-contract.ts";
import Preloader from "@/components/ui/preloader.tsx";
import {getIpLocation, stringToBytes32} from "@/views/app/components/apis.ts";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import NetworkSwitcher from "@/views/app/components/network-switcher.tsx";
import {GlobalContext} from "@/contexts/global-context.tsx";

const publicClient = createPublicClient({
    chain: sapphireTestnet,
    transport: http()
})
const walletClient = createWalletClient({
    chain: sapphireTestnet,
    transport: custom(window.ethereum)
})

const App = () => {
    const {networks, setWalletTools} = React.useContext(GlobalContext)
    const {primaryWallet, network} = useDynamicContext();
    const [view, setView] = React.useState('loading');
    const [verifying, setverifying] = React.useState(false);
    const {components} = React.useContext(AppContext);
    const [transactionHash, setTransactionHash] = React.useState('');
    const switchNetwork = useSwitchNetwork();
    const {utils} = React.useContext(AppContext)
    const {user} = useDynamicContext();
    const isLoggedIn = useIsLoggedIn();
    const isMounted = React.useRef(false);
    const navigate = useNavigate();
    const isVerificationCheckDone = React.useRef(false);
    const [currentNetwork, setCurrentNetwork] = React.useState(0);
    React.useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            checkLoginStatus();
            // refreshNwTools();
        }
    }, []);

    React.useEffect(() => {
        // @ts-ignore
        setWalletTools(networks[network])
    }, [network])

    React.useEffect(() => {
        if (primaryWallet && !isVerificationCheckDone.current) {
            checkIsUserVerified();
            isVerificationCheckDone.current = true
        }
    }, [primaryWallet]);

    React.useEffect(() => {
        checkLoginStatus();
    }, [isLoggedIn]);

    function checkLoginStatus() {
        if (!isLoggedIn) {
            navigate(ROUTES.home);
        }
    }

    async function checkIsUserVerified() {
        if (localStorage.getItem("__verified") && localStorage.getItem("__verified") === primaryWallet?.address) {
            setCurrentNetwork(scrollSepolia.id)
            setView('content');
            return;
        }
        if (localStorage.getItem("__verified")) {
            localStorage.removeItem("__verified");
        }
        switchNetwork({
            wallet: primaryWallet,
            network: sapphireTestnet.id
        }).then(() => {
            publicClient.readContract({
                address: OasisContractAddress,
                abi: OasisContractABI,
                functionName: 'isVerified',
                args: [primaryWallet?.address]
            }).then(data => {
                console.log(data, primaryWallet?.getNetwork());
                if (data === true) {
                    localStorage.setItem("__verified", primaryWallet?.address || "");
                    switchNetwork({
                        wallet: primaryWallet,
                        network: scrollSepolia.id
                    }).then(() => {
                        setView('content');
                    })
                } else {
                    setView('verify');
                }
            })
        })
    }

    async function startOasisVerification() {
        const [account] = await walletClient.getAddresses()
        setverifying(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const {latitude, longitude} = position.coords;
            }, (error) => {
                console.error(error);
                utils.toast.error("Something went wrong while fetching your location. Please try again later.")
            }, {
                enableHighAccuracy: true,
                timeout: 30000,
                maximumAge: 0
            });
        }
        const ipDetails = await getIpLocation();
        const city = ipDetails.context.content.city;
        const userData = {
            name: user?.firstName + " " + user?.lastName,
            email: user?.email,
            city
        };
        // hash userData
        const userByte32 = stringToBytes32(JSON.stringify(userData));

        const {request} = await publicClient.simulateContract({
            address: OasisContractAddress,
            abi: OasisContractABI,
            functionName: 'createVerification',
            args: [userData.email, 2592000, userByte32],
            account
        })
        const tx = await walletClient.writeContract(request);
        setverifying(false);
        setView('content');
        utils.toast.success(
            <>
                You have been successfully verified using <b>Oasis Private Layer</b>.
                View <a target={'_blank'} className='text-blue-500 hover:underline'
                        href={`https://explorer.oasis.io/testnet/sapphire/tx/${tx}`}>
                Transaction.
            </a>
            </>
        )
    }

    return (
        <div>
            <AppNavbar/>
            {
                view === "loading" && <Preloader/>
                || view === "content" && <div className={'mt-6 mx-6'}>
                    <div className={'grid grid-cols-12 gap-8'}>
                        <div
                            className={cn('md:col-span-3 col-span-12 space-y-5', !components.category.display && "hidden", 'order-3 md:order-none')}>
                            <div className={'p-4 border-[2px] rounded-lg'}>
                                <h1 className={'text-lg font-semibold'}><span className={'text-[#4A8209]'}>ReportDAO</span>,
                                    1,28,000 users have contributed to a better society.</h1>
                                <p className={'text-[#575757] pt-2'}>
                                    Help us grow our network to be a part of our journey
                                </p>
                                <div className={'mt-6'}>
                                    <Button className={'py-5 text-[#4A8209] border-[#4A8209] w-full'} variant={'outline'}>Help
                                        us now</Button>
                                </div>
                                <div className={'mt-3 text'}>
                                    <Button className={'w-full'} variant={'link'}>Help Later</Button>
                                </div>
                            </div>
                            </div>
                        <div
                            className={cn('md:col-span-7 col-span-12', !components.category.display && 'md:col-span-10 col-span-12', 'order-2 md:order-none')}>
                            <Outlet/>
                        </div>
                        <div className={'md:col-span-2 col-span-12 order-1 md:-order-none'}>
                            <div className={' border-[2px] rounded-lg'}>
                                <AppAside/>
                            </div>
                        </div>
                    </div>
                </div>
                || view === "verify" && <div className={'flex items-center justify-center h-[80dvh]'}>
                    <div className={'p-4 border-[2px] rounded-lg'}>
                        <h1 className={'text-lg font-semibold'}>
                            Please verify yourself first using <span className={'text-[#0300e1] font-black'}>Oasis Private Layer</span>
                        </h1>
                        <div className={'flex justify-end mt-4'}>
                            <Button disabled={verifying} onClick={startOasisVerification}
                                    className={'bg-[#4A8209] hover:bg-[#2A8209] py-6 rounded-full'} variant={'default'}>
                                {verifying && "Please wait..." || "Verify Now"}
                            </Button>
                        </div>
                    </div>
                </div>
            }
            <NetworkSwitcher chainID={currentNetwork}/>
        </div>
    );
};

export default App;