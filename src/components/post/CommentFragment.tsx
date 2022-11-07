import React, { useState } from "react";
import { useUserId } from "@nhost/react";
import ReactTimeago from "react-timeago";
// CUSTOM COMPONENTS
import Avatar from "components/shared/Avatar";
// import types
import type { CommentType } from "types";
// import icons
import { HiPencil, HiTrash, HiReply } from "react-icons/hi";
import { useComment } from "contexts/CommentContext";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";
import Vote from "components/home/Vote";

interface Props {
  comment: CommentType;
}

export default function CommentFragment({ comment }: Props): JSX.Element {
  const userId = useUserId();
  const [showChildComments, setShowChildComments] = useState(false);
  const [commentAction, setCommentAction] = useState({
    isEditing: false,
    isReplying: false,
    isDeleting: false,
  });
  const { post_id, getReplies, deleteComment } = useComment();
  const child_comments = getReplies(comment.id);
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
        {commentAction.isEditing ? (
          <div className="my-3 px-3">
            <CommentForm
              initial_value={comment.text}
              post_id={comment.post_id}
              comment={comment}
              commentAction={commentAction}
              setCommentAction={setCommentAction}
            />
          </div>
        ) : (
          <p className="px-5 py-3 text-sm sm:text-base">{comment.text}</p>
        )}
        {commentAction.isReplying ? (
          <div className="my-3 px-3">
            <CommentForm
              post_id={comment.post_id}
              parent_id={comment.id}
              commentAction={commentAction}
              setCommentAction={setCommentAction}
            />
          </div>
        ) : (
          <></>
        )}
        {/* comment actions */}
        <div className="flex items-center space-x-3">
          <Vote
            post_id={post_id}
            comment_id={comment.id}
            vote={comment.vote}
            styling="flex items-center space-x-1"
          />
          <IconBtn
            onClick={() => {
              setCommentAction((prevVal) => {
                return {
                  isEditing: false,
                  isReplying: !commentAction.isReplying,
                  isDeleting: prevVal.isDeleting,
                };
              });
            }}
          >
            <p className="px-3 py-1.5 flex items-center space-x-1 rounded-full  bg-blue-500 text-white ">
              {!commentAction.isReplying && (
                <span className="text-xs font-semibold text-white">
                  {child_comments?.length == undefined
                    ? "0"
                    : child_comments?.length}
                </span>
              )}
              <HiReply className="text-base" />
              {commentAction.isReplying && (
                <span className="text-sm">Replying</span>
              )}
            </p>
          </IconBtn>
          {userId === comment.user_id && (
            <IconBtn
              onClick={() => {
                setCommentAction((prevVal) => {
                  return {
                    isEditing: !commentAction.isEditing,
                    isReplying: false,
                    isDeleting: prevVal.isDeleting,
                  };
                });
              }}
            >
              <p className="px-3 py-1.5 flex items-center space-x-2 rounded-full  bg-gray-500 text-white ">
                <HiPencil className="text-base" />
                {commentAction.isEditing && (
                  <span className="text-sm">Editing</span>
                )}
              </p>
            </IconBtn>
          )}
          <IconBtn
            className="flex items-center text-red-500  space-x-1"
            onClick={() => {
              setCommentAction((prevVal) => {
                return {
                  isReplying: prevVal.isReplying,
                  isEditing: prevVal.isEditing,
                  isDeleting: true,
                };
              });
              deleteComment({
                variables: {
                  id: comment.id,
                },
              }).then(() => {
                setCommentAction((prevVal) => {
                  return {
                    isReplying: prevVal.isReplying,
                    isEditing: prevVal.isEditing,
                    isDeleting: false,
                  };
                });
              });
            }}
          >
            <p className="px-3 py-1.5 flex items-center space-x-2 rounded-full  bg-reddit-col text-white ">
              <HiTrash className="text-base" />
              {commentAction.isDeleting && (
                <span className="text-sm">Deleting</span>
              )}
            </p>
          </IconBtn>
        </div>
      </div>
      {child_comments?.length > 0 && (
        <>
          <div className={`${showChildComments ? "block" : "hidden"}`}>
            <button
              className="p-3 py-1.5 bg-reddit-col text-white rounded my-6"
              onClick={() => setShowChildComments(false)}
            >
              Hide replies
            </button>
            <div className="ml-6">
              <CommentList comment={child_comments} />
            </div>
          </div>
          <button
            className={`p-3 py-1.5 bg-reddit-col text-white rounded mt-6 ${
              showChildComments ? "hidden" : "block"
            }`}
            onClick={() => {
              setShowChildComments(true);
            }}
          >
            Show Replies
          </button>
        </>
      )}
    </div>
  );
}

interface IconBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: JSX.Element;
  isActive?: boolean;
}

function IconBtn({
  isActive,
  children,
  className,
  ...props
}: IconBtnProps): JSX.Element {
  return (
    <button className={`${className}`} {...props}>
      {children}
    </button>
  );
}
