import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db-supabase";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  books: router({
    list: publicProcedure.query(() => db.getAllBooks()),
    getById: publicProcedure.input(z.string()).query(({ input }) => db.getBookById(input)),
    search: publicProcedure.input(z.string()).query(({ input }) => db.searchBooks(input)),
    byGenre: publicProcedure.input(z.string()).query(({ input }) => db.getBooksByGenre(input)),
  }),

  rentals: router({
    list: protectedProcedure.query(({ ctx }) => db.getUserRentals(ctx.user.id)),
    active: protectedProcedure.query(({ ctx }) => db.getActiveRentals(ctx.user.id)),
    isRented: protectedProcedure
      .input(z.string())
      .query(({ ctx, input }) => db.isBookRented(ctx.user.id, input)),
    rent: protectedProcedure
      .input(z.object({ bookId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const rentalId = Math.random().toString(36).substr(2, 9);
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14);
        await db.rentBook({
          id: rentalId,
          userId: ctx.user.id,
          bookId: input.bookId,
          dueDate,
        });
        return { id: rentalId };
      }),
    return: protectedProcedure
      .input(z.string())
      .mutation(({ input }) => db.returnBook(input)),
    extend: protectedProcedure
      .input(z.string())
      .mutation(({ input }) => db.extendRental(input)),
  }),

  reviews: router({
    byBook: publicProcedure.input(z.string()).query(({ input }) => db.getReviewsByBook(input)),
    all: publicProcedure.query(() => db.getAllReviews()),
    add: protectedProcedure
      .input(z.object({ bookId: z.string(), rating: z.number(), text: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        const profile = await db.getUserProfile(ctx.user.id);
        const nickname = profile?.nickname || "익명";
        const reviewId = Math.random().toString(36).substr(2, 9);
        await db.addReview({
          id: reviewId,
          userId: ctx.user.id,
          bookId: input.bookId,
          rating: input.rating,
          text: input.text,
          nickname,
        });
        return { id: reviewId };
      }),
  }),

  recommendations: router({
    list: publicProcedure.query(() => db.getRecommendations()),
    add: protectedProcedure
      .input(z.object({ bookId: z.string(), reason: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const profile = await db.getUserProfile(ctx.user.id);
        const nickname = profile?.nickname || "익명";
        const recId = Math.random().toString(36).substr(2, 9);
        await db.addRecommendation({
          id: recId,
          userId: ctx.user.id,
          bookId: input.bookId,
          reason: input.reason,
          nickname,
        });
        return { id: recId };
      }),
    toggleLike: protectedProcedure
      .input(z.string())
      .mutation(({ input }) => db.toggleRecommendationLike(input)),
  }),

  wishlist: router({
    list: protectedProcedure.query(({ ctx }) => db.getWishlist(ctx.user.id)),
    isWishlisted: protectedProcedure
      .input(z.string())
      .query(({ ctx, input }) => db.isWishlisted(ctx.user.id, input)),
    toggle: protectedProcedure
      .input(z.string())
      .mutation(({ ctx, input }) => 
        db.toggleWishlist({ 
          userId: ctx.user.id, 
          bookId: input, 
          id: Math.random().toString(36).substr(2, 9) 
        })
      ),
  }),

  profile: router({
    get: protectedProcedure.query(({ ctx }) => db.getUserProfile(ctx.user.id)),
    update: protectedProcedure
      .input(z.object({ nickname: z.string() }))
      .mutation(({ ctx, input }) => db.updateUserProfile(ctx.user.id, input)),
  }),
});

export type AppRouter = typeof appRouter;
