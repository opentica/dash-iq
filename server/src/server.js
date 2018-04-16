/*
 * Copyright 2018. AppDynamics LLC and its affiliates.
 * All Rights Reserved.
 * This is unpublished proprietary source code of AppDynamics LLC and its affiliates.
 * The copyright notice above does not evidence any actual or intended publication of such source code.
 */

import { GraphQLServer } from 'graphql-yoga'
import typeDefs from './typeDefs'
import resolvers from './resolvers'

const serverOptions = { port: process.env.APPD_PORT || 4000 }
const server = new GraphQLServer({ typeDefs, resolvers })
server.start(serverOptions, () =>
  console.log('Server is running on localhost:' + serverOptions.port)
)
