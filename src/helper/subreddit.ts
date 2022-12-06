import apollo_client from "config/apollo-client";
// graphql schema imports
import { INSERT_SUBREDDIT } from "graphql/mutations";
// graphql schema imports
import { GET_SUBREDDIT_BY_TOPIC } from "graphql/queries";
// import { SubredditType } from "types";
// type imports
// import {
//   SelectSubredditResultType,
//   SubredditType,
//   InsertSubredditResultType,
//   InsertSubredditVarType,
// } from "types";

export async function getSubredditByTopic({
  topic,
}: {
  topic: string;
}): Promise<SubredditType[]> {
  const queryResult = await apollo_client.query<
    SelectSubredditResultType,
    { topic: string }
  >({
    query: GET_SUBREDDIT_BY_TOPIC,
    variables: {
      topic: topic,
    },
  });

  return queryResult.data.subreddit;
}

export async function getSubredditId({
  topic,
}: {
  topic: string;
}): Promise<{ subreddit_id: string }> {
  const subreddit = await getSubredditByTopic({ topic });

  if (subreddit.length > 0) return { subreddit_id: subreddit[0].id };
  const new_subreddit = await insertSubreddit({ topic });
  return { subreddit_id: new_subreddit.id };
}

// type imports

export async function insertSubreddit({
  topic,
}: {
  topic: string;
}): Promise<SubredditType> {
  const queryResult = await apollo_client.mutate<
    InsertSubredditResultType,
    InsertSubredditVarType
  >({
    mutation: INSERT_SUBREDDIT,
    variables: {
      topic: topic,
    },
  });

  return queryResult.data?.insert_subreddit_one!;
}
