import { ApolloClient, InMemoryCache } from "@apollo/client";

import { requestHeaders, SUBDOMAIN } from "config";

const apollo_client = new ApolloClient({
  uri: `https://${SUBDOMAIN}.nhost.run/v1/graphql`,
  headers: requestHeaders,
  cache: new InMemoryCache(),
});

export default apollo_client;
