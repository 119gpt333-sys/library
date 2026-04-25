import { supabase, Book, Rental, Review, Recommendation, Wishlist, UserProfile } from "./supabase";

// ============ Books ============

export async function getAllBooks(): Promise<Book[]> {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getBookById(id: string): Promise<Book | null> {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("id", id)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data || null;
}

export async function searchBooks(query: string): Promise<Book[]> {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .or(`title.ilike.%${query}%,author.ilike.%${query}%,description.ilike.%${query}%`);

  if (error) throw error;
  return data || [];
}

export async function getBooksByGenre(genre: string): Promise<Book[]> {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("genre", genre)
    .order("rating", { ascending: false });

  if (error) throw error;
  return data || [];
}

// ============ Rentals ============

export async function getUserRentals(userId: number): Promise<Rental[]> {
  const { data, error } = await supabase
    .from("rentals")
    .select("*")
    .eq("user_id", userId)
    .order("rental_date", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getActiveRentals(userId: number): Promise<Rental[]> {
  const { data, error } = await supabase
    .from("rentals")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("due_date", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function isBookRented(userId: number, bookId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("rentals")
    .select("id")
    .eq("user_id", userId)
    .eq("book_id", bookId)
    .eq("status", "active")
    .limit(1);

  if (error) throw error;
  return (data?.length || 0) > 0;
}

export async function rentBook(rental: {
  id: string;
  userId: number;
  bookId: string;
  dueDate: Date;
}): Promise<void> {
  const { error } = await supabase.from("rentals").insert([
    {
      id: rental.id,
      user_id: rental.userId,
      book_id: rental.bookId,
      due_date: rental.dueDate.toISOString(),
      status: "active",
    },
  ]);

  if (error) throw error;

  // 가용 권수 감소
  const book = await getBookById(rental.bookId);
  if (book) {
    await supabase
      .from("books")
      .update({ available_copies: Math.max(0, book.available_copies - 1) })
      .eq("id", rental.bookId);
  }
}

export async function returnBook(rentalId: string): Promise<void> {
  const { data: rental, error: fetchError } = await supabase
    .from("rentals")
    .select("book_id")
    .eq("id", rentalId)
    .single();

  if (fetchError) throw fetchError;

  const { error } = await supabase
    .from("rentals")
    .update({ status: "returned", returned_at: new Date().toISOString() })
    .eq("id", rentalId);

  if (error) throw error;

  // 가용 권수 증가
  if (rental) {
    const book = await getBookById(rental.book_id);
    if (book) {
      await supabase
        .from("books")
        .update({ available_copies: book.available_copies + 1 })
        .eq("id", rental.book_id);
    }
  }
}

export async function extendRental(rentalId: string): Promise<void> {
  const { data: rental, error: fetchError } = await supabase
    .from("rentals")
    .select("due_date, extension_count")
    .eq("id", rentalId)
    .single();

  if (fetchError) throw fetchError;

  if (rental && rental.extension_count < 2) {
    const newDueDate = new Date(rental.due_date);
    newDueDate.setDate(newDueDate.getDate() + 7);

    const { error } = await supabase
      .from("rentals")
      .update({
        due_date: newDueDate.toISOString(),
        extension_count: rental.extension_count + 1,
      })
      .eq("id", rentalId);

    if (error) throw error;
  }
}

// ============ Reviews ============

export async function getReviewsByBook(bookId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("book_id", bookId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getAllReviews(): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function addReview(review: {
  id: string;
  userId: number;
  bookId: string;
  rating: number;
  text?: string;
  nickname: string;
}): Promise<void> {
  const { error } = await supabase.from("reviews").insert([
    {
      id: review.id,
      user_id: review.userId,
      book_id: review.bookId,
      rating: review.rating,
      text: review.text,
      nickname: review.nickname,
    },
  ]);

  if (error) throw error;

  // 도서 평점 업데이트
  const reviews = await getReviewsByBook(review.bookId);
  const avgRating = Math.round(
    (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10
  );

  await supabase
    .from("books")
    .update({ rating: avgRating, review_count: reviews.length })
    .eq("id", review.bookId);
}

// ============ Recommendations ============

export async function getRecommendations(): Promise<Recommendation[]> {
  const { data, error } = await supabase
    .from("recommendations")
    .select("*")
    .order("likes", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function addRecommendation(rec: {
  id: string;
  userId: number;
  bookId: string;
  reason: string;
  nickname: string;
}): Promise<void> {
  const { error } = await supabase.from("recommendations").insert([
    {
      id: rec.id,
      user_id: rec.userId,
      book_id: rec.bookId,
      reason: rec.reason,
      nickname: rec.nickname,
    },
  ]);

  if (error) throw error;
}

export async function toggleRecommendationLike(recId: string): Promise<void> {
  const { data: rec, error: fetchError } = await supabase
    .from("recommendations")
    .select("likes, liked")
    .eq("id", recId)
    .single();

  if (fetchError) throw fetchError;

  if (rec) {
    const newLikes = rec.liked ? rec.likes - 1 : rec.likes + 1;
    const { error } = await supabase
      .from("recommendations")
      .update({ likes: newLikes, liked: rec.liked ? 0 : 1 })
      .eq("id", recId);

    if (error) throw error;
  }
}

// ============ Wishlist ============

export async function getWishlist(userId: number): Promise<Wishlist[]> {
  const { data, error } = await supabase
    .from("wishlist")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;
  return data || [];
}

export async function isWishlisted(userId: number, bookId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("wishlist")
    .select("id")
    .eq("user_id", userId)
    .eq("book_id", bookId)
    .limit(1);

  if (error) throw error;
  return (data?.length || 0) > 0;
}

export async function toggleWishlist(item: {
  userId: number;
  bookId: string;
  id: string;
}): Promise<void> {
  const isWished = await isWishlisted(item.userId, item.bookId);

  if (isWished) {
    const { error } = await supabase
      .from("wishlist")
      .delete()
      .eq("user_id", item.userId)
      .eq("book_id", item.bookId);

    if (error) throw error;
  } else {
    const { error } = await supabase.from("wishlist").insert([
      {
        id: item.id,
        user_id: item.userId,
        book_id: item.bookId,
      },
    ]);

    if (error) throw error;
  }
}

// ============ User Profile ============

export async function getUserProfile(userId: number): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data || null;
}

export async function updateUserProfile(
  userId: number,
  profile: { nickname: string }
): Promise<void> {
  const existing = await getUserProfile(userId);

  if (existing) {
    const { error } = await supabase
      .from("user_profiles")
      .update(profile)
      .eq("user_id", userId);

    if (error) throw error;
  } else {
    const { error } = await supabase.from("user_profiles").insert([
      {
        user_id: userId,
        ...profile,
      },
    ]);

    if (error) throw error;
  }
}
