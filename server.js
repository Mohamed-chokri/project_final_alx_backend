import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import mongoose from 'mongoose';
import typeDefs from './graphql/typdefs.js';
import resolvers from './graphql/resolver.js';
import createLoaders from './loaders/dataloaders.js'

const startServer = async () => {
  const app = express();

  // Create an instance of ApolloServer
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({
      loaders: createLoaders(),
    })
  });

  // Start the Apollo server
  await server.start();

  // Apply middleware to connect Apollo Server with Express
  server.applyMiddleware({ app });

  // Connect to MongoDB
  mongoose.connect('mongodb://localhost:27017/School', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
      .then(() => console.log('MongoDB connected'))
      .catch(err => console.error('MongoDB connection error:', err));

  const PORT = process.env.PORT || 4000;
  app.listen({ port: PORT }, () =>
      console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`)
  );
};

// Start the server
startServer();
console.log(typeDefs);
console.log(resolvers);
