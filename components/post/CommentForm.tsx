import { useRouter } from "next/router"
import { SubmitHandler, useForm } from "react-hook-form"
import { useAuthenticationStatus, useUserDisplayName } from "@nhost/react"
// GRAPHQL
import { GET_COMMENT_BY_POSTID } from "graphql/queries"
import { INSERT_COMMENT } from "graphql/mutations"
// APOLLO 
import apollo_client from "apollo-client"

interface Props {
    post_id: string
}

interface FormProps {
    comment: string
}

export default function CommentForm({ post_id }: Props): JSX.Element {

    const router = useRouter()
    const { isAuthenticated } = useAuthenticationStatus()
    const username = useUserDisplayName()

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormProps>()
    const postComment: SubmitHandler<FormProps> = async (formData) => {

        const query_result = await apollo_client.mutate<InsertCommentResultType, InsertCommentVarType>({
            mutation: INSERT_COMMENT,
            variables: {
                post_id,
                username: username as string,
                text: formData.comment
            },
            refetchQueries: [{ query: GET_COMMENT_BY_POSTID, variables: { post_id } }],
            fetchPolicy: "network-only",
            errorPolicy: "ignore"
        })

    }

    return <div className="p-6 pl-16 rounded-b-md border-t-0 bg-white rounded-md space-y-3">
        {
            !!isAuthenticated && <p className="text-sm">Comment as <span className="text-reddit-col ">{username}</span> </p>
        }
        <form className="flex flex-col space-y-6" onSubmit={handleSubmit(postComment)}>
            <textarea
                {...register("comment")}
                disabled={!isAuthenticated}
                className="h-40 rounded-md border-gray-200 border p-2 pl-4 outline-none disabled:bg-gray-50"
                placeholder={
                    isAuthenticated ? "Comment your thoughts!" : "Please signin to comment."
                }
            />
            {
                !!watch("comment") && <button
                    type="submit"
                    disabled={!isAuthenticated}
                    className="self-start rounded-full bg-reddit-col p-3 px-6 font-semibold text-white disabled:bg-gray-200 resize-none"
                >
                    Comment
                </button>
            }
        </form>
    </div>
}