import React, {useState, useEffect} from 'react';
import {cn} from "@/lib/utils.ts";
import {PiArrowCircleRightThin} from "react-icons/pi";
import demoImg from "@/assets/demo.jpeg";
import {BiUpvote} from "react-icons/bi";
import {GlobalContext} from "@/contexts/global-context.tsx";
import {useDynamicContext} from "@dynamic-labs/sdk-react-core";
import {CommonABI} from "@/constants/multichain-contracts.ts";
import dayjs from 'dayjs'
import {FILE_COIN_URL} from "@/constants/utils.ts";
interface MyReportsProps {
    reasonSeverityScore: number;
}

const MyReports: React.FC<MyReportsProps> = ({reasonSeverityScore}) => {
    const {walletTools} = React.useContext(GlobalContext);
    const {primaryWallet} = useDynamicContext();
    const isMounted = React.useRef(false);
    const [pageData, setPageData] = React.useState([]);
    React.useEffect(() => {
        if(!isMounted.current && walletTools){
            isMounted.current = true;
            walletTools.publicClient.readContract({
                address: walletTools.address,
                abi: CommonABI,
                functionName: 'getUserReports',
                args: [primaryWallet?.address, 0, 15]
            }).then(response => {
                const data = response[0]
                const temp_posts = [];
                data.map((post: any) => {
                    post.details = JSON.parse(post.details);
                    post.publicLocation = JSON.parse(post.publicLocation);
                    post.downvotes = parseInt(post.downvotes);
                    post.priority = parseInt(post.priority);
                    post.upvotes = parseInt(post.upvotes);
                    post.timestamp = dayjs.unix(parseInt(post.timestamp)).format('MMMM DD. YYYY');
                    temp_posts.push(post);
                })
                // arrange the posts in descending order according to their priority
                temp_posts.sort((a, b) => b.priority - a.priority);
                setPageData(temp_posts);
                console.log(temp_posts)
            })
        }
    }, [walletTools])

    const Card = ({post}) => {
        const [isActive, setIsActive] = useState<boolean>(false);
        const [upvoteCount, setUpvoteCount] = useState<number>(0);
        const [downvoteCount, setDownvoteCount] = useState<number>(0);
        const [isUpvoted, setIsUpvoted] = useState<boolean>(false);
        const [isDownvoted, setIsDownvoted] = useState<boolean>(false);

        const handleUpvote = () => {
            if (isUpvoted) {
                setUpvoteCount(prev => prev - 1);
                setIsUpvoted(false); // Undo upvote
            } else {
                setUpvoteCount(prev => prev + 1);
                setIsUpvoted(true); // Set as upvoted
                if (isDownvoted) {
                    setDownvoteCount(prev => prev - 1); // Remove downvote if upvoted
                    setIsDownvoted(false);
                }
            }
        };

        // Handle Downvote
        const handleDownvote = () => {
            if (isDownvoted) {
                setDownvoteCount(prev => prev - 1);
                setIsDownvoted(false);
            } else {
                setDownvoteCount(prev => prev + 1);
                setIsDownvoted(true);
                if (isUpvoted) {
                    setUpvoteCount(prev => prev - 1);
                    setIsUpvoted(false);
                }
            }
        };

        useEffect(() => {
            if (reasonSeverityScore > 70) {
                setUpvoteCount(prev => prev + 1);
            }
        }, [reasonSeverityScore]);

        return (
            <div>
                <div
                    className={cn('p-4 border-[2px] rounded-lg', isActive && 'border-[#000] duration-200 rounded-t-lg rounded-b-none')}>
                    <div onClick={() => setIsActive(!isActive)}
                         className={'flex cursor-pointer items-center justify-between'}>
                        <div className={'flex items-center gap-x-4'}>
                            <h1 className={'font-bold text-lg font-epilogue'}>
                                {post.details.title}
                            </h1>
                            <div className={'flex items-center justify-center gap-x-2'}>
                                <div
                                    className={'bg-[#000] text-[#B9FF66] text-sm font-medium px-1.5 py-0.5 rounded-md'}>
                                    {post.category}
                                </div>
                                <div
                                    className={cn('text-[#000] text-sm font-medium px-1.5 py-0.5 rounded-md', post.priority === 1 ? 'bg-[#B9FF66]' : post.priority === 2 ? 'bg-[#4A8209]' : (post.priority === 3 ? 'bg-[#FFD700]' : 'bg-[#b9ff66] '))}>
                                    {post.priority === 1 ? 'Low' : post.priority === 2 ? 'Solvable' : (post.priority === 3 ? 'High' : 'Critical')}
                                </div>
                            </div>
                        </div>
                        <div>
                            <PiArrowCircleRightThin
                                className={cn('rotate-45 size-12 duration-200', isActive && "-rotate-45")}/>
                        </div>
                    </div>
                    {isActive && <div>
                        <p className={'text-base font-epilogue'}>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: post.details.description
                                }}
                            />
                        </p>
                        <div className={'flex items-center flex-wrap gap-3 mt-4'}>
                            <img alt={'proof_image'} className={'max-h-[200px] h-auto rounded-3xl'} src={`${FILE_COIN_URL}/${post.mediaCID}`}/>
                            <div className={'flex flex-col'}>
                                <div className={'flex text-lg items-center text-[#4A8209]'}>
                                    <BiUpvote className={'mr-1 cursor-pointer'} onClick={handleUpvote}/>
                                    <span className={'font-semibold'}>{upvoteCount}</span>
                                </div>
                                <div className={'flex text-lg items-center text-[#B20707]'}>
                                    <BiUpvote className={'mr-1 cursor-pointer transform rotate-180'}
                                              onClick={handleDownvote}/>
                                    <span className={'font-semibold'}>{downvoteCount}</span>
                                </div>
                                <div className={'flex text-lg items-center text-[#B20707]'}>
                                    <span className={'font-semibold'}>{0} Reports</span>
                                </div>
                            </div>
                        </div>
                    </div>}
                </div>
                {isActive && <div className={'bg-[#B9FF66] text-[#4A8209]'}>
                    <h1 className={'text-lg p-4 font-semibold border-[2px] border-black border-t-transparent rounded-b-lg'}>
                        Verification Status: Success
                    </h1>
                </div>}
            </div>
        );
    };

    return (
        <div className={'space-y-5'}>
            {
                pageData.map((post: any, index: number) => (
                    <Card post={post} key={index}/>
                ))
            }
        </div>
    );
};

export default MyReports;
