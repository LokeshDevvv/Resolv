import {Button} from "@/components/ui/button.tsx";
import illustration from "./assets/illustration.svg";
import {Link} from "react-router-dom";
import Logo from "@/components/logo.tsx";
// import {DynamicWidget} from '@dynamic-labs/sdk-react-core';


const LandingPage = () => {
    return (
        <div className={'px-12'}>
            {/*  Navbar  */}
            <div className={'py-8 flex justify-between items-center'}>
                <Logo />
                <div className={'flex space-x-4'}>
                    <Link to={"/auth"}>
                        <Button variant={'outline'} className={'border-black border-[1.5px] py-6'}>Connect Wallet</Button>
                    </Link>
                    {/*<DynamicWidget innerButtonComponent={"Connect Wallet"} />*/}
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
                                Our AI agents will verify it and bckbvjbvjbjnejvjdjcd dnbdkbvd
                                vjdbvjdkbvkjdbvkdbvkdbvjkdvdvjkdb vdvjdbvjdbvdjbvjdabvjdabvjdabvjdbvmd,v ,dmvdvdabvadmv
                                damv
                                davb dm vd,vb da vdvd vkd vd v dvndzknv dn,v ndv ndv
                            </p>
                            <Button className={'py-6'}>Verify User</Button>
                        </div>
                    </div>
                    <div className={'relative'}>
                        <img src={illustration} alt={'landing-illustration'} className={'fixed h-[75dvh]'}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;