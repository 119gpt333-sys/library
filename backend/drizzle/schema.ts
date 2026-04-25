import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// 도서 테이블
export const books = mysqlTable("books", {
  id: varchar("id", { length: 64 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  author: varchar("author", { length: 255 }).notNull(),
  publisher: varchar("publisher", { length: 255 }).notNull(),
  publishedYear: int("publishedYear").notNull(),
  genre: varchar("genre", { length: 64 }).notNull(),
  description: text("description").notNull(),
  rating: int("rating").default(0).notNull(), // 0-5 * 10 (e.g., 45 = 4.5)
  reviewCount: int("reviewCount").default(0).notNull(),
  totalCopies: int("totalCopies").default(1).notNull(),
  availableCopies: int("availableCopies").default(1).notNull(),
  isNew: int("isNew").default(0).notNull(), // boolean as int
  isAvailable: int("isAvailable").default(1).notNull(), // boolean as int
  coverColor: varchar("coverColor", { length: 7 }).notNull(),
  coverEmoji: varchar("coverEmoji", { length: 10 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// 대여 기록 테이블
export const rentals = mysqlTable("rentals", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: int("userId").notNull(),
  bookId: varchar("bookId", { length: 64 }).notNull(),
  rentalDate: timestamp("rentalDate").defaultNow().notNull(),
  dueDate: timestamp("dueDate").notNull(),
  returnedAt: timestamp("returnedAt"),
  extensionCount: int("extensionCount").default(0).notNull(),
  status: mysqlEnum("status", ["active", "returned", "overdue"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// 리뷰 테이블
export const reviews = mysqlTable("reviews", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: int("userId").notNull(),
  bookId: varchar("bookId", { length: 64 }).notNull(),
  rating: int("rating").notNull(), // 1-5
  text: text("text"),
  nickname: varchar("nickname", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// 추천 테이블
export const recommendations = mysqlTable("recommendations", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: int("userId").notNull(),
  bookId: varchar("bookId", { length: 64 }).notNull(),
  reason: text("reason").notNull(),
  nickname: varchar("nickname", { length: 64 }).notNull(),
  likes: int("likes").default(0).notNull(),
  liked: int("liked").default(0).notNull(), // boolean as int
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// 찜 목록 테이블
export const wishlist = mysqlTable("wishlist", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: int("userId").notNull(),
  bookId: varchar("bookId", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// 사용자 프로필 테이블
export const userProfiles = mysqlTable("userProfiles", {
  userId: int("userId").primaryKey(),
  nickname: varchar("nickname", { length: 64 }).notNull(),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Book = typeof books.$inferSelect;
export type InsertBook = typeof books.$inferInsert;
export type Rental = typeof rentals.$inferSelect;
export type InsertRental = typeof rentals.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;
export type Recommendation = typeof recommendations.$inferSelect;
export type InsertRecommendation = typeof recommendations.$inferInsert;
export type Wishlist = typeof wishlist.$inferSelect;
export type InsertWishlist = typeof wishlist.$inferInsert;
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = typeof userProfiles.$inferInsert;
