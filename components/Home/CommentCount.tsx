import { useQuery } from '@apollo/client';
// graphql
import { GET_COMMENT_BY_POSTID } from 'graphql/queries';
// react icons
import { HiOutlineChat } from 'react-icons/hi';
// custom components
import Spinner from 'components/shared/Spinner';

interface Props {
    post_id: string
}

export default function CommentCount({ post_id }: Props): JSX.Element {

    const { data, loading, error } = useQuery<SelectCommentResultType, { post_id: string }>(GET_COMMENT_BY_POSTID, {
        variables: {
            post_id
        }
    })
    if (loading)
        return <Spinner />

    if (!loading && !error) {
        const comment_length = data?.comment.length

        return <div className="post-button">
            <HiOutlineChat />
            <p>{comment_length} <span className="hidden sm:inline-flex">Comment</span></p>
        </div >
    }

    return <p>Error</p>

}