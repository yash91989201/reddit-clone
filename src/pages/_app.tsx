import type { AppProps } from "next/app";
import { NhostNextProvider, NhostClient } from "@nhost/nextjs";
import { NhostApolloProvider } from "@nhost/react-apollo";
import { NhostSession } from "@nhost/core";
import "styles/globals.css";
// custom components
import Layout from "components/shared/Layout";
import { useRouter } from "next/router";
// config constants
import { requestHeaders, NHOST_SUBDOMAIN, NHOST_REGION } from "config";

const nhost = new NhostClient({
  subdomain: NHOST_SUBDOMAIN,
  region: NHOST_REGION,
});

interface Props {
  nhostSession: NhostSession;
}

export default function MyApp({ Component, pageProps }: AppProps<Props>) {
  const router = useRouter();

  if (router.route === "/sign-in" || router.route === "/sign-up")
    return (
      <NhostNextProvider nhost={nhost} initial={pageProps.nhostSession}>
        <NhostApolloProvider
          nhost={nhost}
          graphqlUrl={`https://${NHOST_SUBDOMAIN}.nhost.run/v1/graphql`}
          headers={requestHeaders}
        >
          <Component {...pageProps} />
        </NhostApolloProvider>
      </NhostNextProvider>
    );

  return (
    <NhostNextProvider nhost={nhost} initial={pageProps.nhostSession}>
      <NhostApolloProvider
        nhost={nhost}
        graphqlUrl={`https://${NHOST_SUBDOMAIN}.nhost.run/v1/graphql`}
        headers={requestHeaders}
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </NhostApolloProvider>
    </NhostNextProvider>
  );
}
