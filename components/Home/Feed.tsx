import Image from "next/image"
import { useQuery } from "@apollo/client"
import Link from "next/link"
import Spinner from "components/shared/Spinner"
// graphql queries
import { GET_POSTS } from "graphql/queries"
// custom components
import Vote from "./Vote"
import Subreddit from "./Subreddit"
import CommentFragment from "./CommentFragment"
// import icons
import { HiOutlineShare, HiOutlineGift, HiOutlineBookmark, HiDotsHorizontal } from "react-icons/hi"
import ReactTimeago from "react-timeago"
import Avatar from "./Avatar"

// constant
export const post_button: string = "flex items-center space-x-2 text-sm font-semibold text-gray-500 p-2 hover:bg-gray-100 cursor-pointer rounded-sm"
export default function Feed() {
    const { data, loading, error } = useQuery<SelectPostResultType, {}>(GET_POSTS)
    if (loading)
        return <Spinner />
    return (
        <div className="flex-1 space-y-3">
            {
                data?.post.map(
                    (post) => {
                        return <Link key={post.id} href={`/${post.id}`}>
                            <a className="flex bg-white rounded-md border-gray-600 hover:border overflow-hidden">
                                {/* votes */}
                                <Vote post_id={post.id} />
                                {/* post details */}
                                <div className="flex-1 p-3 space-y-3">
                                    {/* header */}
                                    <div className="flex items-center space-x-3">
                                        <Avatar seed={post.username} />
                                        <Subreddit subreddit_id={post.subreddit_id} />
                                        <span className="text-gray-400">
                                            &middot;
                                            Posted by {post.username}
                                            <ReactTimeago date={post.created_at} minPeriod={36000} />
                                        </span>
                                    </div>
                                    {/* body */}
                                    <div className="">
                                        <h2 className="text-xl font-semibold">{post.title}</h2>
                                        <h3 className="text-md font-normal">{post.body}</h3>
                                    </div>
                                    {/* image */}
                                    {
                                        post.image_url && <div className="relative w-96 aspect-video">
                                            <Image
                                                src={post.image_url!}
                                                alt={post.title}
                                                layout="fill"
                                            />
                                        </div>
                                    }
                                    {/* footer*/}
                                    <div className="flex items-center">
                                        <CommentFragment post_id={post.id} />
                                        <div className={post_button}>
                                            <HiOutlineGift />
                                            <p className="hidden sm:inline">Award</p>
                                        </div>
                                        <div className={post_button}>
                                            <HiOutlineShare />
                                            <p className="hidden sm:inline">Share</p>
                                        </div>
                                        <div className={post_button}>
                                            <HiOutlineBookmark />
                                            <p className="hidden sm:inline">Bookmark</p>
                                        </div>
                                        <div className={post_button}>
                                            <HiDotsHorizontal />
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </Link>
                    })
            }
        </div>
    )
}