const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const fetch = require("node-fetch");
const { baseUrl } = require("../../constants");

const port = 4001;

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
  console.log(`🚀 Products service running at ${url}`);
});
