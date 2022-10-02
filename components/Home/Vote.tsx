import Spinner from 'components/shared/Spinner';
import { GET_VOTES_BY_POSTID } from 'graphql/queries';
import { TbArrowBigDown, TbArrowBigTop } from 'react-icons/tb';

import { useQuery } from '@apollo/client';

export default function Vote({ post_id }: { post_id: string }): JSX.Element {

    const { data, loading, error } = useQuery<SelectVoteResultType, { post_id: string }>(GET_VOTES_BY_POSTID, {
        variables: {
            post_id
        }
    })
    if (loading)
        return <Spinner />
    if (!loading && !error) {
        const vote_count = data?.vote.filter((vote) => {
            return vote.upvote == true
        })
        return <div className="p-3 flex flex-col items-center rounded-l-md text-gray-500 bg-gray-50 ">
            <TbArrowBigTop className="text-3xl hover:bg-gray-200 p-1 rounded-sm cursor-pointer" />
            <p className="text-black cursor-default">{vote_count?.length}</p>
            <TbArrowBigDown className="text-3xl hover:bg-gray-200 p-1 rounded-sm cursor-pointer" />
        </div>
    }
    return <p>Error</p>

}