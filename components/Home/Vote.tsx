import { useQuery } from '@apollo/client';
import { useAuthenticated, useUserData } from '@nhost/react';
// graphql
import { GET_VOTES_BY_POSTID } from 'graphql/queries';
// react icons
import { TbArrowBigDown, TbArrowBigTop } from 'react-icons/tb';
// custom components 
import Spinner from 'components/shared/Spinner';
import { toast } from 'react-hot-toast';

interface Props {
    post_id: string
}

export default function Vote({ post_id }: Props): JSX.Element {

    const userData = useUserData()
    const isAuthenticated = useAuthenticated()
    const { data, loading, error } = useQuery<SelectVoteResultType, { post_id: string }>(GET_VOTES_BY_POSTID, {
        variables: {
            post_id
        }
    })

    const upVote = () => {
        if (!isAuthenticated) {
            toast("Please Signin to vote.")
            return
        }
    }

    if (loading)
        return <Spinner />

    const votes = data?.vote!
    if (!loading && !error) {
        const vote_count = votes.filter((vote) => {
            return vote.upvote == true
        })
        return <div className="p-3 flex flex-col items-center rounded-l-md text-gray-500 bg-gray-50 ">
            <TbArrowBigTop className="text-3xl hover:bg-gray-200 p-1 rounded-sm cursor-pointer hover:text-red-500"
            />
            <p className="text-black cursor-default">{vote_count?.length}</p>
            <TbArrowBigDown className="text-3xl hover:bg-gray-200 p-1 rounded-sm cursor-pointer hover:text-blue-500"
            />
        </div>
    }

    return <p>Error</p>

}