import { useRouter } from "next/router";
// CUSTOM COMPONENTS
import PostBox from "components/home/PostBox";
import Feed from "components/home/Feed";
import Avatar from "components/shared/Avatar";

export default function Subreddit(): JSX.Element {
  const { topic } = useRouter().query;

  return (
    <div className="-mt-12">
      <div className="flex flex-col-reverse h-64 my-12 bg-reddit-col">
        <div className="bg-white">
          <div className="flex items-center max-w-5xl py-6 mx-auto space-x-4">
            {/* avatar image */}
            <Avatar seed={topic as string} />
            {/* subreddit title */}
            <div>
              <h1 className="text-3xl font-semibold">
                Welcome to the r/{topic} subreddit
              </h1>
              <p className="text-sm text-gray-400">r/{topic}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto">
        <PostBox subreddit={topic as string} styling={{ top: "top-16" }} />
        <Feed
          subreddit={topic as string}
          styling={{ marginTop: "mt-12", marginBottom: "mb-16" }}
        />
      </div>
    </div>
  );
}
