// custom context
import { useComment } from "contexts/CommentContext";
// import custom component
import CommentFragment from "./CommentFragment";

interface Props {
  comment?: CommentType[];
}

export default function CommentList({ comment }: Props): JSX.Element {
  const { root_comments } = useComment();
  const comments = comment || root_comments;

  if (comments?.length > 0)
    return (
      <div className="space-y-3">
        {comments.map((comment) => (
          <CommentFragment key={comment.id} comment={comment} />
        ))}
      </div>
    );

  return (
    <div className="bg-white rounded-md">
      <h4 className="text-2xl font-semibold">No comments posted</h4>
    </div>
  );
}
