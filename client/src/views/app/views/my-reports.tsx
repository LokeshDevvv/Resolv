import React, {useState, useEffect} from 'react';
import {cn} from "@/lib/utils.ts";
import {PiArrowCircleRightThin} from "react-icons/pi";
import {BiUpvote} from "react-icons/bi";
import {GlobalContext} from "@/contexts/global-context.tsx";
import {useDynamicContext} from "@dynamic-labs/sdk-react-core";
import {CommonABI} from "@/constants/multichain-contracts.ts";
import dayjs from 'dayjs'
import {FILE_COIN_URL} from "@/constants/utils.ts";

interface Report {
    details?: {
        title: string;
        description: string;
    };
    title?: string;
    description?: string;
    category: string;
    priority: number;
    upvotes: number;
    downvotes: number;
    timestamp: string;
    fileBase64?: string;
    mediaCID?: string;
    publicLocation?: {
        lat: string;
        long: string;
    };
    id?: string;
}

interface MyReportsProps {
    reasonSeverityScore: number;
}

const MyReports: React.FC<MyReportsProps> = ({reasonSeverityScore}) => {
    const {walletTools} = React.useContext(GlobalContext);
    const {primaryWallet} = useDynamicContext();
    const isMounted = React.useRef(false);
    const [pageData, setPageData] = React.useState<Report[]>([]);

    // Function to update report votes in localStorage
    const updateReportVotes = (reportId: string, upvotes: number, downvotes: number) => {
        const localReports: Report[] = JSON.parse(localStorage.getItem('localReports') || '[]');
        const updatedReports = localReports.map(report => {
            if (report.id === reportId) {
                return { ...report, upvotes, downvotes };
            }
            return report;
        });
        localStorage.setItem('localReports', JSON.stringify(updatedReports));
    };

    React.useEffect(() => {
        // Load local reports
        const localReports: Report[] = JSON.parse(localStorage.getItem('localReports') || '[]');
        let mergedPosts: Report[] = [];
        
        // Add unique IDs to reports if they don't have one
        const reportsWithIds = localReports.map(report => ({
            ...report,
            id: report.id || `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }));
        
        // Sort local reports by timestamp
        const sortedLocalReports = reportsWithIds.sort((a: Report, b: Report) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        if(!isMounted.current && walletTools){
            isMounted.current = true;
            walletTools.publicClient.readContract({
                address: walletTools.address,
                abi: CommonABI,
                functionName: 'getUserReports',
                args: [primaryWallet?.address, 0, 15]
            }).then((response: any) => {
                const data = response[0];
                const temp_posts: Report[] = [];
                data.map((post: any) => {
                    post.details = JSON.parse(post.details);
                    post.publicLocation = JSON.parse(post.publicLocation);
                    post.downvotes = parseInt(post.downvotes);
                    post.priority = parseInt(post.priority);
                    post.upvotes = parseInt(post.upvotes);
                    post.timestamp = dayjs.unix(parseInt(post.timestamp)).format('MMMM DD. YYYY');
                    post.id = `blockchain_${post.timestamp}_${Math.random().toString(36).substr(2, 9)}`;
                    temp_posts.push(post);
                });
                // arrange the posts in descending order according to their priority
                temp_posts.sort((a: Report, b: Report) => b.priority - a.priority);
                // Add local reports first, then blockchain reports
                mergedPosts = [...sortedLocalReports, ...temp_posts];
                setPageData(mergedPosts);
            });
        } else {
            // If no wallet, just show local reports
            setPageData(sortedLocalReports);
        }
    }, [walletTools]);

    const Card = ({post}: {post: Report}) => {
        const [isActive, setIsActive] = useState<boolean>(false);
        const [upvoteCount, setUpvoteCount] = useState<number>(post.upvotes || 0);
        const [downvoteCount, setDownvoteCount] = useState<number>(post.downvotes || 0);
        const [isUpvoted, setIsUpvoted] = useState<boolean>(false);
        const [isDownvoted, setIsDownvoted] = useState<boolean>(false);

        const handleUpvote = () => {
            if (isUpvoted) {
                // If already upvoted, remove upvote
                setUpvoteCount(0);
                setIsUpvoted(false);
                if (post.id) {
                    updateReportVotes(post.id, 0, downvoteCount);
                }
            } else {
                // Add upvote and remove downvote if exists
                setUpvoteCount(1);
                setDownvoteCount(0);
                setIsUpvoted(true);
                setIsDownvoted(false);
                if (post.id) {
                    updateReportVotes(post.id, 1, 0);
                }
            }
        };

        const handleDownvote = () => {
            if (isDownvoted) {
                // If already downvoted, remove downvote
                setDownvoteCount(0);
                setIsDownvoted(false);
                if (post.id) {
                    updateReportVotes(post.id, upvoteCount, 0);
                }
            } else {
                // Add downvote and remove upvote if exists
                setDownvoteCount(1);
                setUpvoteCount(0);
                setIsDownvoted(true);
                setIsUpvoted(false);
                if (post.id) {
                    updateReportVotes(post.id, 0, 1);
                }
            }
        };

        useEffect(() => {
            if (reasonSeverityScore > 70) {
                setUpvoteCount(1);
                setDownvoteCount(0);
                setIsUpvoted(true);
                setIsDownvoted(false);
                if (post.id) {
                    updateReportVotes(post.id, 1, 0);
                }
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
                                {post.details?.title || post.title}
                            </h1>
                            <div className={'flex items-center justify-center gap-x-2'}>
                                <div
                                    className={'bg-[#000] text-[#B9FF66] text-sm font-medium px-1.5 py-0.5 rounded-md'}>
                                    {post.category}
                                </div>
                                <div
                                    className={cn('text-[#000] text-sm font-medium px-1.5 py-0.5 rounded-md', 
                                        post.priority === 1 ? 'bg-[#B9FF66]' : 
                                        post.priority === 2 ? 'bg-[#4A8209]' : 
                                        post.priority === 3 ? 'bg-[#FFD700]' : 'bg-[#b9ff66]')}>
                                    {post.priority === 1 ? 'Low' : 
                                     post.priority === 2 ? 'Solvable' : 
                                     post.priority === 3 ? 'High' : 'Critical'}
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
                            {post.details?.description || post.description}
                        </p>
                        <div className={'flex items-center flex-wrap gap-3 mt-4'}>
                            {post.fileBase64 ? (
                                post.fileBase64.startsWith("data:image/") ? (
                                    <img
                                        alt="proof_image"
                                        className="max-h-[200px] h-auto rounded-3xl"
                                        src={post.fileBase64}
                                    />
                                ) : (
                                    <video controls className="mt-2 rounded-lg border border-gray max-h-[200px] w-auto">
                                        <source src={post.fileBase64}/>
                                    </video>
                                )
                            ) : post.mediaCID ? (
                                <img
                                    alt="proof_image"
                                    className="max-h-[200px] h-auto rounded-3xl"
                                    src={`${FILE_COIN_URL}/${post.mediaCID}`}
                                />
                            ) : null}
                            <div className={'flex flex-col'}>
                                <div className={'flex text-lg items-center text-[#4A8209]'}>
                                    <BiUpvote 
                                        className={cn('mr-1 cursor-pointer', isUpvoted && 'text-[#4A8209]')} 
                                        onClick={handleUpvote}
                                    />
                                    <span className={'font-semibold'}>{upvoteCount}</span>
                                </div>
                                <div className={'flex text-lg items-center text-[#B20707]'}>
                                    <BiUpvote 
                                        className={cn('mr-1 cursor-pointer transform rotate-180', isDownvoted && 'text-[#B20707]')}
                                        onClick={handleDownvote}
                                    />
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
                pageData.map((post: Report, index: number) => (
                    <Card post={post} key={post.id || index}/>
                ))
            }
        </div>
    );
};

export default MyReports;
