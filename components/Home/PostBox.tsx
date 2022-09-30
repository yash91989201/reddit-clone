import { useState } from "react"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { ApolloClient, InMemoryCache } from "@apollo/client"
import { useAuthenticationStatus, useUserDisplayName } from "@nhost/nextjs"
import apolloClient from "apollo-client"
// import icons
import { HiOutlinePhotograph, HiLink } from "react-icons/hi"
// custom components
import Avatar from "./Avatar"
// queries
import { GET_SUBREDDIT_BY_TOPIC } from "graphql/queries"
// mutations
import { INSERT_POST, INSERT_SUBREDDIT } from "graphql/mutations"

interface FormInputType {
    title: string,
    body: string,
    imageUrl: string,
    subreddit: string
}

interface Subreddit {
    id: string,
    created_at: string,
    topic: string
}

interface INSERT_SUBREDDIT_ONE extends Subreddit { }

interface SubredditSelectQueryResult {
    subreddit: Subreddit[]
}
interface SubredditQueryVars {
    topic: string
}


interface SubredditInsertQueryResult {
    insert_subreddit_one: INSERT_SUBREDDIT_ONE
}

interface PostInsertVars {
    username: string
    title: string
    imageUrl?: string
    body: string
    subreddit_id: string
}

interface PostInsertResult {

}

const PostBox = () => {
    const router = useRouter()
    const [imageBox, setImageBox] = useState(false)
    const { isAuthenticated } = useAuthenticationStatus()
    const username = useUserDisplayName()
    const {
        register,
        setValue,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<FormInputType>()

    async function getSubredditByTopic(topic: string) {
        const queryResult = await apolloClient.query<SubredditSelectQueryResult, SubredditQueryVars>({
            query: GET_SUBREDDIT_BY_TOPIC,
            variables: {
                topic: topic
            }
        })
        return queryResult.data.subreddit
    }

    const onSubmitHandler = handleSubmit(async (formData) => {
        try {

            const subredditList = await getSubredditByTopic(formData.subreddit)
            const subredditExists = subredditList.length > 0
            if (subredditExists) {
                const subreddit_id = subredditList[0].id
                const postInsertResult = await apolloClient.mutate<PostInsertResult, PostInsertVars>({
                    mutation: INSERT_POST,
                    variables: {
                        username: username!,
                        title: formData.title,
                        body: formData.body,
                        imageUrl: formData.imageUrl,
                        subreddit_id: subreddit_id!
                    }
                })
                if (!postInsertResult.errors) {
                    router.reload()
                }
                else console.log(postInsertResult.errors)
            }
            else {
                console.log("subreddit is new -> creating a new subreddit topic");
                const subredditInsertResult = await apolloClient.mutate<SubredditInsertQueryResult, SubredditQueryVars>({
                    mutation: INSERT_SUBREDDIT,
                    variables: {
                        topic: formData.subreddit
                    }
                })
                const subreddit_id = subredditInsertResult.data?.insert_subreddit_one.id
                const postInsertResult = await apolloClient.mutate<PostInsertResult, PostInsertVars>({
                    mutation: INSERT_POST,
                    variables: {
                        username: username!,
                        title: formData.title,
                        body: formData.body,
                        imageUrl: formData.imageUrl,
                        subreddit_id: subreddit_id!
                    }
                })
                if (!postInsertResult.errors) {
                    router.reload()
                }
                else console.log(postInsertResult.errors)
            }

        } catch (error) {
            console.log(error);
        }
    })

    return (

        <form className="sticky top-20 z-10 max-w-4xl mx-auto bg-white md:rounded-md" onSubmit={onSubmitHandler}>
            <div className="py-1.5 flex items-center">
                <Avatar />
                <input
                    {...register("title", { required: true })}
                    disabled={!isAuthenticated}
                    type="text"
                    autoComplete="off"
                    placeholder={
                        isAuthenticated ? "Create a post by entering a title" : "Sign In to post"
                    }
                    className="flex-1 rounded-md bg-gray-100  p-2 outline-none text-sm disabled:cursor-not-allowed"
                />
                <div className="mx-3 flex items-center space-x-3">
                    <HiOutlinePhotograph
                        className={`icon text-gray-400 ${imageBox && "text-red-300"}`}
                        onClick={() => setImageBox(!imageBox)} />
                    <HiLink className="icon text-gray-400" />
                </div>
            </div>
            {
                !!watch("title") && (
                    <div className="flex flex-col py-2">
                        <div className="flex items-center px-2">
                            <p className="min-w-[90px]">Body</p>
                            <input {...register("body", { required: false })} type="text"
                                placeholder="Text (optional)"
                                className="m-2 flex-1 bg-red-50 p-2 rounded-md outline-none text-sm"
                            />
                        </div>
                        <div className="flex items-center px-2">
                            <p className="min-w-[90px]">Subreddit</p>
                            <input {...register("subreddit", { required: true })} type="text"
                                placeholder="i.e react js"
                                className="m-2 flex-1 bg-red-50 p-2 rounded-md outline-none text-sm"
                            />
                        </div>
                        {
                            imageBox && <div className="flex items-center px-2">
                                <p className="min-w-[90px]">Subreddit</p>
                                <input {...register("imageUrl", { required: false })} type="text"
                                    placeholder="(Optional)"
                                    className="m-2 flex-1 bg-red-50 p-2 rounded-md outline-none text-sm"
                                />
                            </div>
                        }
                        {
                            Object.keys(errors).length > 0 && <div>
                                {
                                    errors.title?.type == "required" && <p>A post title is required</p>
                                }
                                {
                                    errors.subreddit?.type == "required" && <p>A subreddit is required</p>
                                }
                            </div>
                        }
                        {
                            !!watch("title") && <button type="submit"
                                className="self-center my-2 bg-orange-600 rounded-md p-2 text-white"
                            >Create Post</button>
                        }
                    </div>
                )
            }
        </form>

    )
}

export default PostBox