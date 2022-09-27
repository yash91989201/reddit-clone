import type { AppProps } from 'next/app'
import { NhostNextProvider, NhostClient } from '@nhost/nextjs';
import { NhostApolloProvider } from '@nhost/react-apollo'
import '../styles/globals.css'
import { NhostSession } from '@nhost/core';
import { NhostReactProviderProps } from '@nhost/react';

const nhost = new NhostClient({
  subdomain: process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN || '',
  region: process.env.NEXT_PUBLIC_NHOST_REGION || ''
});



export default function MyApp({ Component, pageProps }: AppProps) {
  return <NhostNextProvider nhost={nhost} >
    <NhostApolloProvider nhost={nhost}>
      <Component {...pageProps} />
    </NhostApolloProvider>
  </NhostNextProvider>
}


