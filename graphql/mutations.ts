import { gql } from "@apollo/client";

// post mutations
const INSERT_POST = gql`
  mutation insertPost(
    $username: String!
    $title: String!
    $imageUrl: String
    $body: String!
    $subreddit_id: uuid!
  ) {
    insert_post_one(
      object: {
        username: $username
        title: $title
        imageUrl: $imageUrl
        body: $body
        subreddit_id: $subreddit_id
      }
    ) {
      id
      created_at
      username
      title
      imageUrl
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
export { INSERT_POST, INSERT_SUBREDDIT };
