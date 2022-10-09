import { useQuery, useMutation } from '@apollo/client';
import { useAuthenticated, useUserData } from '@nhost/react';
// graphql
import { GET_POST, GET_VOTES_BY_POSTID } from 'graphql/queries';
// react icons
import { TbArrowBigDown, TbArrowBigTop } from 'react-icons/tb';
// custom components 
import Spinner from 'components/shared/Spinner';
import { toast } from 'react-hot-toast';
import { INSERT_VOTE, UPDATE_VOTE } from 'graphql/mutations';
import { isFloat32Array } from 'util/types';

interface Props {
    post_id: string
    vote: VoteType[]
}

export default function Vote({ post_id, vote }: Props): JSX.Element {

    const userData = useUserData()
    const isAuthenticated = useAuthenticated()
    const vote_count = vote.filter(vote => vote.upvote == true).length
    const user_vote = vote.find(vote => vote.username === userData?.displayName)
    const is_already_voted = user_vote?.upvote
    const vote_id = user_vote?.id

    const [insertVote] = useMutation<VoteType, InsertVoteVarType>(INSERT_VOTE, {
        refetchQueries: [{ query: GET_POST, variables: { id: post_id } }]
    })
    const [updateVote] = useMutation<UpdateVoteResultType, UpdateVoteVarType>(UPDATE_VOTE, {
        refetchQueries: [{ query: GET_POST, variables: { id: post_id } }]
    })

    const upVote = async (up_vote: boolean) => {
        if (!isAuthenticated) {
            toast.error("Please Signin to vote.")
            return
        }
        if (is_already_voted == undefined) {
            insertVote({
                variables: {
                    post_id,
                    username: userData?.displayName as string,
                    upvote: up_vote
                }
            })
                .then(function () {
                    toast.success("Added your vote.")
                })
            return
        }
        if (is_already_voted && up_vote) return
        if (!is_already_voted && !up_vote) return

        updateVote({
            variables: {
                id: vote_id,
                upvote: !is_already_voted
            }
        })
            .then(function (res) {
                if (res.data?.update_vote.affected_rows)
                    toast.success("Vote Updated")
            })

    }

    return <div className="p-3 flex flex-col items-center rounded-l-md text-gray-500 bg-gray-50 ">
        <TbArrowBigTop className="text-3xl hover:bg-gray-200 p-1 rounded-sm cursor-pointer hover:text-red-500"
            onClick={() => upVote(true)}
        />
        <p className="text-black cursor-default">{vote_count}</p>
        <TbArrowBigDown className="text-3xl hover:bg-gray-200 p-1 rounded-sm cursor-pointer hover:text-blue-500"
            onClick={() => upVote(false)}
        />
    </div>

}
