import Head from 'next/head'
// custom components
import PostBox from 'components/home/PostBox'
import Feed from "components/home/Feed"

export default function Home(): JSX.Element {

  return <div className="min-h-screen">
    <Head>
      <title>Reddit 2.0</title>
      <meta name="description" content="A NextJs Reddit clone made using nhost " />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <div className="max-w-5xl mx-auto">
      <PostBox styling={{ top: "top-16" }} />
      <Feed styling={{ marginTop: "mt-12", marginBottom: "mb-12" }} />
    </div>
  </div>

}
