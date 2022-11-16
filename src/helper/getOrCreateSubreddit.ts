import { GET_SUBREDDIT_BY_TOPIC } from "graphql/queries";
import { INSERT_SUBREDDIT } from "graphql/mutations";
import apollo_client from "apollo-client";
// import types
import {
  SubredditType,
  SelectSubredditResultType,
  InsertSubredditResultType,
  InsertSubredditVarType,
} from "types";

async function getSubredditByTopic(topic: string): Promise<SubredditType[]> {
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

async function insertSubreddit({
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

async function subredditData({
  gSBT,
  topic,
}: {
  gSBT: (topic: string) => Promise<SubredditType[]>;
  topic: string;
}): Promise<{ subreddit_exists: boolean; subreddit_id: string | undefined }> {
  const subreddit_list = await gSBT(topic);
  if (subreddit_list.length > 0)
    return { subreddit_exists: true, subreddit_id: subreddit_list[0].id };
  else return { subreddit_exists: false, subreddit_id: undefined };
}

export default async function getOrCreateSubreddit({
  topic,
}: {
  topic: string;
}): Promise<{ subreddit_id: string }> {
  const { subreddit_exists, subreddit_id } = await subredditData({
    gSBT: getSubredditByTopic,
    topic,
  });
  if (!subreddit_exists) {
    const new_subreddit = await insertSubreddit({ topic });
    return { subreddit_id: new_subreddit.id };
  }
  return { subreddit_id: subreddit_id! };
}
