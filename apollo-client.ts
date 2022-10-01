import { ApolloClient, InMemoryCache } from "@apollo/client";

import {
  NHOSTREGION,
  SUBDOMAIN,
  XHasuraAdminSecret,
  XHasuraRole,
} from "config";

const apolloClient = new ApolloClient({
  uri: `https://${SUBDOMAIN}.nhost.run/v1/graphql`,
  headers: {
    "Access-Control-Allow-Origin": `https://${SUBDOMAIN}.auth.${NHOSTREGION}.nhost.run/v1`,
    "content-type": "application/json",
    "x-hasura-admin-secret": XHasuraAdminSecret!,
    "x-hasura-role": XHasuraRole!,
  },
  cache: new InMemoryCache(),
});

export default apolloClient;
