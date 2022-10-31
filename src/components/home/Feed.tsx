import { useQuery } from "@apollo/client";
// graphql queries
import { GET_POSTS } from "graphql/queries";
// custom components
import Post from "components/shared/Post";
import Spinner from "components/shared/Spinner";

// import types
import { SelectPostResultType } from "types";

interface Props {
  subreddit?: string;
  styling: {
    marginTop: string;
    marginBottom: string;
  };
}

export default function Feed({ subreddit, styling }: Props): JSX.Element {
  const { data, loading } = useQuery<SelectPostResultType, {}>(GET_POSTS);

  if (loading) return <Spinner />;

  const post_list = !!subreddit
    ? data?.post.filter((post) => post.subreddit.topic === subreddit)
    : data?.post;
  return (
    <div
      className={`${styling.marginTop} ${styling.marginBottom}  flex-1  space-y-3`}
    >
      {post_list?.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}
