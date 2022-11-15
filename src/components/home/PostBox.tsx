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
import apollo_client from "apollo-client";
import toast from "react-hot-toast";
// graphql schemas
import {
  GET_POSTS,
  GET_SUBREDDITS,
  GET_SUBREDDIT_BY_TOPIC,
} from "graphql/queries";
import { INSERT_POST, INSERT_SUBREDDIT } from "graphql/mutations";
// import icons
import { HiLink, HiOutlinePhotograph } from "react-icons/hi";
import { MdOutlineClear, MdPostAdd } from "react-icons/md";

// custom components
import Avatar from "../shared/Avatar";
// import types
import {
  InsertPostVarType,
  InsertSubredditResultType,
  InsertSubredditVarType,
  SelectPostResultType,
  SelectSubredditResultType,
  SubredditType,
} from "types";
import { UniqueFieldDefinitionNamesRule } from "graphql";

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

async function getSubredditByTopic(topic: string): Promise<SubredditType[]> {
  const queryResult = await apollo_client.query<
    SelectSubredditResultType,
    { topic: string }
  >({
    query: GET_SUBREDDIT_BY_TOPIC,
    variables: {
      topic: topic,
    },
  });

  return queryResult.data.subreddit;
}

async function insertSubreddit({
  topic,
}: {
  topic: string;
}): Promise<SubredditType> {
  const queryResult = await apollo_client.mutate<
    InsertSubredditResultType,
    InsertSubredditVarType
  >({
    mutation: INSERT_SUBREDDIT,
    variables: {
      topic: topic,
    },
  });

  return queryResult.data?.insert_subreddit_one!;
}

async function subredditData({
  gSBT,
  topic,
}: {
  gSBT: (topic: string) => Promise<SubredditType[]>;
  topic: string;
}): Promise<{ subreddit_exists: boolean; subreddit_id: string | undefined }> {
  const subreddit_list = await gSBT(topic);
  if (subreddit_list.length > 0)
    return { subreddit_exists: true, subreddit_id: subreddit_list[0].id };
  else return { subreddit_exists: false, subreddit_id: undefined };
}

async function getOrCreateSubreddit({
  topic,
}: {
  topic: string;
}): Promise<{ subreddit_id: string }> {
  const { subreddit_exists, subreddit_id } = await subredditData({
    gSBT: getSubredditByTopic,
    topic,
  });
  if (!subreddit_exists) {
    const new_subreddit = await insertSubreddit({ topic });
    return { subreddit_id: new_subreddit.id };
  }
  return { subreddit_id: subreddit_id! };
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
  const { upload, id: image_id } = useFileUpload();
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
      // if (formData.image != undefined) {
      //   console.log(formData.image[0]);
      //   await upload({ file: formData.image[0] });
      //   console.log(image_id);
      // }

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
      className={`sticky ${styling.top}  z-20 py-1 bg-white rounded-none md:rounded-md space-y-3`}
      onSubmit={handleSubmit(createPost)}
    >
      <div className="py-1.5 flex items-center rounded-md   bg-white">
        <Avatar seed={username!} />
        <input
          {...register("title", { required: true })}
          disabled={!isAuthenticated}
          type="text"
          autoComplete="off"
          placeholder={isAuthenticated ? "Create a post" : "Sign In to post"}
          className="flex-1 rounded p-2 outline-none bg-gray-100 text-sm placeholder:text-gray-500  disabled:cursor-not-allowed"
        />
        <div className="m-2 mx-3  flex items-center space-x-3">
          <button
            type="submit"
            className=" bg-reddit-col rounded-full py-1 px-3  sm:py-1.5 sm:px-6 text-white text-sm disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
            disabled={!!!watch("title")}
          >
            Post
          </button>
          {!!watch("title") && (
            <button
              type="submit"
              className="  border-reddit-col border rounded-full p-1.5 text-reddit-col text-base "
              onClick={() => reset()}
            >
              <MdOutlineClear className="" />
            </button>
          )}
        </div>
      </div>
      {!!watch("title") && (
        <div className="m-3">
          <div className="  bg-white ">
            {/* subreddit list */}
            {/* tabs list */}
            <ul className="flex text-base sm:text-lg font-normal rounded-t-md border-2">
              <li
                className={`py-2 sm:py-3 w-full flex justify-center items-center text-sm sm:text-base  space-x-1  cursor-pointer select-none ${
                  tabState.text &&
                  "text-blue-500 border-b-blue-500 border-b-2 bg-blue-200/30  font-semibold"
                }`}
                onClick={() => setCurrentTab("text")}
              >
                <MdPostAdd className="text-xl" />
                <span>Post</span>
              </li>
              <li
                className={`py-2 sm:py-3 w-full flex justify-center items-center text-sm sm:text-base  space-x-1 border-x-2  cursor-pointer select-none ${
                  tabState.image &&
                  "text-blue-500 border-b-blue-500 border-b-2 bg-blue-300/20  font-semibold"
                }`}
                onClick={() => setCurrentTab("image")}
              >
                <HiOutlinePhotograph />
                <span>Images</span>
              </li>
              <li
                className={`py-2 sm:py-3 w-full flex justify-center items-center text-sm sm:text-base  space-x-1 cursor-pointer select-none  ${
                  tabState.link &&
                  "text-blue-500 border-b-blue-500 border-b-2 bg-blue-300/20  font-semibold"
                }`}
                onClick={() => setCurrentTab("link")}
              >
                <HiLink />
                <span>Link</span>
              </li>
            </ul>
            <div className="mt-3 flex flex-col ">
              <div className="mb-3 flex items-center">
                <p className="min-w-[80px] text-sm sm:text-base">Subreddit</p>
                <input
                  {...register("subreddit", { required: true })}
                  type="text"
                  list="subreddit-list"
                  placeholder="Subreddit"
                  disabled={subreddit !== undefined}
                  className={` flex-1 bg-gray-100 p-2 rounded-md outline-none text-sm`}
                />
                <datalist id="subreddit-list">
                  {data?.subreddit.map((subreddit) => (
                    <option key={subreddit.id} value={subreddit.topic} />
                  ))}
                </datalist>
              </div>
              {tabState.text && (
                <div className=" w-full  flex items-center  ">
                  <p className="min-w-[80px] text-sm sm:text-base">Text</p>
                  <input
                    {...register("text", { required: false })}
                    type="text"
                    placeholder="Text (optional)"
                    className=" flex-1 bg-gray-100 p-2 rounded-md outline-none text-sm"
                  />
                </div>
              )}
              {tabState.image && (
                <div className=" w-full  flex items-center  ">
                  <p className="min-w-[80px] text-sm sm:text-base">Image</p>
                  <div className="py-3 flex-1 flex justify-start items-end space-x-3">
                    {!!watch("image") && getValues().image.length > 0 ? (
                      <button
                        onClick={() => resetField(`image`)}
                        className="text-sm text-grey-500
                                mr-5 py-2 px-6
                                rounded-full border-0
                                 font-medium
                                bg-blue-50 text-blue-700
                                hover:cursor-pointer hover:bg-amber-50
                                hover:text-amber-700"
                      >
                        Clear
                      </button>
                    ) : (
                      <input
                        {...register("image", { required: false })}
                        accept="image/*"
                        type="file"
                        className="text-sm text-grey-500
                                file:mr-5 file:py-2 file:px-6
                                file:rounded-full file:border-0
                                file:text-sm file:font-medium
                                file:bg-blue-50 file:text-blue-700
                                hover:file:cursor-pointer hover:file:bg-amber-50
                                hover:file:text-amber-700"
                      />
                    )}
                    {!!watch("image") && getValues().image.length > 0 && (
                      <div>
                        <div>
                          <div className="relative p-6 w-24 aspect-square rounded">
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
                <div className=" w-full  flex items-center  ">
                  <p className="min-w-[80px] text-sm sm:text-base">Link</p>
                  <input
                    {...register("link", { required: false })}
                    type="text"
                    placeholder="Url (optional)"
                    className="flex-1 bg-gray-100 p-2 rounded-md outline-none text-sm"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
