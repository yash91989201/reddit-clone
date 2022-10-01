import type { AppProps } from 'next/app'
import { NhostNextProvider, NhostClient } from '@nhost/nextjs';
import { NhostApolloProvider, } from '@nhost/react-apollo'
import { NhostSession } from '@nhost/core';
import '../styles/globals.css'
// custom components
import Layout from '../components/shared/Layout';
// config constants
import { NHOSTREGION, SUBDOMAIN, XHasuraAdminSecret, XHasuraRole } from "config"

const nhost = new NhostClient({
  subdomain: process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN || '',
  region: process.env.NEXT_PUBLIC_NHOST_REGION || '',
});

interface MyAppTypes {
  nhostSession: NhostSession
}

export default function MyApp({ Component, pageProps }: AppProps<MyAppTypes>) {
  return <NhostNextProvider nhost={nhost} initial={pageProps.nhostSession} >
    <NhostApolloProvider nhost={nhost}
      graphqlUrl={`https://${SUBDOMAIN}.nhost.run/v1/graphql`}
      headers={{
        "Access-Control-Allow-Origin": `https://${SUBDOMAIN}.auth.${NHOSTREGION}.nhost.run/v1`,
        "content-type": "application/json",
        "x-hasura-admin-secret": XHasuraAdminSecret!,
        "x-hasura-role": XHasuraRole!,
      }}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </NhostApolloProvider>
  </NhostNextProvider>
}


