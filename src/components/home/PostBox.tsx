import { useState } from "react";
import Image from "next/image";
import { useQuery, useMutation } from "@apollo/client";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  useAuthenticationStatus,
  useUserDisplayName,
  useUserId,
  useFileUpload,
} from "@nhost/nextjs";
import toast from "react-hot-toast";
// graphql schemas
import { GET_POSTS, GET_SUBREDDITS } from "graphql/queries";
import { INSERT_POST } from "graphql/mutations";
// helper function
import getOrCreateSubreddit from "helper/getOrCreateSubreddit";
// import icons
import { HiLink, HiOutlinePhotograph } from "react-icons/hi";
import { MdOutlineClear, MdPostAdd } from "react-icons/md";

// custom components
import Avatar from "../shared/Avatar";
// import types
import {
  InsertPostVarType,
  SelectPostResultType,
  SelectSubredditResultType,
} from "types";

interface Props {
  subreddit?: string;
  styling: {
    top: string;
  };
}

interface FormProps {
  title: string;
  text: string;
  image: File[];
  link: string;
  subreddit: string;
}

interface TabProps {
  text: boolean;
  image: boolean;
  link: boolean;
}

export default function PostBox({ subreddit, styling }: Props): JSX.Element {
  const [tabState, setTabState] = useState<TabProps>({
    text: true,
    image: false,
    link: false,
  });
  const setCurrentTab = (tabName: string) => {
    setTabState(() => {
      return {
        text: tabName === "text",
        image: tabName === "image",
        link: tabName === "link",
      };
    });
    switch (tabName) {
      case "text": {
        resetField("image");
        resetField("link");
        break;
      }
      case "image": {
        resetField("text");
        resetField("link");
        break;
      }
      case "link": {
        resetField("image");
        resetField("text");
        break;
      }
    }
  };

  const { isAuthenticated } = useAuthenticationStatus();
  const userId = useUserId();
  const username = useUserDisplayName();
  // queries and mutations
  const { data } = useQuery<SelectSubredditResultType, {}>(GET_SUBREDDITS);
  const [insertPost] = useMutation<SelectPostResultType, InsertPostVarType>(
    INSERT_POST,
    {
      refetchQueries: [{ query: GET_POSTS }],
    }
  );

  // file upload hook
  const { upload } = useFileUpload();
  // form init
  const { register, reset, handleSubmit, watch, getValues, resetField } =
    useForm<FormProps>({
      defaultValues: {
        subreddit: subreddit || undefined,
        image: undefined,
      },
    });
  // create new post
  const createPost: SubmitHandler<FormProps> = async (formData) => {
    const createPostNotification = toast.loading("Creating new post ...");
    try {
      // if the given topic exists then return the subreddit_id
      // if the topic doesnot exists then create a new subreddit and return its id
      const { subreddit_id } = await getOrCreateSubreddit({
        topic: formData.subreddit,
      });
      const { id: image_id } =
        formData.image != undefined
          ? await upload({ file: formData.image[0] })
          : { id: undefined };

      const { errors } = await insertPost({
        variables: {
          user_id: userId!,
          subreddit_id: subreddit_id!,
          title: formData.title,
          text: formData.text,
          image_id: image_id,
          link: formData.link,
        },
      });

      if (errors) {
        throw new Error("Error occoured while creating post.");
      }
      reset();
      toast.success("New post added", {
        id: createPostNotification,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message, {
          id: createPostNotification,
        });
      }
    }
  };
  return (
    <form
      className={`sticky ${styling.top}  z-20 space-y-3 rounded-none bg-white py-3 md:rounded`}
      onSubmit={handleSubmit(createPost)}
    >
      <div className="flex items-center bg-white rounded">
        <Avatar seed={username!} />
        <input
          {...register("title", { required: true })}
          disabled={!isAuthenticated}
          type="text"
          autoComplete="off"
          placeholder={isAuthenticated ? "Create a post" : "Sign In to post"}
          className="flex-1 p-2 px-4 text-sm bg-gray-100 rounded-full outline-none focus:bg-white focus:border focus:border-gray-500 disabled:cursor-not-allowed placeholder:text-gray-400"
        />
        <div className="flex items-center mx-3 space-x-3">
          <button
            type="submit"
            className="py-1 px-3 text-sm text-white rounded-full sm:py-1.5 sm:px-6 disabled:text-gray-400 disabled:bg-gray-300 disabled:cursor-not-allowed bg-reddit-col"
            disabled={!!!watch("title")}
          >
            Post
          </button>
          {!!watch("title") && (
            <button
              type="submit"
              className="p-1.5 text-base rounded-full border border-reddit-col text-reddit-col"
              onClick={() => reset()}
            >
              <MdOutlineClear className="" />
            </button>
          )}
        </div>
      </div>
      {!!watch("title") && (
        <div className="m-3 mx-4 space-y-3 bg-white">
          {/* tabs panel */}
          <div
            className="flex text-base font-normal border-2 rounded-t-md sm:text-lg"
            role="tabpanel"
          >
            <li
              className={`flex w-full cursor-pointer select-none items-center justify-center space-x-1 py-2  text-sm  sm:py-3 sm:text-base ${
                tabState.text &&
                "border-b-2 border-b-blue-500 bg-blue-200/30 font-semibold  text-blue-500"
              }`}
              onClick={() => setCurrentTab("text")}
              onKeyDown={(event) =>
                event.key === "Enter" && setCurrentTab("text")
              }
              role="tab"
              tabIndex={0}
            >
              <MdPostAdd className="text-xl" />
              <span>Post</span>
            </li>
            <li
              className={`flex w-full cursor-pointer select-none items-center justify-center space-x-1 border-x-2  py-2 text-sm  sm:py-3 sm:text-base ${
                tabState.image &&
                "border-b-2 border-b-blue-500 bg-blue-300/20 font-semibold  text-blue-500"
              }`}
              onClick={() => setCurrentTab("image")}
              onKeyDown={(event) =>
                event.key === "Enter" && setCurrentTab("image")
              }
              role="tab"
              tabIndex={0}
            >
              <HiOutlinePhotograph />
              <span>Images</span>
            </li>
            <li
              className={`flex w-full cursor-pointer select-none items-center justify-center space-x-1 py-2  text-sm sm:py-3 sm:text-base  ${
                tabState.link &&
                "border-b-2 border-b-blue-500 bg-blue-300/20 font-semibold  text-blue-500"
              }`}
              onClick={() => setCurrentTab("link")}
              onKeyDown={(event) =>
                event.key === "Enter" && setCurrentTab("link")
              }
              role="tab"
              tabIndex={0}
            >
              <HiLink />
              <span>Link</span>
            </li>
          </div>
          <div className="flex flex-col space-y-3">
            <div className="flex items-center">
              <p className="text-sm sm:text-base min-w-[80px]">Subreddit</p>
              <input
                {...register("subreddit", { required: true })}
                type="text"
                list="subreddit-list"
                placeholder="Subreddit"
                disabled={subreddit !== undefined}
                className="flex-1 p-2 px-4 text-sm bg-gray-100 rounded-full outline-none focus:bg-white focus:border focus:border-gray-500"
              />
              <datalist id="subreddit-list">
                {data?.subreddit.map((subreddit) => (
                  <option key={subreddit.id} value={subreddit.topic} />
                ))}
              </datalist>
            </div>
            {tabState.text && (
              <div className="flex items-center w-full">
                <p className="text-sm sm:text-base min-w-[80px]">Text</p>
                <input
                  {...register("text", { required: false })}
                  type="text"
                  placeholder="Text (optional)"
                  className="flex-1 p-2 px-4 text-sm bg-gray-100 rounded-full outline-none focus:bg-white focus:border focus:border-gray-500"
                />
              </div>
            )}
            {tabState.image && (
              <div className="flex items-center w-full">
                <p className="text-sm sm:text-base min-w-[80px]">Image</p>
                <div className="flex items-end justify-start flex-1 space-x-3">
                  {!!watch("image") && getValues().image.length > 0 ? (
                    <button
                      onClick={() => resetField(`image`)}
                      className="px-6 py-2 mr-5 text-sm font-medium text-blue-700 border-0 rounded-full bg-blue-50 hover:text-amber-700 hover:bg-amber-50 hover:cursor-pointer text-grey-500"
                    >
                      Clear
                    </button>
                  ) : (
                    <input
                      {...register("image", { required: false })}
                      accept="image/*"
                      type="file"
                      className="text-sm text-grey-500 file:mr-5 file:rounded-full file:border-0 file:bg-blue-50 file:py-2 file:px-6 file:text-sm file:font-medium file:text-blue-700 hover:file:cursor-pointer hover:file:bg-amber-50 hover:file:text-amber-700"
                    />
                  )}
                  {!!watch("image") && getValues().image.length > 0 && (
                    <div>
                      <div>
                        <div className="relative w-24 p-6 rounded aspect-square">
                          <Image
                            src={URL.createObjectURL(getValues().image[0])}
                            alt="selected image"
                            layout="fill"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {tabState.link && (
              <div className="flex items-center w-full">
                <p className="text-sm sm:text-base min-w-[80px]">Link</p>
                <input
                  {...register("link", { required: false })}
                  type="text"
                  placeholder="Url (optional)"
                  className="flex-1 p-2 px-4 text-sm bg-gray-100 rounded-full outline-none focus:bg-white focus:border focus:border-gray-500"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </form>
  );
}
