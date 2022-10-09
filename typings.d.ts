// post types
interface PostType {
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

interface InsertPostVarType {
  username: string;
  title: string;
  image_url?: string;
  body?: string;
  subreddit_id: string;
}

interface SelectPostResultType {
  post: PostType[];
}

// all vote types
interface VoteType {
  id: string;
  post_id: string;
  username: string;
  upvote: boolean;
}

interface SelectVoteResultType {
  vote: VoteType[];
}

interface InsertVoteVarType {
  post_id: string;
  username: string;
  upvote: boolean;
}

interface UpdateVoteVarType {
  id;
  upvote;
}

interface UpdateVoteResultType {
  update_vote: {
    affected_rows: number;
  };
}

// all comments type
interface CommentType {
  id: string;
  created_at: string;
  post_id: string;
  username: string;
  text: string;
}

interface SelectCommentResultType {
  comment: CommentType[];
}

interface InsertCommentVarType {
  post_id: string;
  username: string;
  text: string;
}

interface InsertCommentResultType {
  insert_comment_one: CommentType;
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
