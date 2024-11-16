import { Button } from "@/components/ui/button.tsx";
import demoImg from "@/assets/demo.jpeg";
import { ArrowUpRight } from "lucide-react";

const AppDashboard = () => {
    return (
        <div className={'p-4 border-[2px] rounded-lg'}>
            <div className={'flex items-center justify-between'}>
                <div className={'space-y-1'}>
                    <h1 className={'font-semibold font-epilogue'}>jane doe</h1>
                    <p className={'text-gray-500 font-epilogue font-medium text-sm'}>
                        December 12, 2024
                    </p>
                </div>
                <div className={'flex items-center justify-center gap-x-2'}>
                    <div className={'bg-[#000] text-[#B9FF66] text-sm font-medium px-1.5 py-0.5 rounded-md'}>
                        Land Hazard
                    </div>
                    <div className={'bg-[#b9ff66] text-[#000] text-sm font-medium px-1.5 py-0.5 rounded-md'}>
                        High Priority
                    </div>
                </div>
            </div>
            <div className={'mt-4'}>
                <h1 className={'text-lg font-epilogue font-semibold'}>Instagram’da Bu Sorunu Nasıl Çözeceğim</h1>
                <div className={'flex items-center flex-wrap gap-3 mt-4'}>
                    <img alt={'proof_image'} className={'max-h-[250px] h-auto rounded-3xl'} src={demoImg} />
                    <img alt={'proof_image'} className={'max-h-[250px] h-auto rounded-3xl'} src={demoImg} />
                </div>
                <div className={'mt-4 flex flex-col items-start md:flex-row md:items-center gap-3 justify-between'}>
                    <div className={'flex items-center gap-x-6'}>
                        <div className={'flex items-center gap-x-2'}>
                            <Button variant={'outline'}
                                className={'border-black rounded-full py-5'}>Upvote</Button>
                            <p className={'text-[#4A8209] font-semibold'}>2.4k</p>
                        </div>
                        <div className={'flex items-center gap-x-2'}>
                            <Button variant={'outline'} className={'border-black rounded-full py-5'}>Down vote
                            </Button>
                            <p className={'text-[#B20707] font-semibold'}>2.4k</p>
                        </div>
                    </div>
                    <Button variant={'outline'}
                        className={'text-[#B20707] border-[#B20707] rounded-full py-5'}>Report</Button>
                </div>
                <div className={'mt-4'}>
                    <Button className={'bg-[#b9ff66] hover:bg-[#a3ff66] border-[#4A8209] border-[1.6px] rounded-full w-full text-black'}>Mint <ArrowUpRight className={'size-5'} /></Button>
                </div>
            </div>
        </div>
    );
};

export default AppDashboard;