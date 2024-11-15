import React from 'react';
import {cn} from "@/lib/utils.ts";
import { PiArrowCircleRightThin } from "react-icons/pi";
import demoImg from "@/assets/demo.jpeg";
import { BiUpvote } from "react-icons/bi";
const MyReports = () => {

    const Card = () => {
        const [isActive, setIsActive] = React.useState<boolean>(false);
        return (
            <div>
                <div
                    className={
                        cn('p-4 border-[2px] rounded-lg', isActive && 'border-[#000] duration-200 rounded-t-lg rounded-b-none')
                    }
                >
                    <div onClick={() => setIsActive(!isActive)}
                         className={'flex cursor-pointer items-center justify-between'}>
                        <div className={'flex items-center gap-x-4'}>
                            <h1 className={'font-bold text-lg font-epilogue'}>
                                Vehicle in No Parking
                            </h1>
                            <div className={'flex items-center justify-center gap-x-2'}>
                                <div
                                    className={'bg-[#000] text-[#B9FF66] text-sm font-medium px-1.5 py-0.5 rounded-md'}>
                                    Land Hazard
                                </div>
                                <div
                                    className={'bg-[#b9ff66] text-[#000] text-sm font-medium px-1.5 py-0.5 rounded-md'}>
                                    High Priority
                                </div>
                            </div>
                        </div>
                        <div>
                            <PiArrowCircleRightThin
                                className={cn('rotate-45 size-12 duration-200', isActive && "-rotate-45")}/>
                        </div>
                    </div>
                    {
                        isActive && <div className={''}>
                            <p className={'text-base font-epilogue'}>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci, alias aspernatur, atque
                                autem consectetur, Adipisci, alias aspernatur, atque autem consectetur.
                            </p>
                            <div className={'flex items-center flex-wrap gap-x-3 mt-4'}>
                                <img alt={'proof_image'} className={'max-h-[200px] h-auto rounded-3xl'} src={demoImg}/>
                                <img alt={'proof_image'} className={'max-h-[200px] h-auto rounded-3xl'} src={demoImg}/>
                                <div className={'flex flex-col'}>
                                    <div className={'flex text-lg items-center text-[#4A8209]'}>
                                        <BiUpvote className={'mr-1'}/> <span className={'font-semibold'}>2.4k</span>
                                    </div>
                                    <div className={'flex text-lg items-center text-[#B20707]'}>
                                        <BiUpvote className={'mr-1 rotate-180'}/> <span
                                        className={'font-semibold'}>2.4k</span>
                                    </div>
                                    <div className={'flex text-lg items-center text-[#B20707]'}>
                                        <span className={'font-semibold'}>{0} Reports</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
                {
                    isActive && <div className={'bg-[#B9FF66] text-[#4A8209]'}>
                    <h1 className={'text-lg p-4 font-semibold border-[2px] border-black border-t-transparent rounded-b-lg'}>
                        Verification Status: Success
                    </h1>
                    </div>
                }
            </div>
        )
    }

    return (
        <div className={'space-y-5'}>
            <Card/>
            <Card/>
        </div>
    );
};

export default MyReports;