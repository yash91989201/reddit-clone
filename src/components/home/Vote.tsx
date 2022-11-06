import { useMutation } from "@apollo/client";
import { useAuthenticated, useUserData, useUserId } from "@nhost/react";
// graphql
import { GET_POST } from "graphql/queries";
// react icons
import { TbArrowBigDown, TbArrowBigTop } from "react-icons/tb";
// custom components
import { toast } from "react-hot-toast";
import { INSERT_VOTE, UPDATE_VOTE } from "graphql/mutations";
// import types
import {
  InsertVoteVarType,
  UpdateVoteResultType,
  UpdateVoteVarType,
  VoteType,
} from "types";

interface Props {
  post_id?: string;
  comment_id?: string;
  vote: VoteType[];
}

export default function Vote({
  post_id,
  comment_id,
  vote,
}: Props): JSX.Element {
  const userId = useUserId();
  const isAuthenticated = useAuthenticated();
  const vote_count = vote?.reduce((total, vote) => {
    return vote.upvote ? (total += 1) : (total -= 1);
  }, 0);
  // check for the vote done by a specific user with given username
  const user_vote_object = vote?.find((vote) => vote.user_id === userId);
  // check if the user has already voted
  const has_user_voted = user_vote_object?.upvote;
  // get the vote id for a possible update
  const vote_id = user_vote_object?.id;

  const [insertVote] = useMutation<VoteType, InsertVoteVarType>(INSERT_VOTE, {
    refetchQueries: [{ query: GET_POST, variables: { id: post_id } }],
  });
  const [updateVote] = useMutation<UpdateVoteResultType, UpdateVoteVarType>(
    UPDATE_VOTE,
    {
      refetchQueries: [{ query: GET_POST, variables: { id: post_id } }],
    }
  );

  const upVote = async (up_vote: boolean) => {
    if (!isAuthenticated) {
      toast.error("Please Signin to vote.");
      return;
    }
    if (has_user_voted == undefined) {
      insertVote({
        variables: {
          user_id: userId as string,
          post_id: comment_id == undefined ? post_id! : null,
          comment_id: comment_id || null,
          upvote: up_vote,
        },
      }).then(function () {
        toast.success("Added your vote.");
      });
      return;
    }
    if (has_user_voted && up_vote) return;
    if (!has_user_voted && !up_vote) return;

    updateVote({
      variables: {
        id: vote_id!,
        upvote: !has_user_voted,
      },
    }).then(function (res) {
      if (res.data?.update_vote.affected_rows) toast.success("Vote Updated");
    });
  };

  return (
    <>
      <div
        className="text-xl hover:bg-gray-200 p-1 rounded-sm cursor-pointer hover:text-red-500"
        onClick={() => upVote(true)}
      >
        <TbArrowBigTop />
      </div>
      <p className="text-black cursor-default">{vote_count}</p>
      <div
        className="text-xl hover:bg-gray-200 p-1 rounded-sm cursor-pointer hover:text-blue-500"
        onClick={() => upVote(false)}
      >
        <TbArrowBigDown />
      </div>
    </>
  );
}
