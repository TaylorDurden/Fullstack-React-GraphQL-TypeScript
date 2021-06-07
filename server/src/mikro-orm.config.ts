import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import path from 'path';
import { User } from "./entities/User";


export default {
  migrations: {
    path: path.join(__dirname, './migrations'),
    pattern: /^[\w-]+\d+\.[tj]s$/, // how to match migration files, ts or js
  },
  dbName: "lireddit",
  debug: !__prod__,
  type: "postgresql",
  entities: [Post, User],
  password: "postgres",
} as Parameters<typeof MikroORM.init>[0];