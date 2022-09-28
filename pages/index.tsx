import type { NextPage } from 'next'
import Head from 'next/head'
// custom components
import PostBox from 'components/Home/PostBox'

const Home: NextPage = () => {
  return (
    <div className=" bg-gray-200">
      <Head>
        <title>Reddit 2.0</title>
        <meta name="description" content="A NextJs Reddit clone made using nhost " />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen  ">
        <PostBox />
      </main>
    </div>
  )
}

export default Home
