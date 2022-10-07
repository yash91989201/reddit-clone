import { useRouter } from "next/router"
import { useQuery } from '@apollo/client'
// GRAPHQL
import { GET_SUBREDDIT } from 'graphql/queries'
// CUSTOM COMPONENTS
import PostBox from 'components/home/PostBox'
import Feed from 'components/home/Feed'
import Avatar from 'components/shared/Avatar'
import Spinner from 'components/shared/Spinner'

export default function Subreddit(): JSX.Element {

    const { id } = useRouter().query
    const { data, loading, error } = useQuery<SelectSubredditResultType, { id: string }>(GET_SUBREDDIT, {
        variables: {
            id: id as string
        }
    })
    if (loading)
        return <Spinner />
    console.log(data);
    const topic = data?.subreddit[0].topic!

    return <div className="-mt-12">
        <div className="h-64 my-12 flex flex-col-reverse  bg-reddit-col">
            <div className="bg-white">
                <div className="mx-auto flex max-w-5xl items-center space-x-4 py-6">
                    {/* avatar image */}
                    <Avatar seed={topic} />
                    {/* subreddit title */}
                    <div>
                        <h1 className="text-3xl font-semibold">Welcome to the r/{topic} subreddit</h1>
                        <p className="text-sm text-gray-400">r/{topic}</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="max-w-5xl mx-auto">
            <PostBox subreddit={topic} styling={{ top: "top-8" }} />
            <Feed subreddit_id={data?.subreddit[0].id!} styling={{ marginTop: "mt-12", marginBottom: "mb-16" }} />
        </div>
    </div>

}