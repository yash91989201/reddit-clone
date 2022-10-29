import ReactTimeago from "react-timeago"
// import custom component
import CommentFragment from "./CommentFragment"
import Avatar from "components/shared/Avatar"
import { CommentType } from "typings"

interface Props {
    comment: CommentType[]
}

export default function CommentList({ comment }: Props): JSX.Element {
    if (comment.length > 0)
        return <div className='p-6 sm:pl-16  bg-white  space-y-3 rounded'>
            <h4 className='  font-semibold text-xl sm:text-2xl'>Comments</h4>
            <div className='space-y-3'>
                {
                    comment.map(comment => <CommentFragment key={comment.id} comment={comment} />)
                }
            </div>
        </div>

    return <div className='p-3 pl-14 bg-white rounded-md'>
        <h4 className='font-semibold text-2xl'>No comments posted</h4>
    </div>
}