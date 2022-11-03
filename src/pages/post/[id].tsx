import Head from "next/head";
import { useRouter } from "next/router";
import { useAuthenticationStatus, useUserDisplayName } from "@nhost/react";
// graphql queries/mutations
import { GET_POST } from "graphql/queries";
// context
import CommentProvider from "contexts/CommentContext";
// custom components
import Post from "components/shared/Post";
import CommentForm from "components/post/CommentForm";
import CommentList from "components/post/CommentList";
import Spinner from "components/shared/Spinner";
import { useQuery } from "@apollo/client";
// import types
import { SelectPostResultType } from "types";

export default function Home(): JSX.Element {
  const { id } = useRouter().query;
  const { isAuthenticated } = useAuthenticationStatus();
  const username = useUserDisplayName();
  const { data, loading, error } = useQuery<
    SelectPostResultType,
    { id: string }
  >(GET_POST, {
    variables: {
      id: id as string,
    },
  });

  if (loading) return <Spinner />;
  const post = data?.post[0];

  return (
    <div className="max-w-5xl mx-auto my-12 space-y-3">
      <Head>
        <title>
          {post?.title} | {post?.username}
        </title>
        <meta name="description" content="Signup for our new Reddit 2.0 " />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Post post={post!} />
      <div className="p-6 sm:pl-16  bg-white  space-y-3 rounded">
        {!!isAuthenticated && (
          <p className="text-xl sm:text-2xl font-semibold">
            Comment as <span className="text-reddit-col ">{username}</span>{" "}
          </p>
        )}
        <CommentForm post_id={post?.id!} />
      </div>
      <CommentProvider post_id={post?.id!}>
        <div className="p-6 sm:pl-16  bg-white  space-y-3 rounded">
          <h4 className="  font-semibold text-xl sm:text-2xl">Comments</h4>
          <CommentList />
        </div>
      </CommentProvider>
    </div>
  );
}
