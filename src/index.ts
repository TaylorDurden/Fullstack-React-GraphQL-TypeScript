import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import mikroOrmConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer, gql, IResolvers } from "apollo-server-express";
import { buildSchema } from "graphql";
import { HelloResolver } from "./resolvers/hello";

const main = async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();

  const app = express();
  const typeDefs = gql`
    type Query {
      hello: String
    }
  `;
  // const resolvers = {
  //   Query: {
  //     hello: () => "Hello world  and bye!",
  //   },
  // };
  const resolvers = [
    typeof HelloResolver
  ];
  const apolloServer = new ApolloServer({ typeDefs, resolvers: [HelloResolver] });
  apolloServer.applyMiddleware({app});
  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });
};

main().catch((err) => {
  console.log(err);
});
