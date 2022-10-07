import { useQuery } from "@apollo/client"
// GRAPHQL
import { GET_COMMENT_BY_POSTID } from "graphql/queries"
import CommentForm from "./CommentForm"

interface Props {
    post_id: string
}

export default function Comment({ post_id }: Props): JSX.Element {

    const { data, loading, error } = useQuery<SelectCommentResultType, { post_id: string }>(GET_COMMENT_BY_POSTID, {
        variables: {
            post_id
        }
    })

    return <div className="bg-white rounded-md">
        <CommentForm post_id={post_id} />
        {data?.comment.map(comment => {
            return <p key={comment.id}>{comment.text}</p>
        })}
    </div>

}