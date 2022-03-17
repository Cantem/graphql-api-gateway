const { ApolloServer } = require("apollo-server");
const { ApolloGateway, IntrospectAndCompose } = require("@apollo/gateway");

const port = 4000;

// previous implementation
// const gateway = new ApolloGateway({
//   serviceList: [
//     { name: "products", url: "http://localhost:4001" },
//     { name: "orders", url: "http://localhost:4002" },
//   ],
// });

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: "products", url: "http://localhost:4001" },
      { name: "orders", url: "http://localhost:4002" },
    ],
  }),
  serviceHealthCheck: true,
});

const server = new ApolloServer({
  gateway,
  subscriptions: false,
});

server.listen({ port }).then(({ url }) => {
  console.log(`🚀 API Gateway ready at ${url}`);
});
