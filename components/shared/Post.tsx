import React from "react"
import Link from "next/link"
import Image from "next/image"
import ReactTimeago from "react-timeago"
// react icons 
import { HiOutlineShare, HiOutlineChat, HiOutlineGift, HiOutlineBookmark, HiDotsHorizontal } from "react-icons/hi"
// custom components
import Avatar from "components/shared/Avatar"
import Vote from "components/home/Vote"
// import types
import { PostType } from "typings"

interface Props {
    children?: {
        key: number,
        component: JSX.Element
    }[],
    post: PostType
}

export default function Post({ post, children }: Props): JSX.Element {

    return <div className="flex flex-col space-y-3">
        <div className="flex flex-col-reverse sm:flex-row  bg-white 
                            rounded border-gray-600 hover:border hover:shadow-lg overflow-hidden
                        ">
            {/* votes */}
            <Vote post_id={post?.id} vote={post.vote} />
            {/* post details */}
            <Link href={`/post/${post?.id}`}>
                <a className="flex-1 p-3 space-y-3">
                    {/* header */}
                    <div className="-ml-3 flex items-center space-x-3">
                        <Avatar seed={post.username} />
                        <div className="flex flex-col sm:flex-row space-x-0 space-y-0.5 sm:space-y-0 sm:space-x-3 ">
                            <Link href={`/subreddit/${post.subreddit.topic}`} passHref>
                                <span className="text-black hover:text-blue-500 cursor-pointer text-sm sm:text-base">
                                    r/{post.subreddit.topic}
                                </span>
                            </Link>
                            <span className="text-gray-400 text-sm sm:text-base">Posted by {post?.username}</span>
                            <ReactTimeago date={post?.created_at} minPeriod={36000} className="text-gray-400 text-sm sm:text-base" />
                        </div>
                    </div>
                    {/* body */}
                    <div className="">
                        <h2 className="text-lg md:text-xl font-semibold">{post?.title}</h2>
                        <h3 className="text-base md:text-md font-normal">{post?.body}</h3>
                    </div>
                    {/* image */}
                    {
                        post.image_url && <div className="relative w-96 aspect-video">
                            <Image
                                src={post.image_url}
                                alt={post.title}
                                layout="fill"
                            />
                        </div>
                    }
                    {/* footer*/}
                    <div className="flex items-center space-x-6">
                        <div className="post-button">
                            <HiOutlineChat />
                            <p>{post.comment.length} <span className="hidden sm:inline-flex">Comment</span></p>
                        </div >
                        <div className="post-button">
                            <div><HiOutlineGift /></div>
                            <p className="hidden sm:block">Award</p>
                        </div>
                        <div className="post-button">
                            <HiOutlineShare />
                            <p className="hidden sm:block">Share</p>
                        </div>
                        <div className="post-button">
                            <HiOutlineBookmark />
                            <p className="hidden sm:block">Bookmark</p>
                        </div>
                        <div className="post-button">
                            <HiDotsHorizontal />
                        </div>
                    </div>
                </a>
            </Link>
        </div>
        {
            children?.map(({ key, component }) =>
                <React.Fragment key={key}>{component}</React.Fragment>
            )
        }
    </div>


}

// {children?.map(({ key, component }) => <React.Fragment key={key}>{component}</React.Fragment>)}
