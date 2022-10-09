import Link from 'next/link';
import { useQuery } from '@apollo/client';
// graphql
import { GET_SUBREDDIT_BY_POSTID } from 'graphql/queries';
// custom components
import Spinner from 'components/shared/Spinner';

interface Props {
    topic: string
}

export default function Subreddit({ topic }: Props): JSX.Element {


    return <Link href={`/subreddit/${topic}`} passHref>
        <span className="text-black hover:text-blue-500 cursor-pointer">
            r/{topic}
        </span>
    </Link>

}