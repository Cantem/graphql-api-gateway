import { ApolloServer, gql } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";
import fetch from "node-fetch";
import chalk from "chalk";

const port = 4002;
const baseUrl = "http://localhost:3000";

const typeDefs = gql`
  type Order {
    id: ID!
    productList: [Product]
    status: String
    createdAt: String
  }

  extend type Product @key(fields: "id") {
    id: ID! @external
    orders: [Order]
  }

  extend type Query {
    order(id: ID!): Order
    orders: [Order!]!
  }
`;

const resolvers = {
  Product: {
    async orders(product) {
      const res = await fetch(`${baseUrl}/orders`);
      const orders = await res.json();

      return orders.filter(({ productList }) =>
        productList.includes(parseInt(product.id))
      );
    },
  },
  Order: {
    productList(order) {
      return order.productList.map((id) => ({ __typename: "Order", id }));
    },
  },
  Query: {
    order(_, { id }) {
      return fetch(`${baseUrl}/orders/${id}`).then((res) => res.json());
    },
    orders() {
      return fetch(`${baseUrl}/orders`).then((res) => res.json());
    },
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
});

server.listen({ port }).then(({ url }) => {
  console.log(chalk.blue(`🚀 Orders service running at ${url}`));
});
