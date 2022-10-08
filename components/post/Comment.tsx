import { useQuery } from '@apollo/client'
import Avatar from 'components/shared/Avatar'
// GRAPHQL
import { GET_COMMENT_BY_POSTID } from 'graphql/queries'
import ReactTimeago from 'react-timeago'
import CommentForm from './CommentForm'
// CUSTOM COMPONENTS
import Spinner from 'components/shared/Spinner'

interface Props {
    post_id: string
}

export default function Comment({ post_id }: Props): JSX.Element {

    const { data, loading, error } = useQuery<SelectCommentResultType, { post_id: string }>(GET_COMMENT_BY_POSTID, {
        variables: {
            post_id
        },
    })

    if (loading)
        return <Spinner />

    return <div className='bg-white rounded-md'>
        <CommentForm post_id={post_id} />
        <div className='p-3'>
            <h4 className='my-6 pl-14  font-semibold text-2xl'>Comments</h4>
            <hr className='my-6' />
            <div className='pl-14 space-y-3'>
                {data?.comment.map(comment => <div key={comment.id}>
                    <div className='p-3 flex items-center space-x-3 border rounded-md'>
                        <Avatar seed={comment.username} />
                        <div className='p-3'>
                            <div className='flex space-x-3  '>
                                <p>Posted by {comment.username}</p>
                                <ReactTimeago date={comment.created_at} minPeriod={36000} className='text-gray-400' />
                            </div>
                            <p className='py-3'>{comment.text}</p>
                        </div>
                    </div>
                </div>)}
            </div>
        </div>
    </div>

}