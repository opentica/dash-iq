import { GraphQLServer } from 'graphql-yoga'
import typeDefs from './typeDefs'
import resolvers from './resolvers'

const serverOptions = { port: process.env.APPD_PORT || 4000 }
const server = new GraphQLServer({ typeDefs, resolvers })
server.start(serverOptions, () =>
  console.log('Server is running on localhost:' + serverOptions.port)
)
