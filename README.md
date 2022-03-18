# Apollo API Gateway POC

**Installation:**

```sh
npm i && npm run server
```

**ToDo:**

- figure out how to implement with new appraoch and `supergraphSdl` - currently not working with express.

```
import { ApolloServer } from "apollo-server";
import { ApolloGateway, IntrospectAndCompose } from "@apollo/gateway";
import chalk from "chalk";

const port = 4000;

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
  console.log(chalk.magenta(`🚀 API Gateway ready at ${url}`));
});
```
