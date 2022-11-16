import React from "react";
import Link from "next/link";
import Image from "next/image";
import ReactTimeago from "react-timeago";
// react icons
import {
  HiOutlineShare,
  HiOutlineChat,
  HiOutlineGift,
  HiOutlineBookmark,
  HiDotsHorizontal,
} from "react-icons/hi";
// custom components
import Avatar from "components/shared/Avatar";
import Vote from "components/home/Vote";
// import types
import { PostType } from "types";

interface Props {
  post: Omit<PostType, "comment">;
}

export default function Post({ post }: Props): JSX.Element {
  const total_comment = post.comment_aggregate.aggregate.count;

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex overflow-hidden flex-col-reverse bg-white rounded border-gray-600 sm:flex-row hover:border hover:shadow-lg">
        {/* votes */}
        <Vote
          post_id={post?.id}
          vote={post?.vote}
          styling="p-3 flex flex-row sm:flex-col items-center rounded-l-md text-gray-500 bg-gray-50 space-x-3 sm:space-x-0"
        />
        {/* post details */}
        <Link href={`/post/${post?.id}`}>
          <a className="flex-1 p-3 space-y-3">
            {/* header */}
            <div className="flex items-center -ml-3 space-x-3">
              <Avatar seed={post?.user.displayName} />
              <div className="flex flex-col space-y-0.5 space-x-0 sm:flex-row sm:space-y-0 sm:space-x-3">
                <Link href={`/subreddit/${post?.subreddit.topic}`} passHref>
                  <span className="text-sm text-black underline cursor-pointer sm:text-base hover:text-blue-500">
                    r/{post?.subreddit.topic}
                  </span>
                </Link>
                <span className="text-sm text-gray-400 sm:text-base">
                  Posted by {post?.user.displayName}
                </span>
                <ReactTimeago
                  date={post?.created_at}
                  minPeriod={36000}
                  className="text-sm text-gray-400 sm:text-base"
                />
              </div>
            </div>
            {/* body */}
            <div className="">
              <h2 className="text-lg font-semibold md:text-xl">
                {post?.title}
              </h2>
              <h3 className="text-base font-normal md:text-md">{post?.text}</h3>
            </div>
            {/* image */}
            {post?.image_id && (
              <div className="relative w-96 aspect-square">
                <Image
                  src={`https://pzibwpunxuyxxnigfthq.nhost.run/v1/storage/files/${post.image_id}`}
                  alt={post.title}
                  layout="fill"
                />
              </div>
            )}
            {/* link */}
            {post.link && (
              <Link href={`https://${post.link}`} target="_blank">
                <span className="text-blue-500 underline">{post.link}</span>
              </Link>
            )}
            {/* footer*/}
            <div className="flex items-center space-x-6">
              <div className="space-x-1 post-button">
                <HiOutlineChat />
                <p className="space-x-1">
                  <span>{total_comment}</span>
                  <span className="hidden sm:inline-flex">Comment</span>
                </p>
              </div>
              <div className="post-button">
                <div>
                  <HiOutlineGift />
                </div>
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
    </div>
  );
}
