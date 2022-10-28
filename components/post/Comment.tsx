import ReactTimeago from 'react-timeago'
// CUSTOM COMPONENTS
import Avatar from 'components/shared/Avatar'
// import types
import { CommentType } from 'typings'

interface Props {
    comment: CommentType[]
}

export default function Comment({ comment }: Props): JSX.Element {

    if (comment.length > 0)
        return <div className='p-6 sm:pl-16  bg-white  space-y-3 rounded'>
            <h4 className='  font-semibold text-xl sm:text-2xl'>Comments</h4>
            <div className='space-y-3'>
                {
                    comment.map(comment => <div key={comment.id}>
                        <div className='p-3 flex items-start border rounded space-x-3'>
                            <Avatar seed={comment.user.displayName} />
                            <div>
                                <div className='flex space-x-3 text-sm sm:text-base'>
                                    <p>Posted by {comment.user.displayName}</p>
                                    <ReactTimeago date={comment.created_at} minPeriod={3600} className='text-gray-400' />
                                </div>
                                <p className='py-3 text-sm sm:text-base'>{comment.text}</p>
                            </div>
                        </div>
                    </div>)
                }
            </div>
        </div>

    return <div className='p-3 pl-14 bg-white rounded-md'>
        <h4 className='font-semibold text-2xl'>No comments posted</h4>
    </div>

}