import type { NextPage } from 'next'
import Head from 'next/head'
// custom components
import PostBox from 'components/Home/PostBox'
import Feed from "components/Home/Feed"

const Home: NextPage = () => {
  return (
    <div className="min-h-screen">
      <Head>
        <title>Reddit 2.0</title>
        <meta name="description" content="A NextJs Reddit clone made using nhost " />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PostBox />
      <div className="max-w-4xl mx-auto my-16 flex justify-between items-start">
        <Feed />
      </div>
    </div>
  )
}

export default Home
