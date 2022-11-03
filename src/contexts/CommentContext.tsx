import {
  useQuery,
  useMutation,
  FetchResult,
  MutationFunctionOptions,
} from "@apollo/client";
import Spinner from "components/shared/Spinner";
import { INSERT_COMMENT, DELETE_COMMENT } from "graphql/mutations";
import { GET_COMMENT_BY_POSTID } from "graphql/queries";
import { createContext, useContext, useMemo } from "react";
// import types
import {
  CommentType,
  DeleteCommentResultType,
  DeleteCommentVarType,
  SelectCommentResultType,
  InsertCommentResultType,
  InsertCommentVarType,
} from "types";

interface CommentContextType {
  root_comments: CommentType[];
  getReplies: (parent_id: string) => CommentType[];
  delete_comment: (
    options?: MutationFunctionOptions<
      DeleteCommentResultType,
      DeleteCommentVarType
    >
  ) => Promise<FetchResult>;
}

interface PostProviderProps {
  post_id: string;
  children: JSX.Element;
}
type GroupType = {
  [key: string | "no_parent"]: CommentType[];
};

const Context = createContext({} as CommentContextType);

export function useComment() {
  return useContext(Context);
}

export default function CommentProvider({
  post_id,
  children,
}: PostProviderProps): JSX.Element {
  const { data, loading, error } = useQuery<SelectCommentResultType>(
    GET_COMMENT_BY_POSTID,
    {
      variables: {
        post_id,
      },
    }
  );

  const [deleteComment] = useMutation<
    DeleteCommentResultType,
    DeleteCommentVarType
  >(DELETE_COMMENT, {
    refetchQueries: [
      { query: GET_COMMENT_BY_POSTID, variables: { id: post_id } },
    ],
  });

  const comment = data?.comment!;
  const commentsByParentId = useMemo(() => {
    const group: GroupType = {};
    comment?.forEach((comment) => {
      const parent_id =
        comment.parent_id == null ? "no_parent" : comment.parent_id;
      group[parent_id] ||= [];
      group[comment.parent_id || "no_parent"].push(comment);
    });
    return group;
  }, [comment]);
  const getReplies = (parent_id: string) => {
    return commentsByParentId[parent_id];
  };

  if (loading) <Spinner />;

  return (
    <Context.Provider
      value={{
        root_comments: commentsByParentId["no_parent"],
        getReplies,
        delete_comment: deleteComment,
      }}
    >
      {children}
    </Context.Provider>
  );
}
