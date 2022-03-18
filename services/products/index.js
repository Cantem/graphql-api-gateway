import { ApolloServer, gql } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";
import fetch from "node-fetch";
import chalk from "chalk";

const port = 4001;
const baseUrl = "http://localhost:3000";

const typeDefs = gql`
  type Product @key(fields: "id") {
    id: ID!
    name: String
    price: String
  }

  extend type Query {
    product(id: ID!): Product
    products: [Product!]!
  }
`;

const resolvers = {
  Product: {
    __resolveReference(ref) {
      return fetch(`${baseUrl}/products/${ref.id}`).then((res) => res.json());
    },
  },
  Query: {
    product(_, { id }) {
      return fetch(`${baseUrl}/products/${id}`).then((res) => res.json());
    },
    products() {
      return fetch(`${baseUrl}/products`).then((res) => res.json());
    },
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
});

server.listen({ port }).then(({ url }) => {
  console.log(chalk.yellow(`🚀 Products service running at ${url}`));
});
