import { Post } from "../entities/Post";
import { MyContext } from "../types";
import { Arg, Ctx, Int, Query, Resolver } from "type-graphql";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() ctx: MyContext): Promise<Post[]> {
    const { em } = ctx;
    return em.find(Post, {});
  }

  @Query(() => Post, { nullable: true })
  post(
    @Arg("identifier", () => Int) id: number,
    @Ctx() ctx: MyContext
  ): Promise<Post | null> {
    const { em } = ctx;
    return em.findOne(Post, {id});
  }
}
