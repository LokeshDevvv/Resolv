import {Button} from "@/components/ui/button.tsx";
import illustration from "./assets/illustration.svg";
// import {Link} from "react-router-dom";
import Logo from "@/components/logo.tsx";
import {DynamicWidget} from '@dynamic-labs/sdk-react-core';
import {useIsLoggedIn} from '@dynamic-labs/sdk-react-core';
import {useNavigate} from "react-router-dom";
import {ROUTES} from "@/constants/routes.tsx";


const LandingPage = () => {
    const isLoggedIn = useIsLoggedIn();
    const navigate = useNavigate();
    return (
        <div className={'px-12'}>
            {/*  Navbar  */}
            <div className={'py-8 flex justify-between items-center'}>
                <Logo/>
                <div className={'flex space-x-4'}>
                    {/*<Link to={"/auth"}>*/}
                    {/*    <Button variant={'outline'} className={'border-black border-[1.5px] py-6'}>Connect Wallet</Button>*/}
                    {/*</Link>*/}
                    <DynamicWidget innerButtonComponent={"Connect Wallet"}/>
                </div>
            </div>
            {/*  Navbar End */}

            {/*  Hero Section  */}
            <div className={'mt-12'}>
                <div className={'grid grid-cols-2'}>
                    <div>
                        <h1 className={'font-bold text-5xl leading-normal'}>Report Incidents <br/>near you</h1>
                        <div className={'mt-6 space-y-5'}>
                            <p>
                                Aware was built with a unique approach to addressing urban issues while maintaining user privacy. We crafted a solution that leverages multiple blockchain protocols, each serving a specific purpose in our ecosystem.
                            </p>
                            <Button onClick={() => {
                                if (!isLoggedIn) {
                                    alert("Please login to continue!")
                                } else {
                                    navigate(ROUTES.app.dashboard)
                                }
                            }} className={'py-6'}>
                                {isLoggedIn ? "Go to App" : "Login to get started"}
                            </Button>
                        </div>
                    </div>
                    <div className={'relative -z-10'}>
                        <img src={illustration} alt={'landing-illustration'} className={'fixed h-[75dvh]'}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;