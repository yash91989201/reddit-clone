import { User } from "@nhost/core";

export interface PostType {
  id: string;
  created_at: string;
  username: string;
  title: string;
  image_url?: string;
  body?: string;
  subreddit_id: string;
  subreddit: SubredditType;
  vote: VoteType[];
  comment: CommentType[];
}

export interface InsertPostVarType {
  username: string;
  title: string;
  image_url?: string;
  body?: string;
  subreddit_id: string;
}

export interface SelectPostResultType {
  post: PostType[];
}

// all vote types
export interface VoteType {
  id: string;
  post_id: string;
  username: string;
  upvote: boolean;
}

export interface SelectVoteResultType {
  vote: VoteType[];
}

export interface InsertVoteVarType {
  post_id: string;
  username: string;
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
  post_id: string;
  parent?: CommentType;
  children: CommentType[];
  parent_id: string;
  text: string;
  user: User;
}

export interface SelectCommentResultType {
  comment: CommentType[];
}

export interface InsertCommentVarType {
  post_id: string;
  user_id: string;
  text: string;
}

export interface InsertCommentResultType {
  insert_comment_one: CommentType;
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
