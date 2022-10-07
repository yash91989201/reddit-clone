import { useQuery } from "@apollo/client"
// graphql queries
import { GET_POSTS } from "graphql/queries"
// custom components
import Post from "components/shared/Post"
import Spinner from "components/shared/Spinner"

interface Props {
    subreddit_id?: string,
    styling: {
        marginTop: string
        marginBottom: string
    }
}

export default function Feed({ subreddit_id, styling }: Props): JSX.Element {

    const { data, loading } = useQuery<SelectPostResultType, {}>(GET_POSTS)
    const post_list = !!subreddit_id ? data?.post.filter(post => post.subreddit_id === subreddit_id) : data?.post

    if (loading)
        return <Spinner />
    console.log(post_list)
    return <div className={`${styling.marginTop} ${styling.marginBottom}  flex-1  space-y-3`}>
        {
            post_list?.map(post => <Post key={post.id} post={post} />)
        }
    </div>

}