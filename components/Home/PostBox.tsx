import { useForm } from "react-hook-form"
import { useAuthenticationStatus } from "@nhost/nextjs"
import { useQuery } from "@apollo/client"
// import icons
import { HiOutlinePhotograph, HiLink } from "react-icons/hi"
// custom compoents
import Avatar from "./Avatar"
import { useState } from "react"
// queries
import { GET_SUBREDDIT_BY_TOPIC } from "graphql/queries"
// mutations
import { INSERT_POST } from "graphql/mutations"

interface FormInputType {
    title: string,
    body: string,
    imageUrl: string,
    subreddit: string
}

const PostBox = () => {
    const [imageBox, setImageBox] = useState(false)
    const { isAuthenticated } = useAuthenticationStatus()
    const {
        register,
        setValue,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<FormInputType>()

    const onSubmit = handleSubmit(async (formData) => {
        // const {}=useQuery(GET_SUBREDDIT_BY_TOPIC,{
        //     variables:formData.subreddit
        // })
        try {
        } catch (error) {

        }
    })

    return (

        <form className="sticky top-20 z-10 max-w-4xl mx-auto bg-white rounded-md"
            onSubmit={onSubmit}
        >
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