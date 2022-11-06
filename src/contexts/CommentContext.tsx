import {
  useQuery,
  useMutation,
  FetchResult,
  MutationFunctionOptions,
} from "@apollo/client";
import Spinner from "components/shared/Spinner";
import {
  INSERT_COMMENT,
  UPDATE_COMMENT,
  DELETE_COMMENT,
} from "graphql/mutations";
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
  UpdateCommentVarType,
  UpdateCommentResultType,
} from "types";

interface CommentContextType {
  post_id: string;
  root_comments: CommentType[];
  insertComment: (
    options?: MutationFunctionOptions<
      InsertCommentResultType,
      InsertCommentVarType
    >
  ) => Promise<FetchResult<InsertCommentResultType>>;
  updateComment: (
    options?: MutationFunctionOptions<
      UpdateCommentResultType,
      UpdateCommentVarType
    >
  ) => Promise<FetchResult<UpdateCommentResultType>>;
  deleteComment: (
    options?: MutationFunctionOptions<
      DeleteCommentResultType,
      DeleteCommentVarType
    >
  ) => Promise<FetchResult<DeleteCommentResultType>>;
  getReplies: (parent_id: string) => CommentType[];
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
  const { data, loading } = useQuery<SelectCommentResultType>(
    GET_COMMENT_BY_POSTID,
    {
      variables: {
        post_id,
      },
    }
  );

  const [insertComment] = useMutation<
    InsertCommentResultType,
    InsertCommentVarType
  >(INSERT_COMMENT, {
    refetchQueries: [{ query: GET_COMMENT_BY_POSTID, variables: { post_id } }],
  });

  const [updateComment] = useMutation<
    UpdateCommentResultType,
    UpdateCommentVarType
  >(UPDATE_COMMENT, {
    refetchQueries: [{ query: GET_COMMENT_BY_POSTID, variables: { post_id } }],
  });

  const [deleteComment] = useMutation<
    DeleteCommentResultType,
    DeleteCommentVarType
  >(DELETE_COMMENT, {
    refetchQueries: [{ query: GET_COMMENT_BY_POSTID, variables: { post_id } }],
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

  if (loading) return <Spinner />;

  return (
    <Context.Provider
      value={{
        post_id,
        root_comments: commentsByParentId["no_parent"],
        insertComment,
        updateComment,
        deleteComment,
        getReplies,
      }}
    >
      {children}
    </Context.Provider>
  );
}
