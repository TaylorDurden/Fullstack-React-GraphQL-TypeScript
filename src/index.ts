import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import mikroOrmConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { buildTypeDefsAndResolvers } from "type-graphql";
import { makeExecutableSchema } from "graphql-tools";
import { UserResolver } from "./resolvers/users";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { MyContext } from "./types";

const main = async () => {
  const orm = await MikroORM.init(mikroOrmConfig);

  await orm.getMigrator().up();
  // const post = orm.em.create(Post, {title: 'my first post'});
  // orm.em.persistAndFlush(post);
  const app = express();
  const { typeDefs, resolvers } = await buildTypeDefsAndResolvers({
    resolvers: [HelloResolver, PostResolver, UserResolver],
  });

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  app.use(
    session({
      name: "qid",
      store: new RedisStore({ 
        client: redisClient, 
        disableTouch: true 
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        secure: __prod__, // cookie only works in https
        sameSite: 'lax', // csrf
      },
      saveUninitialized: false,
      secret: "sad12312sadwe1231sad12312sadasdaa12ascvbfxdgh234",
      resave: false,
    })
  );

  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const apolloServer = new ApolloServer({
    schema,
    context: ({req, res}): MyContext => ({ em: orm.em, req, res }),
  });
  apolloServer.applyMiddleware({ app });
  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });
};

main().catch((err) => {
  console.log(err);
});
