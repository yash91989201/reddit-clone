import type { AppProps } from 'next/app'
import { NhostNextProvider, NhostClient } from '@nhost/nextjs';
import { NhostApolloProvider } from '@nhost/react-apollo'
import { NhostSession } from '@nhost/core';
import '../styles/globals.css'
// custom components
import Layout from '../components/shared/Layout';

const nhost = new NhostClient({
  subdomain: process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN || '',
  region: process.env.NEXT_PUBLIC_NHOST_REGION || ''
});

interface MyAppTypes {
  nhostSession: NhostSession
}

export default function MyApp({ Component, pageProps }: AppProps<MyAppTypes>) {
  return <NhostNextProvider nhost={nhost} initial={pageProps.nhostSession} >
    <NhostApolloProvider nhost={nhost}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </NhostApolloProvider>
  </NhostNextProvider>
}


