const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const fetch = require("node-fetch");

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
    orders: [Order]
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
  console.log(`Products service running at ${url}`);
});
