import { createContext, useContext, useMemo } from "react";
// import types
import { CommentType } from "types";

interface CommentContextType {
  root_comments: CommentType[];
  getReplies: (parent_id: string) => CommentType[];
}

interface PostProviderProps {
  comment: CommentType[];
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
  comment,
  children,
}: PostProviderProps): JSX.Element {
  const commentsByParentId = useMemo(() => {
    const group: GroupType = {};
    comment.forEach((comment) => {
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

  return (
    <Context.Provider
      value={{
        root_comments: commentsByParentId["no_parent"],
        getReplies,
      }}
    >
      {children}
    </Context.Provider>
  );
}
