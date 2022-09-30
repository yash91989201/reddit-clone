import { ApolloClient, InMemoryCache } from "@apollo/client";

const SUBDOMAIN = process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN;
const XHasuraAdminSecret = process.env.NEXT_PUBLIC_X_HASURA_ADMIN_SCERET;
const XHasuraRole = process.env.NEXT_PUBLIC_X_HASURA_ROLE;

const apolloClient = new ApolloClient({
  uri: `https://${SUBDOMAIN}.nhost.run/v1/graphql`,
  headers: {
    "content-type": "application/json",
    "x-hasura-admin-secret": XHasuraAdminSecret!,
    "x-hasura-role": XHasuraRole!,
  },
  cache: new InMemoryCache(),
});

export default apolloClient;
