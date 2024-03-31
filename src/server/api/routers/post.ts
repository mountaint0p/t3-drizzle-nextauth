import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { posts, users } from "~/server/db/schema";
import { eq, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1).max(255),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(posts).values({
        authorId: ctx.session.user.id,
        createdAt: new Date(),
        content: input.content,
      });
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.posts.findMany();
  }),

  getAllWithAuthor: publicProcedure.query(({ ctx }) => {
    return ctx.db
      .select()
      .from(posts)
      .innerJoin(users, eq(users.id, posts.authorId))
      .orderBy(desc(posts.createdAt));
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  getByAuthorId: publicProcedure
    .input(z.object({ authorId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db
        .select()
        .from(posts)
        .innerJoin(users, eq(users.id, posts.authorId))
        .where(eq(users.id, input.authorId))
        .orderBy(desc(posts.createdAt));
    }),

  getByPostId: publicProcedure
    .input(z.object({ postId: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db
        .select()
        .from(posts)
        .innerJoin(users, eq(users.id, posts.authorId))
        .where(eq(posts.id, input.postId))
        .orderBy(desc(posts.createdAt))
        .limit(1);
    }),
});
