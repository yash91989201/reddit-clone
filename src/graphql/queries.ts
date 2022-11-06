import { gql } from "@apollo/client";

// post queries
const GET_POSTS = gql`
  query getPosts {
    post(order_by: { created_at: desc }) {
      id
      created_at
      user {
        id
        displayName
      }
      subreddit {
        id
        topic
      }
      # comment {
      #   id
      #   created_at
      #   user_id
      #   post_id
      #   parent_id
      #   text
      #   vote {
      #     id
      #     user_id
      #     comment_id
      #     upvote
      #   }
      # }
      comment_aggregate(where: { parent_id: { _is_null: true } }) {
        aggregate {
          count
        }
      }
      vote {
        id
        user_id
        post_id
        upvote
      }
      title
      image_url
      body
    }
  }
`;

const GET_POST = gql`
  query getPost($id: uuid!) {
    post_by_pk(id: $id) {
      id
      created_at
      user {
        id
        displayName
        email
      }
      subreddit {
        id
        created_at
        topic
      }
      # comment {
      #   id
      #   created_at
      #   user_id
      #   post_id
      #   parent_id
      #   text
      #   vote {
      #     id
      #     user_id
      #     post_id
      #     comment_id
      #     upvote
      #   }
      # }
      comment_aggregate(where: { parent_id: { _is_null: true } }) {
        aggregate {
          count
        }
      }
      vote {
        id
        user_id
        post_id
        upvote
      }
      title
      image_url
      body
    }
  }
`;

const GET_POST_BY_SUBREDDIT_ID = gql`
  query getPost($subreddit_id: uuid!) {
    post(where: { subreddit_id: { _eq: $subreddit_id } }) {
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

// comment queries
const GET_COMMENT_BY_POSTID = gql`
  query getCommentByPostId($post_id: uuid!) {
    comment(where: { post_id: { _eq: $post_id } }) {
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

// subreddit queries
const GET_SUBREDDITS = gql`
  query getSubreddits {
    subreddit {
      id
      created_at
      topic
    }
  }
`;

const GET_SUBREDDIT = gql`
  query getSubreddit($id: uuid!) {
    subreddit(where: { id: { _eq: $id } }) {
      id
      created_at
      topic
    }
  }
`;

const GET_SUBREDDIT_BY_TOPIC = gql`
  query getSubredditByTopic($topic: String!) {
    subreddit(where: { topic: { _eq: $topic } }) {
      id
      created_at
      topic
    }
  }
`;

const GET_SUBREDDIT_BY_POSTID = gql`
  query getSubredditByTopic($subreddit_id: uuid!) {
    subreddit(where: { id: { _eq: $subreddit_id } }) {
      id
      created_at
      topic
    }
  }
`;

// votes queries
const GET_VOTES_BY_POSTID = gql`
  query getVoteByPostId($post_id: uuid!) {
    vote(where: { post_id: { _eq: $post_id } }) {
      id
      post_id
      username
      upvote
    }
  }
`;

export {
  GET_POSTS,
  GET_POST,
  GET_POST_BY_SUBREDDIT_ID,
  GET_SUBREDDITS,
  GET_SUBREDDIT,
  GET_SUBREDDIT_BY_TOPIC,
  GET_SUBREDDIT_BY_POSTID,
  GET_COMMENT_BY_POSTID,
  GET_VOTES_BY_POSTID,
};
