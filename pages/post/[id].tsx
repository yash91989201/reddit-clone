import { useRouter } from "next/router"
import { useQuery } from "@apollo/client"
import { GET_POST } from "graphql/queries"
// custom components
import Post from "components/shared/Post"
import CommentForm from "components/post/CommentForm"
import Comment from "components/post/Comment"
import Spinner from "components/shared/Spinner"

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
        <Post post={post} />
        {/* <CommentForm post_id={post.id} /> */}
        <Comment post_id={post.id} />
    </div>

}