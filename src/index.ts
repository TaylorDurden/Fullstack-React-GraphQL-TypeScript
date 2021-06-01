import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import mikroOrmConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer, gql } from "apollo-server-express";
import { Post } from "./entities/Post";

const main = async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  // const post = orm.em.create(Post, {title: 'my first post'});
  
  await orm.getMigrator().up();
  orm.em.persistAndFlush(post);
  const app = express();
  const typeDefs = gql`
    type Query {
      hello: String
    }
  `;
  const resolvers = {
    Query: {
      hello: () => "Hello world  and bye!",
    },
  };
  // const resolvers = [
  //   typeof HelloResolver
  // ];
  const apolloServer = new ApolloServer({ typeDefs, resolvers: resolvers, });
  apolloServer.applyMiddleware({app});
  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });
};

main().catch((err) => {
  console.log(err);
});
