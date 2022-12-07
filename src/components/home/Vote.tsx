// custom hook import
import useUpvote from "hooks/useUpvote";
// react icons
import { TbArrowBigDown, TbArrowBigTop } from "react-icons/tb";

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
  const [vote_count, has_user_voted, upVote] = useUpvote({
    post_id,
    comment_id,
    vote,
  });

  return (
    <div className={styling}>
      <div
        className="p-1 text-xl rounded-sm cursor-pointer hover:text-red-500 hover:bg-gray-200"
        onClick={() => upVote(true)}
      >
        <TbArrowBigTop
          className={
            has_user_voted && has_user_voted
              ? "fill-reddit-col stroke-reddit-col"
              : ""
          }
        />
      </div>
      <p className="text-black cursor-default">{vote_count}</p>
      <div
        className="p-1 text-xl rounded-sm cursor-pointer hover:text-blue-500 hover:bg-gray-200"
        onClick={() => upVote(false)}
      >
        <TbArrowBigDown
          className={
            has_user_voted == false ? "fill-blue-500 stroke-blue-500" : ""
          }
        />
      </div>
    </div>
  );
}
