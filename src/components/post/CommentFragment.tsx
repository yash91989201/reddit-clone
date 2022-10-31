import React, { useState } from "react";
import ReactTimeago from "react-timeago";
// CUSTOM COMPONENTS
import Avatar from "components/shared/Avatar";
// import types
import { CommentType } from "types";
// import icons
import {
  HiHeart,
  HiOutlineHeart,
  HiPencil,
  HiTrash,
  HiReply,
} from "react-icons/hi";
import { IconType } from "react-icons/lib";
import { useComment } from "contexts/CommentContext";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";

interface Props {
  comment: CommentType;
}

export default function CommentFragment({ comment }: Props): JSX.Element {
  const [areChildrenHidden, setAreChildrenHidden] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { getReplies } = useComment();
  const child_comments = getReplies(comment.id);
  const are_children_hidden = false;

  return (
    <div>
      <div className="py-3  flex flex-col border rounded space-x-3">
        <div className="flex justify-between items-center ">
          <div className="flex items-center  ">
            <Avatar seed={comment.user.displayName} />
            <span>{comment.user.displayName}</span>
          </div>
          <ReactTimeago
            date={comment.created_at}
            minPeriod={3600}
            className="px-3 text-gray-500 text-xs sm:text-sm"
          />
        </div>
        {isEditing ? (
          <CommentForm initial_value={comment.text} post_id={comment.post_id} />
        ) : (
          <p className="px-5 py-3 text-sm sm:text-base">{comment.text}</p>
        )}
        {/* comment actions */}
        <div className="flex items-center text-base  sm:text-lg space-x-3">
          <IconBtn Icon={HiHeart} className="flex items-center space-x-1">
            0
          </IconBtn>
          <IconBtn
            Icon={HiReply}
            className="flex items-center text-purple-500 space-x-1"
          />
          <IconBtn
            Icon={HiPencil}
            className="flex items-center space-x-1"
            onClick={() => setIsEditing(!isEditing)}
          />
          <IconBtn
            Icon={HiTrash}
            className="flex items-center text-red-500  space-x-1"
          />
        </div>
      </div>
      {child_comments?.length > 0 && (
        <>
          <div
            className={`nested-comments-stack ${
              are_children_hidden ? "hide" : ""
            }`}
          >
            <button
              className="collapse-line"
              aria-label="Hide Replies"
              onClick={() => setAreChildrenHidden(true)}
            />
            <div className="nested-comments">
              <CommentList comment={child_comments} />
            </div>
          </div>
          <button
            className={`btn mt-1 ${!areChildrenHidden ? "hide" : ""}`}
            onClick={() => setAreChildrenHidden(false)}
          >
            Show Replies
          </button>
        </>
      )}
    </div>
  );
}

interface IconBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  Icon: IconType;
  className?: string;
  children?: JSX.Element | string;
  isActive?: boolean;
}

function IconBtn({
  Icon,
  isActive,
  children,
  className,
  ...props
}: IconBtnProps): JSX.Element {
  return (
    <button className={`${className}`} {...props}>
      <span>
        <Icon />
      </span>
      {children}
    </button>
  );
}
