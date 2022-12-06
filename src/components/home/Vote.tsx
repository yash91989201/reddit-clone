import { useMutation } from "@apollo/client";
import { useAuthenticated, useUserId } from "@nhost/react";
// graphql
import { GET_POST } from "graphql/queries";
// react icons
import { TbArrowBigDown, TbArrowBigTop } from "react-icons/tb";
// custom components
import { toast } from "react-hot-toast";
import { DELETE_VOTE, INSERT_VOTE, UPDATE_VOTE } from "graphql/mutations";

interface Props {
  post_id?: string;
  comment_id?: string;
  vote: VoteType[];
  styling: string;
}

export default function Vote({
  post_id,
  comment_id,
  vote,
  styling,
}: Props): JSX.Element {
  const userId = useUserId();
  const isAuthenticated = useAuthenticated();
  const vote_count = vote?.reduce((total, vote) => {
    return vote.upvote ? (total += 1) : (total -= 1);
  }, 0);
  // check for the vote done by a specific user with given userId
  const user_vote_object = vote?.find((vote) => vote.user_id === userId);
  // check if the user has already voted
  const has_user_voted = user_vote_object?.upvote;
  console.log(has_user_voted);
  const arrowStyling = (has_user_voted: boolean | undefined) => {
    switch (has_user_voted) {
      case true:
        return "fill-reddit-col stroke-reddit-col";
      case false:
        return "fill-blue-500 stroke-blue-500";
      default: {
        return "";
      }
    }
  };
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

  const [deleteVote] = useMutation<DeleteVoteResultType, DeleteVoteVarType>(
    DELETE_VOTE,
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
      deleteVote({ variables: { id: vote_id! } });
      return;
    }

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
    <div className={styling}>
      <div
        className="p-1 text-xl rounded-sm cursor-pointer hover:text-red-500 hover:bg-gray-200"
        onClick={() => upVote(true)}
      >
        <TbArrowBigTop
          className={has_user_voted ? arrowStyling(has_user_voted) : ""}
        />
      </div>
      <p className="text-black cursor-default">{vote_count}</p>
      <div
        className="p-1 text-xl rounded-sm cursor-pointer hover:text-blue-500 hover:bg-gray-200"
        onClick={() => upVote(false)}
      >
        <TbArrowBigDown
          className={!has_user_voted ? arrowStyling(has_user_voted) : ""}
        />
      </div>
    </div>
  );
}
