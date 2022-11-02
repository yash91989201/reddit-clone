import { SubmitHandler, useForm } from "react-hook-form";
import {
  useAuthenticationStatus,
  useUserData,
  useUserDisplayName,
  useUserId,
} from "@nhost/react";
// GRAPHQL
import { GET_POST } from "graphql/queries";
import { INSERT_COMMENT } from "graphql/mutations";
// APOLLO
import { useMutation } from "@apollo/client";
import toast from "react-hot-toast";
import { InsertCommentResultType, InsertCommentVarType } from "types";

interface Props {
  initial_value?: string;
  post_id: string;
}

interface FormProps {
  initial_value: string;
  comment: string;
}

export default function CommentForm({
  initial_value,
  post_id,
}: Props): JSX.Element {
  const { isAuthenticated } = useAuthenticationStatus();
  const username = useUserDisplayName();
  const user_id = useUserId();
  const [insertComment] = useMutation<
    InsertCommentResultType,
    InsertCommentVarType
  >(INSERT_COMMENT, {
    refetchQueries: [{ query: GET_POST, variables: { id: post_id } }],
  });

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
        user_id: user_id as string,
        text: formData.comment,
      },
    });
    if (!!query_result?.data) {
      toast.success("Comment added", {
        id: notification,
      });
      reset();
    }
  };

  return (
    <form
      className="flex flex-col space-y-6"
      onSubmit={handleSubmit(postComment)}
    >
      <textarea
        {...register("comment")}
        disabled={!isAuthenticated}
        className="h-32 rounded-md border-gray-200 border p-3 outline-none 
                disabled:bg-gray-50 disabled:cursor-not-allowed 
                text-sm sm:text-base placeholder:text-sm placeholder:sm:text-base"
        placeholder={
          isAuthenticated
            ? "Comment your thoughts!"
            : "Please signin to comment."
        }
      />
      {!!watch("comment") && (
        <button
          type="submit"
          disabled={!isAuthenticated}
          className="self-start rounded-full bg-reddit-col p-2 px-6 text-sm sm:text-base font-semibold text-white disabled:bg-gray-200 resize-none"
        >
          Comment
        </button>
      )}
    </form>
  );
}
