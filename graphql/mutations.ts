import { gql } from "@apollo/client";

// post mutations
const INSERT_POST = gql`
  mutation insertPost(
    $username: String!
    $title: String!
    $image_url: String
    $body: String!
    $subreddit_id: uuid!
  ) {
    insert_post_one(
      object: {
        username: $username
        title: $title
        image_url: $image_url
        body: $body
        subreddit_id: $subreddit_id
      }
    ) {
      id
      created_at
      username
      title
      image_url
      body
      subreddit_id
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

// comment mutations
const INSERT_COMMENT = gql`
  mutation insertComment($post_id: uuid!, $username: String, $text: String) {
    insert_comment_one(
      object: { post_id: $post_id, username: $username, text: $text }
    ) {
      id
      created_at
      post_id
      username
      text
    }
  }
`;

// vote mutations

export { INSERT_POST, INSERT_SUBREDDIT, INSERT_COMMENT };
