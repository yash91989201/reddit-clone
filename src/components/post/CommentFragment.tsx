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
        {/* comment actions */}
        <div className="flex items-center text-base  sm:text-lg space-x-3">
          <Vote post_id={post_id} comment_id={comment.id} vote={comment.vote} />
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
            {commentAction.isReplying ? (
              <p className="px-3 py-1.5 flex items-center space-x-2 rounded-full  bg-purple-500 text-white text-sm sm:text-base">
                <HiReply />
                <span>Replying</span>
              </p>
            ) : (
              <p className="py-1.5 px-3 flex items-center rounded space-x-1  text-sm sm:text-base">
                <span>{child_comments?.length}</span>
                <HiReply className="text-purple-500" />
              </p>
            )}
          </IconBtn>
          {userId === comment.user.id ? (
            <>
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
                {commentAction.isEditing ? (
                  <p className="px-3 py-1.5 flex items-center space-x-2 rounded-full  bg-gray-500 text-white text-sm sm:text-base">
                    <HiPencil />
                    <span>Editing</span>
                  </p>
                ) : (
                  <HiPencil className="text-sm sm:text-base" />
                )}
              </IconBtn>
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
                {commentAction.isDeleting ? (
                  <p className="px-3 py-1.5 flex items-center space-x-2 rounded-full  bg-gray-500 text-white text-sm sm:text-base">
                    <HiTrash />
                    <span>Deleting</span>
                  </p>
                ) : (
                  <HiTrash className="text-sm sm:text-base" />
                )}
              </IconBtn>
            </>
          ) : (
            <></>
          )}
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
