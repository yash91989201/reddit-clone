import { User } from "@nhost/core";
export {};

declare global {
  interface PostType {
    id: string;
    created_at: string;
    user: User;
    subreddit: SubredditType;
    comment: CommentType[];
    comment_aggregate: {
      aggregate: {
        count: number;
      };
    };
    vote: VoteType[];
    title: string;
    text?: string;
    image_id?: string;
    link?: string;
  }

  interface InsertPostVarType {
    user_id: string;
    subreddit_id: string;
    title: string;
    text?: string;
    image_id?: string;
    link: string;
  }

  interface SelectPostsResultType {
    post: {
      id: string;
      created_at: string;
      user: User;
      subreddit: SubredditType;
      comment: CommentType[];
      comment_aggregate: {
        aggregate: {
          count: number;
        };
      };
      vote: VoteType[];
      title: string;
      image_url?: string;
      body?: string;
    }[];
  }

  interface SelectPostResultType {
    post_by_pk: PostType;
  }

  interface DeletePostVarType {
    id: string;
  }

  interface DeletePostResultType {
    delete_post_by_pk: PostType;
  }

  interface UpdateCommentVarType {
    id: string;
    text: string;
  }

  interface UpdateCommentResultType {
    update_comment_by_pk: CommentType[];
  }

  // // all vote types
  interface VoteType {
    id: string;
    user_id: string;
    post_id: string;
    comment_id: string;
    upvote: boolean;
  }

  interface SelectVoteResultType {
    vote: VoteType[];
  }

  interface InsertVoteVarType {
    user_id: string;
    post_id: string | null;
    comment_id: string | null;
    upvote: boolean;
  }

  interface UpdateVoteVarType {
    id: string;
    upvote: boolean;
  }

  interface UpdateVoteResultType {
    update_vote: {
      affected_rows: number;
    };
  }

  interface DeleteVoteVarType {
    id: string;
  }

  interface DeleteVoteResultType {
    delete_vote_by_pk: VoteType;
  }

  // // // all comments type
  interface CommentType {
    id: string;
    created_at: string;
    user: User;
    user_id: string;
    post_id: string;
    parent_id: string;
    text: string;
    vote: VoteType[];
  }

  interface SelectCommentResultType {
    comment: CommentType[];
  }

  interface InsertCommentVarType {
    post_id: string;
    parent_id?: string | null;
    user_id: string;
    text: string;
  }

  interface InsertCommentResultType {
    insert_comment_one: CommentType;
  }

  interface DeleteCommentVarType {
    id: string;
  }

  interface DeleteCommentResultType {
    delete_comment_by_pk: CommentType;
  }

  // all subreddit types
  interface SubredditType {
    id: string;
    created_at: string;
    topic: string;
  }

  interface InsertSubredditVarType {
    topic: string;
  }

  interface SelectSubredditResultType {
    subreddit: SubredditType[];
  }

  interface InsertSubredditResultType {
    insert_subreddit_one: SubredditType;
  }
}
