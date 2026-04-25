import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ==================== BOOKS ====================

export async function getAllBooks() {
  const db = await getDb();
  if (!db) return [];
  const { books } = await import("../drizzle/schema");
  const { desc } = await import("drizzle-orm");
  return db.select().from(books).orderBy(desc(books.createdAt));
}

export async function getBookById(id: string) {
  const db = await getDb();
  if (!db) return null;
  const { books } = await import("../drizzle/schema");
  const result = await db.select().from(books).where(eq(books.id, id));
  return result[0] || null;
}

export async function searchBooks(query: string) {
  const db = await getDb();
  if (!db) return [];
  const { books } = await import("../drizzle/schema");
  const { like, desc } = await import("drizzle-orm");
  return db
    .select()
    .from(books)
    .where(query ? like(books.title, `%${query}%`) : undefined)
    .orderBy(desc(books.rating));
}

export async function getBooksByGenre(genre: string) {
  const db = await getDb();
  if (!db) return [];
  const { books } = await import("../drizzle/schema");
  return db.select().from(books).where(eq(books.genre, genre));
}

export async function createBook(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { books } = await import("../drizzle/schema");
  await db.insert(books).values(data);
  return data.id;
}

export async function updateBook(id: string, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { books } = await import("../drizzle/schema");
  await db.update(books).set(data).where(eq(books.id, id));
}

// ==================== RENTALS ====================

export async function getUserRentals(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const { rentals } = await import("../drizzle/schema");
  const { desc } = await import("drizzle-orm");
  return db
    .select()
    .from(rentals)
    .where(eq(rentals.userId, userId))
    .orderBy(desc(rentals.rentalDate));
}

export async function getActiveRentals(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const { rentals } = await import("../drizzle/schema");
  const { and, desc } = await import("drizzle-orm");
  return db
    .select()
    .from(rentals)
    .where(and(eq(rentals.userId, userId), eq(rentals.status, "active")))
    .orderBy(desc(rentals.rentalDate));
}

export async function isBookRented(userId: number, bookId: string) {
  const db = await getDb();
  if (!db) return false;
  const { rentals } = await import("../drizzle/schema");
  const { and } = await import("drizzle-orm");
  const result = await db
    .select()
    .from(rentals)
    .where(
      and(
        eq(rentals.userId, userId),
        eq(rentals.bookId, bookId),
        eq(rentals.status, "active")
      )
    );
  return result.length > 0;
}

export async function rentBook(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { rentals } = await import("../drizzle/schema");
  
  const book = await getBookById(data.bookId);
  if (book && book.availableCopies > 0) {
    await updateBook(data.bookId, {
      availableCopies: book.availableCopies - 1,
      isAvailable: book.availableCopies - 1 > 0 ? 1 : 0,
    });
  }
  
  await db.insert(rentals).values(data);
}

export async function returnBook(rentalId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { rentals } = await import("../drizzle/schema");
  
  const rental = await db
    .select()
    .from(rentals)
    .where(eq(rentals.id, rentalId));
  
  if (rental.length === 0) throw new Error("Rental not found");
  
  const book = await getBookById(rental[0].bookId);
  if (book) {
    await updateBook(rental[0].bookId, {
      availableCopies: book.availableCopies + 1,
      isAvailable: 1,
    });
  }
  
  await db
    .update(rentals)
    .set({
      status: "returned",
      returnedAt: new Date(),
    })
    .where(eq(rentals.id, rentalId));
}

export async function extendRental(rentalId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { rentals } = await import("../drizzle/schema");
  
  const rental = await db
    .select()
    .from(rentals)
    .where(eq(rentals.id, rentalId));
  
  if (rental.length === 0) throw new Error("Rental not found");
  if (rental[0].extensionCount >= 2) throw new Error("Max extensions reached");
  
  const newDueDate = new Date(rental[0].dueDate);
  newDueDate.setDate(newDueDate.getDate() + 7);
  
  await db
    .update(rentals)
    .set({
      dueDate: newDueDate,
      extensionCount: rental[0].extensionCount + 1,
    })
    .where(eq(rentals.id, rentalId));
}

// ==================== REVIEWS ====================

export async function getReviewsByBook(bookId: string) {
  const db = await getDb();
  if (!db) return [];
  const { reviews } = await import("../drizzle/schema");
  const { desc } = await import("drizzle-orm");
  return db
    .select()
    .from(reviews)
    .where(eq(reviews.bookId, bookId))
    .orderBy(desc(reviews.createdAt));
}

export async function getAllReviews() {
  const db = await getDb();
  if (!db) return [];
  const { reviews } = await import("../drizzle/schema");
  const { desc } = await import("drizzle-orm");
  return db.select().from(reviews).orderBy(desc(reviews.createdAt));
}

export async function addReview(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { reviews } = await import("../drizzle/schema");
  
  await db.insert(reviews).values(data);
  
  const bookReviews = await getReviewsByBook(data.bookId);
  const avgRating = Math.round(
    (bookReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / bookReviews.length) * 10
  );
  
  await updateBook(data.bookId, {
    rating: avgRating,
    reviewCount: bookReviews.length,
  });
}

// ==================== RECOMMENDATIONS ====================

export async function getRecommendations() {
  const db = await getDb();
  if (!db) return [];
  const { recommendations } = await import("../drizzle/schema");
  const { desc } = await import("drizzle-orm");
  return db.select().from(recommendations).orderBy(desc(recommendations.createdAt));
}

export async function addRecommendation(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { recommendations } = await import("../drizzle/schema");
  await db.insert(recommendations).values(data);
}

export async function toggleRecommendationLike(recId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { recommendations } = await import("../drizzle/schema");
  const { and } = await import("drizzle-orm");
  
  const rec = await db
    .select()
    .from(recommendations)
    .where(eq(recommendations.id, recId));
  
  if (rec.length === 0) throw new Error("Recommendation not found");
  
  const newLiked = rec[0].liked ? 0 : 1;
  const newLikes = rec[0].likes + (newLiked ? 1 : -1);
  
  await db
    .update(recommendations)
    .set({
      liked: newLiked,
      likes: newLikes,
    })
    .where(eq(recommendations.id, recId));
  
  return newLiked === 1;
}

// ==================== WISHLIST ====================

export async function getWishlist(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const { wishlist } = await import("../drizzle/schema");
  const { desc } = await import("drizzle-orm");
  return db
    .select()
    .from(wishlist)
    .where(eq(wishlist.userId, userId))
    .orderBy(desc(wishlist.createdAt));
}

export async function isWishlisted(userId: number, bookId: string) {
  const db = await getDb();
  if (!db) return false;
  const { wishlist } = await import("../drizzle/schema");
  const { and } = await import("drizzle-orm");
  const result = await db
    .select()
    .from(wishlist)
    .where(and(eq(wishlist.userId, userId), eq(wishlist.bookId, bookId)));
  return result.length > 0;
}

export async function toggleWishlist(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { wishlist } = await import("../drizzle/schema");
  const { and } = await import("drizzle-orm");
  
  const exists = await isWishlisted(data.userId, data.bookId);
  
  if (exists) {
    await db
      .delete(wishlist)
      .where(
        and(
          eq(wishlist.userId, data.userId),
          eq(wishlist.bookId, data.bookId)
        )
      );
    return false;
  } else {
    await db.insert(wishlist).values(data);
    return true;
  }
}

// ==================== USER PROFILES ====================

export async function getUserProfile(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const { userProfiles } = await import("../drizzle/schema");
  const result = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.userId, userId));
  return result[0] || null;
}

export async function createUserProfile(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { userProfiles } = await import("../drizzle/schema");
  await db.insert(userProfiles).values(data);
}

export async function updateUserProfile(userId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { userProfiles } = await import("../drizzle/schema");
  await db.update(userProfiles).set(data).where(eq(userProfiles.userId, userId));
}
