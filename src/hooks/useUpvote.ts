import { useMutation } from "@apollo/client";
import { useAuthenticated, useUserId } from "@nhost/react";
import { DELETE_VOTE, INSERT_VOTE, UPDATE_VOTE } from "graphql/mutations";
import { GET_POST } from "graphql/queries";
import toast from "react-hot-toast";

interface Props {
  post_id?: string;
  comment_id?: string;
  vote: VoteType[];
}

type HookReturnType = [number, boolean | undefined, (up_vote: boolean) => void];

interface ReturnProps extends HookReturnType {}

export default function useUpvote({
  post_id,
  comment_id,
  vote,
}: Props): ReturnProps {
  const userId = useUserId();
  const isAuthenticated = useAuthenticated();
  const vote_count = vote.reduce((total, vote) => {
    return vote.upvote ? (total += 1) : (total -= 1);
  }, 0);
  // check for the vote done by a specific user with given userId
  const user_vote_object = vote.find((vote) => vote.user_id === userId);
  // user_vote_object contains the upvote object for the current user
  const has_user_voted = user_vote_object?.upvote;
  // get the vote id for a possible update or delete
  const user_vote_id = user_vote_object?.id;
  const [insertVote] = useMutation<VoteType, InsertVoteVarType>(INSERT_VOTE, {
    refetchQueries: [{ query: GET_POST, variables: { id: post_id } }],
  });
  const [updateVote] = useMutation<UpdateVoteResultType, UpdateVoteVarType>(
    UPDATE_VOTE,
    {
      refetchQueries: [{ query: GET_POST, variables: { id: post_id } }],
    }
  );

  const [deleteVote] = useMutation<DeleteVoteResultType, DeleteVoteVarType>(
    DELETE_VOTE,
    {
      refetchQueries: [{ query: GET_POST, variables: { id: post_id } }],
    }
  );

  const upVote = (up_vote: boolean) => {
    if (!isAuthenticated) {
      toast.error("Please Signin to vote.");
      return;
    }
    if (has_user_voted == undefined) {
      insertVote({
        variables: {
          user_id: userId!,
          post_id: post_id || null,
          comment_id: comment_id || null,
          upvote: up_vote,
        },
      }).then(function () {
        toast.success("Added your vote.");
      });
      return;
    }

    if ((has_user_voted && up_vote) || (!has_user_voted && !up_vote)) {
      deleteVote({ variables: { id: user_vote_id! } });
      return;
    }

    updateVote({
      variables: {
        id: user_vote_id!,
        upvote: !has_user_voted,
      },
    }).then(function (res) {
      if (res.data?.update_vote.affected_rows) toast.success("Vote Updated");
    });
  };

  return [vote_count, has_user_voted, upVote];
}
