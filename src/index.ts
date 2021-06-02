import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import mikroOrmConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer, } from "apollo-server-express";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { buildTypeDefsAndResolvers } from "type-graphql";
import { makeExecutableSchema } from "graphql-tools";
import { Post } from './entities/Post';

const main = async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();

  const app = express();
  // const resolvers = [HelloResolver, PostResolver]  as const;
  const { typeDefs, resolvers } = await buildTypeDefsAndResolvers({
    resolvers: [HelloResolver],
  });
  
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  
  const apolloServer = new ApolloServer({
    schema,
    context: () => ({ em: orm.em })
  });
  apolloServer.applyMiddleware({ app });
  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });
};

main().catch((err) => {
  console.log(err);
});