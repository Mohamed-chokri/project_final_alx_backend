const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const mongoose = require('mongoose');
const typeDefs = require('./graphql/typdefs'); // Path to your typeDefs
const { resolvers }  = require('./graphql/resolver'); // Path to your resolvers
const { createLoaders } = require('./loaders/dataloaders');  // Adjust the path accordingly

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
