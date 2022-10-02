import Spinner from 'components/shared/Spinner';
import { GET_SUBREDDIT_BY_POSTID } from 'graphql/queries';

import { useQuery } from '@apollo/client';

export default function Subreddit({ subreddit_id }: { subreddit_id: string }): JSX.Element {
    const { data, loading, error } = useQuery<SelectSubredditResultType, { subreddit_id: string }>(GET_SUBREDDIT_BY_POSTID, {
        variables: {
            subreddit_id
        }
    })
    if (loading)
        return <Spinner />
    if (!loading && !error) {

        return <p className="text-black hover:text-blue-500 cursor-pointer">r/{data?.subreddit[0].topic}</p>
    }
    return <p>Error</p>

}