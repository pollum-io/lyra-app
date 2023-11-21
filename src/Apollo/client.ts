import { ApolloClient, InMemoryCache } from "@apollo/client"
import { typeDefs } from "./queries/typedefs"

export const apolloClient = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
  cache: new InMemoryCache(),
  typeDefs,
})
