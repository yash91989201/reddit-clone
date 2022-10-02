import Spinner from 'components/shared/Spinner';
import { GET_COMMENT_BY_POSTID } from 'graphql/queries';
import { HiOutlineChat } from 'react-icons/hi';

import { useQuery } from '@apollo/client';
import { post_button } from './Feed';

export default function CommentFragment({ post_id }: { post_id: string }): JSX.Element {

    const { data, loading, error } = useQuery<SelectCommentResultType, { post_id: string }>(GET_COMMENT_BY_POSTID, {
        variables: {
            post_id
        }
    })
    if (loading)
        return <Spinner />
    if (!loading && !error) {
        const comment_length = data?.comment.length
        return <div className={post_button}>
            <HiOutlineChat />
            <p>{comment_length} <span className="hidden sm:inline-flex">comment</span></p>
        </div >
    }
    return <p>Error</p>

}