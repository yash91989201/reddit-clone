import { useState } from 'react';
import { SubmitHandler, useForm } from "react-hook-form"
import apollo_client from 'apollo-client';
import { useAuthenticationStatus, useUserDisplayName } from '@nhost/nextjs';
import toast from 'react-hot-toast';
// graphql schemas
import { GET_POSTS, GET_SUBREDDIT_BY_TOPIC } from 'graphql/queries';
import { INSERT_POST, INSERT_SUBREDDIT } from 'graphql/mutations';
// import icons
import { HiLink, HiOutlinePhotograph } from 'react-icons/hi';
// custom components
import Avatar from '../shared/Avatar';
import { useMutation } from '@apollo/client';

async function getSubredditByTopic(topic: string): Promise<SubredditType[]> {

    const queryResult = await apollo_client.query<SelectSubredditResultType, { topic: string }>({
        query: GET_SUBREDDIT_BY_TOPIC,
        variables: {
            topic: topic
        }
    })

    return queryResult.data.subreddit

}

interface Props {
    subreddit?: string
    styling: {
        top: string
    }
}

interface FormProps {
    title: string,
    body: string,
    image_url: string,
    subreddit: string
}

export default function PostBox({ subreddit, styling }: Props): JSX.Element {

    const [imageBox, setImageBox] = useState(false)
    const { isAuthenticated } = useAuthenticationStatus()
    const [insertPost] = useMutation<SelectPostResultType, InsertPostVarType>(INSERT_POST, {
        refetchQueries: [{ query: GET_POSTS }],
    })
    const [insertSubreddit] = useMutation<InsertSubredditResultType, InsertSubredditVarType>(INSERT_SUBREDDIT)
    const username = useUserDisplayName()
    const {
        register,
        reset,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<FormProps>({
        defaultValues: {
            subreddit: subreddit || undefined
        }
    })

    const createPost: SubmitHandler<FormProps> = async (formData) => {

        const createPostNotification = toast.loading("Creating new post ...")

        try {
            const subredditList = await getSubredditByTopic(formData.subreddit)
            const subredditExists = subredditList.length > 0

            if (subredditExists) {
                const subreddit_id = subredditList[0].id
                const { errors } = await insertPost({
                    variables: {
                        username: username!,
                        title: formData.title,
                        body: formData.body,
                        image_url: formData.image_url,
                        subreddit_id: subreddit_id!
                    }
                })

                if (errors) {
                    console.log(errors[0].message);
                    throw new Error("Error occoured while creating post.")
                }
            }
            else {
                console.log("subreddit is new -> creating a new subreddit topic");

                const subredditInsertResult = await insertSubreddit({
                    variables: {
                        topic: formData.subreddit
                    }
                })
                const subreddit_id = subredditInsertResult.data?.insert_subreddit_one.id
                const { errors } = await insertPost({
                    variables: {
                        username: username!,
                        title: formData.title,
                        body: formData.body,
                        image_url: formData.image_url,
                        subreddit_id: subreddit_id!
                    }
                })

                if (errors) {

                    console.log(errors[0].message);
                    throw new Error("Error occoured while creating post.")

                }
            }
            reset()
            toast.success("New post added", {
                id: createPostNotification
            })
        } catch (error: unknown) {
            if (error instanceof Error)
                toast.error(error.message, {
                    id: createPostNotification
                })
        }
    }

    return <form className={`sticky ${styling.top}  z-20 bg-white md:rounded-md`} onSubmit={handleSubmit(createPost)}>
        <div className="py-1.5 flex items-center">
            <Avatar seed={username!} />
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
                        <input {...register("subreddit", { required: true })}
                            type="text"
                            placeholder={
                                isAuthenticated ?
                                    "Create a post by entering a title" :
                                    "Sign In to create a post"
                            }
                            disabled={subreddit !== undefined}
                            className={`m-2 flex-1 bg-red-50 p-2 rounded-md outline-none text-sm disabled:text-gray-400 disabled:cursor-not-allowed`}
                        />
                    </div>
                    {
                        imageBox && <div className="flex items-center px-2">
                            <p className="min-w-[90px]">Subreddit</p>
                            <input {...register("image_url", { required: false })} type="text"
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

}