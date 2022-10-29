import Head from "next/head"
import { useRouter } from "next/router"
import { useQuery } from "@apollo/client"
import { GET_POST } from "graphql/queries"
// custom components
import Post from "components/shared/Post"
import CommentForm from "components/post/CommentForm"
import CommentList from "components/post/CommentList"
import Spinner from "components/shared/Spinner"
// import types
import { SelectPostResultType, CommentType } from "typings"
import { useMemo } from "react"

export default function Home(): JSX.Element {

    const { id } = useRouter().query
    const { data, loading } = useQuery<SelectPostResultType, { id: string }>(GET_POST, {
        variables: {
            id: id as string
        }
    })
    const post = data?.post[0]!
    type GroupType = {
        [key: string | "null"]: CommentType[]
    }
    const commentsByParentId = useMemo(() => {
        const group: GroupType = {};
        post?.comment.forEach((comment) => {
            const parent_id = comment.parent_id == null ? "null" : comment.parent_id
            group[parent_id] ||= [];
            group[comment.parent_id].push(comment);
        })
        return group;
    }, [post?.comment]);

    const getReplies = (parent_id: string) => {
        return commentsByParentId[parent_id]
    }
    const root_comments = commentsByParentId["null"];

    if (loading)
        return <Spinner />

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
                    component: <CommentList comment={root_comments} />
                }
            }
        </Post>
    </div>

}