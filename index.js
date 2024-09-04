const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const mongoose = require('mongoose');
const typeDefs = require('./graphql/typdefs'); // Path to your typeDefs
const resolvers = require('./graphql/resolver'); // Path to your resolvers

const startServer = async () => {
  const app = express();

  // Create an instance of ApolloServer
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // Start the Apollo server
  await server.start();

  // Apply middleware to connect Apollo Server with Express
  server.applyMiddleware({ app });

  // Connect to MongoDB
  mongoose.connect('mongodb://localhost:27017/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

  // Start the Express server
  app.listen({ port: 4000 }, () =>
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
  );
};

// Start the server
startServer();
console.log(typeDefs);
console.log(resolvers);