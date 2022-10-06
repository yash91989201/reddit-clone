import { useRouter } from "next/router"
import { useQuery } from "@apollo/client"
import { GET_POST } from "graphql/queries"
// custom components
import Post from "components/shared/Post"
import Spinner from "components/shared/Spinner"

export default function Home(): JSX.Element {

    const { id } = useRouter().query
    const { data, loading, error } = useQuery<SelectPostResultType, { id: string }>(GET_POST, {
        variables: {
            id: id as string
        }
    })

    const post = data?.post[0]!

    if (loading)
        return <Spinner />

    return <div className="max-w-5xl mx-auto py-12 ">
        <Post post={post} />
    </div>

}