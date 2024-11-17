import {Button} from "@/components/ui/button.tsx";
import demoImg from "@/assets/demo.jpeg";
import {ArrowUpRight, MapPin} from "lucide-react";
import React from "react";
import {GlobalContext} from "@/contexts/global-context.tsx";
import {useDynamicContext} from "@dynamic-labs/sdk-react-core";
import {CommonABI} from "@/constants/multichain-contracts.ts";
import dayjs from "dayjs";
import {cn} from "@/lib/utils.ts";
import {FILE_COIN_URL} from "@/constants/utils.ts";
import Preloader from "@/components/ui/preloader.tsx";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import Verify from "@/views/app/views/verify.tsx";

const AppDashboard = () => {
    const {walletTools} = React.useContext(GlobalContext);
    const {primaryWallet} = useDynamicContext();
    const isMounted = React.useRef(false)
    const [pageData, setPageData] = React.useState([]);
    const [openDialog, setOpenDialog] = React.useState(false);
    React.useEffect(() => {
        if (!isMounted.current && walletTools) {
            isMounted.current = true;
            walletTools.publicClient.readContract({
                address: walletTools.address,
                abi: CommonABI,
                functionName: 'getAllReports',
                args: [0, 15]
            }).then(response => {
                const posts = response[0];
                const temp_posts = [];
                posts.map((post: any) => {
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
            })
        }
    }, [walletTools, primaryWallet])
    return (
        <div className={'space-y-5'}>
            {
                pageData.length > 0 && pageData.map((post: any, index: number) => (<>
                        <div className={'p-4 border-[2px] rounded-lg'}>
                            <div className={'flex items-center justify-between'}>
                                <div className={'space-y-1'}>
                                    <h1 className={'font-semibold font-epilogue'}>{post.details?.title || "No title"}</h1>
                                    <p className={'text-gray-500 font-epilogue font-medium text-sm'}>
                                        {post.timestamp}
                                    </p>
                                </div>
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
                            <div className={'mt-4'}>
                                <h1 className={'text-lg font-epilogue font-semibold'}>
                                    <div dangerouslySetInnerHTML={{__html: post.details.description}}/>
                                </h1>
                                <div className={'flex items-center flex-wrap gap-3 mt-4'}>
                                    <img alt={'proof_image'} className={'max-h-[250px] h-auto rounded-3xl'}
                                         src={`${FILE_COIN_URL}/${post.mediaCID}`}/>
                                </div>
                                <div
                                    className={'mt-4 flex flex-col items-start md:flex-row md:items-center gap-3 justify-between'}>
                                    <div className={'flex items-center gap-x-6'}>
                                        <div className={'flex items-center gap-x-2'}>
                                            <Button variant={'outline'}
                                                    onClick={() => setOpenDialog(post)}
                                                    className={'border-black rounded-full py-5'}>Upvote</Button>
                                            <p className={'text-[#4A8209] font-semibold'}>{post.upvotes}</p>
                                        </div>
                                        <div className={'flex items-center gap-x-2'}>
                                            <Button variant={'outline'} className={'border-black rounded-full py-5'}>Down
                                                vote
                                            </Button>
                                            <p className={'text-[#B20707] font-semibold'}>{post.downvotes}</p>
                                        </div>
                                    </div>
                                    <div className={'flex items-center'}>
                                        <MapPin className={'size-4 mr-1'}/> <p>{post.publicLocation.lat} (lat)
                                        , {post.publicLocation.long} (lon)</p>
                                    </div>
                                </div>
                                <div className={'mt-4'}>
                                    {/*<Button*/}
                                    {/*    className={'bg-[#b9ff66] hover:bg-[#a3ff66] border-[#4A8209] border-[1.6px] rounded-full w-full text-black'}>Mint <ArrowUpRight*/}
                                    {/*    className={'size-5'}/></Button>*/}
                                </div>
                            </div>
                        </div>
                    </>
                )) || <Preloader className={'h-[60dvh]'}/>
            }
            <Dialog
                open={openDialog !== false}
                onOpenChange={e => setOpenDialog(e)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Upvote Report</DialogTitle>
                        <DialogDescription>
                            By up-voting this report, you are confirming that the report is genuine and you support the cause.
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Verify post={openDialog} close={() => setOpenDialog(false)} />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AppDashboard;