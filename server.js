import mongoose from 'mongoose';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { createServer } from 'http';
import { execute, subscribe } from "graphql";
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import typeDefs from './graphql/typdefs.js';
import resolvers from './graphql/resolver.js';
import createLoaders from './loaders/dataloaders.js';
import chatSocket from "./socket/chatSocket.js";



const startServer = async () => {
  const app = express();
  const httpServer = createServer(app);
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // Create an instance of ApolloServer
  const server = new ApolloServer({
    schema,
    context: () => ({
      loaders: createLoaders(),
    })
  });

  await server.start();

  server.applyMiddleware({ app });

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: server.graphqlPath,
  });
  useServer({ schema, execute, subscribe }, wsServer);
  const io = chatSocket(httpServer)

  mongoose.connect('mongodb://localhost:27017/School', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
      .then(() => console.log('MongoDB connected'))
      .catch(err => console.error('MongoDB connection error:', err));

  const PORT = process.env.PORT || 4000;
  httpServer.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`Subscriptions ready at ws://localhost:${PORT}${server.graphqlPath}`);
  });
};

// Start the server
startServer();
console.log(typeDefs);
console.log(resolvers);


