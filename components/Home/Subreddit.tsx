import Link from 'next/link';
import { useQuery } from '@apollo/client';
// graphql
import { GET_SUBREDDIT_BY_POSTID } from 'graphql/queries';
// custom components
import Spinner from 'components/shared/Spinner';

interface Props {
    subreddit_id: string
}

export default function Subreddit({ subreddit_id }: Props): JSX.Element {

    const { data, loading, error } = useQuery<SelectSubredditResultType, { subreddit_id: string }>(GET_SUBREDDIT_BY_POSTID, {
        variables: {
            subreddit_id
        }
    })
    if (loading)
        return <Spinner />

    if (!loading && !error) {
        return <Link href={`/subreddit/${subreddit_id}`}>
            <a className="text-black hover:text-blue-500 cursor-pointer">
                r/{data?.subreddit[0].topic}
            </a>
        </Link>
    }

    return <p>Error</p>

}