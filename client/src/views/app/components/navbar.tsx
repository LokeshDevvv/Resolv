import Logo from "@/components/logo.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Bell, LogOut, MessageCircle, Search} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Button} from "@/components/ui/button.tsx";
import React from "react";
import {AppContext} from "@/views/app/contexts/app-context.tsx";
import {useLocation} from "react-router-dom";
import {ROUTES} from "@/constants/routes.tsx";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {DynamicWidget, useDynamicContext} from "@dynamic-labs/sdk-react-core";
import {PiSealCheck} from "react-icons/pi";
import {GlobalContext} from "@/contexts/global-context.tsx";
import {CommonABI} from "@/constants/multichain-contracts.ts";

const AppNavbar = () => {
    const {API, components} = React.useContext(AppContext);
    const {walletTools, user: gUser} = React.useContext(GlobalContext);
    const {primaryWallet, handleLogOut, user} = useDynamicContext();
    const location = useLocation();
    const isMounted = React.useRef(false)
    React.useEffect(() => {
        // check if the current path is in the aside links
        const isPathInAsideLinks = Object.values(ROUTES.app).includes(location.pathname);
        // if the current path is in the aside links, set the pointer
        if (isPathInAsideLinks) {
            API.components.aside.setPointer(location.pathname);
        }

        if (!components.category.display) {
            API.components.category.setDisplay(true);
        }
    }, [location.pathname]);

    function loadUserDetails() {
        if(walletTools !== null){
            walletTools.publicClient.readContract({
                address: walletTools.address,
                abi: CommonABI,
                functionName: 'getUserProfile',
                args: [primaryWallet?.address]
            }).then(resp => {
                const points = parseInt(resp[0]);
                const reports = parseInt(resp[1])
                gUser.setPoints(points);
                gUser.setReportsSubmitted(reports);
            })
        }
    }

    React.useEffect(() => {
        if (!isMounted.current && walletTools) {
            isMounted.current = true;
            loadUserDetails()
        }
    }, [walletTools])

    return (
        <div className={'border-b shadow-sm'}>
            <div className={'my-6 mx-6'}>
                <div className={'flex justify-between gap-x-4 items-center'}>
                    <Logo/>
                    <div className={'w-full md:flex items-center justify-center hidden'}>
                        <div className={'relative w-[75%]'}>
                            <Input className={'rounded-full bg-[#EBEBEB] text-black py-5'}
                                   placeholder={'Search anything'}/>
                            <Search className={'size-4 absolute bottom-3 right-4'}/>
                        </div>
                    </div>
                    <div className={'flex items-center gap-8'}>
                        <DynamicWidget/>
                        {/*<div className={'relative cursor-pointer active:translate-y-[1px]'}>*/}
                        {/*    <MessageCircle className={'size-5'}/>*/}
                        {/*    <div*/}
                        {/*        className={'absolute -top-2 w-full -right-3 rounded-[100%] bg-[#FF4F4F] text-white flex items-center justify-center text-sm'}>1*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        {/*<div className={'relative cursor-pointer active:translate-y-[1px]'}>*/}
                        {/*    <Bell className={'size-5'}/>*/}
                        {/*    <div*/}
                        {/*        className={'absolute -top-2 w-full -right-3 rounded-[100%] bg-[#FF4F4F] text-white flex items-center justify-center text-sm'}>1*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        <div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant={'outline'} size={'icon'} className={'rounded-full'}>
                                        <Avatar>
                                            <AvatarImage src="https://github.com/shadcn.png" alt="User"/>
                                            <AvatarFallback>U</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="min-w-56" align="end" forceMount>
                                    <div className={'m-2'}>
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex gap-x-2 items-center">
                                                <Avatar>
                                                    <AvatarImage src="https://github.com/shadcn.png" alt="User"/>
                                                    <AvatarFallback>U</AvatarFallback>
                                                </Avatar>
                                                <div className='flex flex-col space-y-1'>
                                                    <p className="text-base font-medium leading-none flex items-center gap-x-1">
                                                        {user?.firstName + " " + user?.lastName}
                                                        <PiSealCheck className={'size-4'}/>
                                                    </p>
                                                    <p className="text-sm leading-none text-muted-foreground">
                                                        {user?.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator/>
                                        <DropdownMenuGroup>
                                            {/*<DropdownMenuItem>*/}
                                            {/*</DropdownMenuItem>*/}

                                            <div className={'flex items-center gap-x-3 mt-2'}>
                                                <p>
                                                    <b>Points:</b> {gUser.points}
                                                </p>
                                                <p>
                                                    <b>Reports:</b> {gUser.reportsSubmitted}
                                                </p>
                                            </div>
                                            <DropdownMenuSeparator/>
                                            <DropdownMenuItem onClick={() => {
                                                window.confirm("Are you sure want to logout?") && handleLogOut()
                                            }}>
                                                <Button variant={'link'}><LogOut/> Logout
                                                </Button>
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppNavbar;