import { User } from "../entities/User";
import { MyContext } from "../types.d";
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import argon2 from "argon2";
import { EntityManager } from "@mikro-orm/postgresql";
import { COOKIE_NAME } from "../constants";
import { UsernamePasswordInput } from "./UsernamePasswordInput";
import { BlockList } from "net";

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg('email') email: string,
    @Ctx() {em}:MyContext 
  ){
    // const user = await em.findOne(User, {email});
    return true;
  }

  @Query(() => User, { nullable: true })
  async me(
    @Ctx() { em, req }: MyContext,
  ): Promise<User | null> {

    console.log(`resolver:users.ts-me, rowNumber: 50, req.session.userId: ", ${req.session.userId}`);
    console.log(`resolver:users.ts-me, rowNumber: 51, req.session: ", ${req.session}`);
    if(!req.session.userId) {
      return null
    }

    const user = await em.findOne(User, { id: req.session.userId });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    if (options.username.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "username too short, 2 at least",
          },
        ],
      };
    }
    if (options.password.length <= 3) {
      return {
        errors: [
          {
            field: "password",
            message: "password too short, 3 at least",
          },
        ],
      };
    }
    const hashedPassword = await argon2.hash(options.password);
    let user;
    try {
      const result = await (em as EntityManager).createQueryBuilder(User).getKnexQuery().insert(
        {
          username: options.username,
          password: hashedPassword,
          created_at: new Date(),
          updated_at: new Date(),
        }
      ).returning('*');
      user = result[0];
      // await em.persistAndFlush(user);
    } catch (err) {
      console.log('register err: ', err);
      if (err.code === '23505') {
        return {
          errors: [
            {
              field: "username",
              message: `Username ${options.username} has already existed!`,
            },
          ],
        };
      }
      console.log("message: ", err.message);
    }

    req.session.userId = user.id;
    return {
      user,
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username });
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "that username doesn't exist",
          },
        ],
      };
    }
    const isPasswordValid = await argon2.verify(
      user.password,
      options.password
    );
    if (!isPasswordValid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }

    console.log(`resolver:users.ts-login, rowNumber: 150, user.id: ", ${user.id}`);
    console.log(`resolver:users.ts-login, rowNumber: 151, req.session: ", ${req.session}`);
    req.session.userId = user.id;
    // req.session.randomKey = user.id;
    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  logout(
    @Ctx() {req, res}: MyContext
  ){
    return new Promise((resolve) => {
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if(err) {
          console.log(err);
          resolve(false);
          return;
        }
        resolve(true);
      });
    });
  }
}
