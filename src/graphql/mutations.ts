import { gql } from "@apollo/client";

// post mutations
const INSERT_POST = gql`
  mutation insertPost(
    $user_id: uuid!
    $subreddit_id: uuid!
    $title: String!
    $text: String
    $image_id: uuid
    $link: String
  ) {
    insert_post_one(
      object: {
        user_id: $user_id
        subreddit_id: $subreddit_id
        title: $title
        text: $text
        image_id: $image_id
        link: $link
      }
    ) {
      id
      created_at
      user {
        id
        displayName
        email
      }
      subreddit_id
      title
      text
      image_id
      link
    }
  }
`;
// subreddit mutations
const INSERT_SUBREDDIT = gql`
  mutation insertSubreddit($topic: String!) {
    insert_subreddit_one(object: { topic: $topic }) {
      id
      created_at
      topic
    }
  }
`;

// vote mutations
const INSERT_VOTE = gql`
  mutation insertVote(
    $user_id: uuid!
    $post_id: uuid
    $comment_id: uuid
    $upvote: Boolean!
  ) {
    insert_vote_one(
      object: {
        user_id: $user_id
        post_id: $post_id
        comment_id: $comment_id
        upvote: $upvote
      }
    ) {
      user_id
      post_id
      comment_id
      upvote
    }
  }
`;

const UPDATE_VOTE = gql`
  mutation update_vote($id: uuid!, $upvote: Boolean!) {
    update_vote(where: { id: { _eq: $id } }, _set: { upvote: $upvote }) {
      affected_rows
    }
  }
`;

const DELETE_VOTE = gql`
  mutation delete_vote_by_pk($id: uuid!) {
    delete_vote_by_pk(id: $id) {
      id
      user_id
      post_id
      comment_id
      upvote
    }
  }
`;

// comment mutations
const INSERT_COMMENT = gql`
  mutation insertComment(
    $post_id: uuid!
    $parent_id: uuid
    $user_id: uuid!
    $text: String!
  ) {
    insert_comment_one(
      object: {
        post_id: $post_id
        parent_id: $parent_id
        user_id: $user_id
        text: $text
      }
    ) {
      id
      created_at
      post_id
      user_id
      text
    }
  }
`;

const UPDATE_COMMENT = gql`
  mutation updateCommentByPk($id: uuid!, $text: String!) {
    update_comment_by_pk(pk_columns: { id: $id }, _set: { text: $text }) {
      id
      created_at
      user_id
      user {
        id
        displayName
        email
      }
      post_id
      parent_id
      text
      vote {
        id
        user_id
        post_id
        comment_id
        upvote
      }
    }
  }
`;

const DELETE_COMMENT = gql`
  mutation deleteCommentByPk($id: uuid!) {
    delete_comment_by_pk(id: $id) {
      id
      created_at
      post_id
      parent_id
      text
      user {
        id
        displayName
      }
    }
  }
`;

// vote mutations

export {
  INSERT_POST,
  INSERT_SUBREDDIT,
  INSERT_VOTE,
  UPDATE_VOTE,
  DELETE_VOTE,
  INSERT_COMMENT,
  UPDATE_COMMENT,
  DELETE_COMMENT,
};
