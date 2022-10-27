import Head from "next/head"
import { useRouter } from "next/router"
import { useQuery } from "@apollo/client"
import { GET_POST } from "graphql/queries"
// custom components
import Post from "components/shared/Post"
import CommentForm from "components/post/CommentForm"
import Comment from "components/post/Comment"
import Spinner from "components/shared/Spinner"
// import types
import { SelectPostResultType } from "typings"

export default function Home(): JSX.Element {

    const { id } = useRouter().query
    const { data, loading } = useQuery<SelectPostResultType, { id: string }>(GET_POST, {
        variables: {
            id: id as string
        }
    })

    if (loading)
        return <Spinner />

    const post = data?.post[0]!

    return <div className="max-w-5xl mx-auto my-12 space-y-3">
        <Head>
            <title>{post.title} | {post.username}</title>
            <meta name="description" content="Signup for our new Reddit 2.0 " />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Post post={post} >
            {
                {
                    key: 1,
                    component: <CommentForm post_id={post.id} />
                }
            }
            {
                {
                    key: 2,
                    component: <Comment comment={post.comment} />
                }
            }


        </Post>
    </div>

}