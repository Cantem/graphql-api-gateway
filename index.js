import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { ApolloGateway, IntrospectAndCompose } from "@apollo/gateway";
import express from "express";
import http from "http";
import chalk from "chalk";

async function startApolloServer() {
  const app = express();
  const httpServer = http.createServer(app);

  const gateway = new ApolloGateway({
    serviceList: [
      { name: "products", url: "http://localhost:4001" },
      { name: "orders", url: "http://localhost:4002" },
    ],
  });

  const server = new ApolloServer({
    gateway,
    subscriptions: false,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();
  server.applyMiddleware({ app });
  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer();
