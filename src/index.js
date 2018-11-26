
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');
const Query = require('./resolvers/query');
const {GraphQLServer} = require('graphql-yoga');
const jwt = require('jsonwebtoken');

const typeDefs = './src/schema.graphql';

const resolvers = {
  Query
  // Mutation
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
  // context: incomingData => ({
  //   incomingData,
  //   isAuthorized: () => {
  //     const authHeader = incomingData.request.header('Authorization');
  //     if(!authHeader) {
  //       throw('Unauthorized');
  //     }
  //     const token = authHeader.replace('Bearer ', '');
  //     const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  //     return decodedToken;
  //   }
  // })
});

// TODO: read about using cors through graphql-yoga's options
server.express.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);


server.express.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

if(require.main === module) {
  dbConnect();
  // TODO: port config
  server.start(() => console.log('Server started'));
}