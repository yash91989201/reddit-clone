import { SubmitHandler, useForm } from "react-hook-form";
import { useAuthenticationStatus, useUserId } from "@nhost/react";
import toast from "react-hot-toast";
import { useComment } from "contexts/CommentContext";
import { CommentType } from "types";
import { Dispatch, SetStateAction } from "react";

interface CommentActionType {
  isReplying: boolean;
  isEditing: boolean;
  isDeleting: boolean;
}

interface Props {
  initial_value?: string;
  post_id: string;
  parent_id?: string;
  comment?: CommentType;
  commentAction?: CommentActionType;
  setCommentAction?: Dispatch<SetStateAction<CommentActionType>>;
}

interface FormProps {
  initial_value: string;
  parent_id?: string;
  comment: string;
}

export default function CommentForm({
  initial_value,
  parent_id,
  post_id,
  comment,
  commentAction,
  setCommentAction,
}: Props): JSX.Element {
  const { isAuthenticated } = useAuthenticationStatus();
  const user_id = useUserId();
  const { insertComment, updateComment } = useComment();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormProps>({
    defaultValues: {
      comment: initial_value || "",
    },
  });

  const postComment: SubmitHandler<FormProps> = async (formData) => {
    const notification = toast.loading("Posting your awesome comment...");
    const query_result = await insertComment({
      variables: {
        post_id,
        parent_id: parent_id || null,
        user_id: user_id!,
        text: formData.comment,
      },
    });
    if (!!query_result?.data) {
      toast.success("Comment added", {
        id: notification,
      });
      commentAction?.isReplying &&
        setCommentAction!((prevVal: CommentActionType) => {
          return {
            isReplying: false,
            isEditing: prevVal.isEditing,
            isDeleting: prevVal.isDeleting,
          };
        });
      reset();
    }
  };

  const editComment: SubmitHandler<FormProps> = async (formData) => {
    const notification = toast.loading("Editing comment...");
    const query_result = await updateComment({
      variables: {
        id: comment?.id!,
        text: formData.comment,
      },
    });
    if (!!query_result?.data) {
      toast.success("Comment Edited.", {
        id: notification,
      });
      reset();
      setCommentAction!((prevVal: CommentActionType) => {
        return {
          isReplying: prevVal.isReplying,
          isEditing: false,
          isDeleting: prevVal.isDeleting,
        };
      });
    }
  };

  return (
    <form
      className="flex flex-col space-y-3 "
      onSubmit={handleSubmit(initial_value ? editComment : postComment)}
    >
      <textarea
        {...register("comment")}
        disabled={!isAuthenticated}
        className="h-32  border-gray-300 border p-3 outline-none 
                disabled:bg-gray-50 disabled:cursor-not-allowed rounded
                focus:border-gray-600
                text-sm sm:text-base placeholder:text-sm placeholder:sm:text-base"
        placeholder={
          isAuthenticated
            ? "What are your thoughts!"
            : "Please signin to comment."
        }
      />
      {!!watch("comment") && (
        <button
          type="submit"
          disabled={!isAuthenticated}
          className="self-start rounded-full bg-reddit-col p-1 px-3 text-sm sm:text-base font-semibold text-white disabled:bg-gray-200 resize-none"
        >
          {commentAction?.isEditing && "Edit"}
          {commentAction?.isReplying && "Reply"}
          {!!!initial_value && !commentAction?.isReplying && "Comment"}
        </button>
      )}
    </form>
  );
}
