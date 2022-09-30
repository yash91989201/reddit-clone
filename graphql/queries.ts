import { gql } from "@apollo/client";

// post queries
const GET_POSTS = gql`
  query getPosts {
    post {
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

const GET_POST = gql`
  query getPost($id: ID!) {
    post(where: { id: { _eq: $id } }) {
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

// subreddit queries
const GET_SUBREDDIT_BY_TOPIC = gql`
  query getSubredditByTopic($topic: String!) {
    subreddit(where: {topic: {_eq: $topic}}) {
    id
    created_at
    topic
  }
  }
`;

export { GET_POSTS, GET_POST, GET_SUBREDDIT_BY_TOPIC };
