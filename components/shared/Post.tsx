import React from "react"
import Link from "next/link"
import Image from "next/image"
import ReactTimeago from "react-timeago"
// react icons 
import { HiOutlineShare, HiOutlineGift, HiOutlineBookmark, HiDotsHorizontal } from "react-icons/hi"
// custom components
import Avatar from "components/shared/Avatar"
import CommentCount from "../home/CommentCount"
import Subreddit from "../home/Subreddit"
import Vote from "../home/Vote"

interface Props {
    post: PostType
}

export default function Post({ post }: Props): JSX.Element {

    return <Link key={post.id} href={`/post/${post?.id}`}>
        <a
            className="flex flex-col bg-white rounded-md border-gray-600 hover:border hover:shadow-lg overflow-hidden"
        >
            <div className="flex">
                {/* votes */}
                <Vote post_id={post?.id} />
                {/* post? details */}
                <div className="flex-1 p-3 space-y-3">
                    {/* header */}
                    <div className="-ml-3 flex items-center space-x-3">
                        <Avatar seed={post?.username} />
                        <Subreddit topic={post?.subreddit.topic} />
                        <p className="text-gray-400">Posted by {post?.username}</p>
                        <ReactTimeago date={post?.created_at} minPeriod={36000} className="text-gray-400" />
                    </div>
                    {/* body */}
                    <div className="">
                        <h2 className="text-xl font-semibold">{post?.title}</h2>
                        <h3 className="text-md font-normal">{post?.body}</h3>
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
                        <CommentCount post_id={post.id} />
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
                </div>
            </div>
        </a>
    </Link>

}
