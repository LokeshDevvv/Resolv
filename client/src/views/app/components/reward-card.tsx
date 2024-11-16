import {ArrowUpRight, Gift, Truck} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";

type RewardCardProps = {
    title: string;
    description: string;
    points: number;
    image: string;
    onClick: () => void;
}
const RewardCard = (
    {title, description, points, image, onClick}: RewardCardProps
) => {
    return (
        <div className={'rounded-2xl border-[2px]'}>
            <div className={'max-w-sm rounded overflow-hidden flex items-center justify-center'}>
                <img src={image} className={'rounded-t-xl object-fit h-[100px] py-4'} alt={title}/>
            </div>
            <div className={'p-4'}>
                <h1 className={'text-lg font-bold font-epilogue'}>
                    {title}
                </h1>
                <p className={'text-sm text-gray-600'}>{description}</p>

                <div className={'mt-3'}>
                    <h1 className={'text-base font-bold'}>{points} Points</h1>
                    <div className={'border-[1px] my-2'}/>
                    <div className={'flex text-gray-600 items-center gap-x-4'}>
                        <div className={'flex items-center'}>
                            <Truck className={'size-4 mr-1'}/>
                            <span className={'text-sm'}>Free Shipping</span>
                        </div>
                        <div className={'flex items-center'}>
                            <Gift className={'size-4 mr-1'}/>
                            <span className={'text-sm'}>Free Gift</span>
                        </div>
                    </div>
                </div>
                <div className={'mt-2'}>
                    <Button onClick={onClick}
                            className={'w-full bg-[#4A8209] hover:bg-[#1A8209] rounded-full py-5 text-white text-lg'}>
                        Redeem <ArrowUpRight className={'size-4'}/>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RewardCard;