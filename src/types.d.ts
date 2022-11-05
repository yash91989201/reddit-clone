import { User } from "@nhost/core";

export interface PostType {
  id: string;
  created_at: string;
  user: User;
  subreddit: SubredditType;
  comment: CommentType[];
  vote: VoteType[];
  title: string;
  image_url?: string;
  body?: string;
}

export interface InsertPostVarType {
  username: string;
  title: string;
  image_url?: string;
  body?: string;
  subreddit_id: string;
}

export interface SelectPostResultType {
  post_by_pk: PostType;
}

// all vote types
export interface VoteType {
  id: string;
  user_id: string;
  post_id: string;
  comment_id: string;
  upvote: boolean;
}

export interface SelectVoteResultType {
  vote: VoteType[];
}

export interface InsertVoteVarType {
  user_id: string;
  post_id: string | null;
  comment_id: string | null;
  upvote: boolean;
}

export interface UpdateVoteVarType {
  id: string;
  upvote: boolean;
}

export interface UpdateVoteResultType {
  update_vote: {
    affected_rows: number;
  };
}

// all comments type
export interface CommentType {
  id: string;
  created_at: string;
  user_id: string;
  post_id: string;
  parent_id: string;
  text: string;
}

export interface SelectCommentResultType {
  comment: CommentType[];
}

export interface InsertCommentVarType {
  post_id: string;
  parent_id?: string | null;
  user_id: string;
  text: string;
}

export interface InsertCommentResultType {
  insert_comment_one: CommentType;
}

export interface DeleteCommentVarType {
  id: string;
}

export interface DeleteCommentResultType {
  delete_comment_by_pk: CommentType;
}

// all subreddit types
export interface SubredditType {
  id: string;
  created_at: string;
  topic: string;
}

export interface InsertSubredditVarType {
  topic: string;
}

export interface SelectSubredditResultType {
  subreddit: SubredditType[];
}

export interface InsertSubredditResultType {
  insert_subreddit_one: SubredditType;
}
