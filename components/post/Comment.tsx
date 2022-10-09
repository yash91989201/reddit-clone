import ReactTimeago from 'react-timeago'
// CUSTOM COMPONENTS
import Avatar from 'components/shared/Avatar'

interface Props {
    comment: CommentType[]
}

export default function Comment({ comment }: Props): JSX.Element {

    if (comment.length > 0)
        return <div className='bg-white rounded-md'>
            <h4 className='my-6 pl-14  font-semibold text-2xl'>Comments</h4>
            <div className='pl-14 space-y-3'>
                {
                    comment.map(comment => <div key={comment.id}>
                        <div className='p-3 flex items-center space-x-3 border rounded-md'>
                            <Avatar seed={comment.username} />
                            <div className='p-3'>
                                <div className='flex space-x-3  '>
                                    <p>Posted by {comment.username}</p>
                                    <ReactTimeago date={comment.created_at} minPeriod={3600} className='text-gray-400' />
                                </div>
                                <p className='py-3'>{comment.text}</p>
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