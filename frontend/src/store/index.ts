export interface RentalRecord {
  id: string;
  bookId: string;
  rentedAt: string;
  dueDate: string;
  returnedAt?: string;
  status: "active" | "returned";
  extendCount: number;
}

export interface Review {
  id: string;
  bookId: string;
  rating: number;
  text: string;
  nickname: string;
  createdAt: string;
}

export interface Recommendation {
  id: string;
  bookId: string;
  reason: string;
  nickname: string;
  createdAt: string;
  likes: number;
  liked: boolean;
}

export interface UserProfile {
  nickname: string;
  joinedAt: string;
}

const STORAGE_KEYS = {
  RENTALS: "dosugirok_rentals",
  WISHLIST: "dosugirok_wishlist",
  REVIEWS: "dosugirok_reviews",
  RECOMMENDATIONS: "dosugirok_recommendations",
  PROFILE: "dosugirok_profile",
};

// 프로필 관리
export async function getProfile(): Promise<UserProfile> {
  const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
  if (stored) {
    return JSON.parse(stored);
  }
  const profile: UserProfile = {
    nickname: "독서가",
    joinedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  return profile;
}

export async function updateNickname(nickname: string): Promise<void> {
  const profile = await getProfile();
  profile.nickname = nickname;
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
}

// 대여 관리
export async function rentBook(bookId: string): Promise<string> {
  const rentals = await getRentals();
  const id = `rental_${Date.now()}`;
  const now = new Date();
  const dueDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

  const rental: RentalRecord = {
    id,
    bookId,
    rentedAt: now.toISOString(),
    dueDate: dueDate.toISOString(),
    status: "active",
    extendCount: 0,
  };

  rentals.push(rental);
  localStorage.setItem(STORAGE_KEYS.RENTALS, JSON.stringify(rentals));
  return id;
}

export async function returnBook(rentalId: string): Promise<void> {
  const rentals = await getRentals();
  const rental = rentals.find((r) => r.id === rentalId);
  if (rental) {
    rental.status = "returned";
    rental.returnedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.RENTALS, JSON.stringify(rentals));
  }
}

export async function extendRental(rentalId: string): Promise<void> {
  const rentals = await getRentals();
  const rental = rentals.find((r) => r.id === rentalId);
  if (rental && rental.extendCount < 2) {
    const dueDate = new Date(rental.dueDate);
    dueDate.setDate(dueDate.getDate() + 7);
    rental.dueDate = dueDate.toISOString();
    rental.extendCount += 1;
    localStorage.setItem(STORAGE_KEYS.RENTALS, JSON.stringify(rentals));
  }
}

export async function isBookRented(bookId: string): Promise<boolean> {
  const rentals = await getRentals();
  return rentals.some((r) => r.bookId === bookId && r.status === "active");
}

export async function getRentals(): Promise<RentalRecord[]> {
  const stored = localStorage.getItem(STORAGE_KEYS.RENTALS);
  return stored ? JSON.parse(stored) : [];
}

export async function getActiveRentals(): Promise<RentalRecord[]> {
  const rentals = await getRentals();
  return rentals.filter((r) => r.status === "active");
}

export async function getRentalHistory(): Promise<RentalRecord[]> {
  const rentals = await getRentals();
  return rentals.filter((r) => r.status === "returned");
}

// 찜 목록 관리
export async function toggleWishlist(bookId: string): Promise<boolean> {
  const wishlist = await getWishlist();
  const index = wishlist.indexOf(bookId);

  if (index > -1) {
    wishlist.splice(index, 1);
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    return false;
  } else {
    wishlist.push(bookId);
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    return true;
  }
}

export async function isWishlisted(bookId: string): Promise<boolean> {
  const wishlist = await getWishlist();
  return wishlist.includes(bookId);
}

export async function getWishlist(): Promise<string[]> {
  const stored = localStorage.getItem(STORAGE_KEYS.WISHLIST);
  return stored ? JSON.parse(stored) : [];
}

// 리뷰 관리
export async function addReview(
  bookId: string,
  rating: number,
  text: string,
  nickname: string
): Promise<string> {
  const reviews = await getReviews();
  const id = `review_${Date.now()}`;

  const review: Review = {
    id,
    bookId,
    rating,
    text,
    nickname,
    createdAt: new Date().toISOString(),
  };

  reviews.push(review);
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  return id;
}

export async function getReviews(): Promise<Review[]> {
  const stored = localStorage.getItem(STORAGE_KEYS.REVIEWS);
  return stored ? JSON.parse(stored) : [];
}

export async function getReviewsByBook(bookId: string): Promise<Review[]> {
  const reviews = await getReviews();
  return reviews.filter((r) => r.bookId === bookId);
}

// 추천 관리
export async function addRecommendation(
  bookId: string,
  reason: string,
  nickname: string
): Promise<string> {
  const recommendations = await getRecommendations();
  const id = `rec_${Date.now()}`;

  const rec: Recommendation = {
    id,
    bookId,
    reason,
    nickname,
    createdAt: new Date().toISOString(),
    likes: 0,
    liked: false,
  };

  recommendations.push(rec);
  localStorage.setItem(STORAGE_KEYS.RECOMMENDATIONS, JSON.stringify(recommendations));
  return id;
}

export async function toggleLike(recId: string): Promise<void> {
  const recommendations = await getRecommendations();
  const rec = recommendations.find((r) => r.id === recId);
  if (rec) {
    if (rec.liked) {
      rec.likes = Math.max(0, rec.likes - 1);
      rec.liked = false;
    } else {
      rec.likes += 1;
      rec.liked = true;
    }
    localStorage.setItem(STORAGE_KEYS.RECOMMENDATIONS, JSON.stringify(recommendations));
  }
}

export async function getRecommendations(): Promise<Recommendation[]> {
  const stored = localStorage.getItem(STORAGE_KEYS.RECOMMENDATIONS);
  return stored ? JSON.parse(stored) : [];
}
