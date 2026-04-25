import AsyncStorage from "@react-native-async-storage/async-storage";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RentalRecord {
  id: string;
  bookId: string;
  rentedAt: string; // ISO date
  dueDate: string; // ISO date (rentedAt + 14 days)
  returnedAt?: string; // ISO date, undefined if not returned
  status: "active" | "returned" | "overdue";
}

export interface Review {
  id: string;
  bookId: string;
  rating: number; // 1~5
  text: string;
  createdAt: string;
  nickname: string;
}

export interface Recommendation {
  id: string;
  bookId: string;
  reason: string;
  createdAt: string;
  nickname: string;
  likes: number;
  likedByMe: boolean;
}

// ─── Keys ─────────────────────────────────────────────────────────────────────

const KEYS = {
  rentals: "@dosugirok/rentals",
  wishlist: "@dosugirok/wishlist",
  reviews: "@dosugirok/reviews",
  recommendations: "@dosugirok/recommendations",
  profile: "@dosugirok/profile",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function load<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

async function save<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function daysUntilDue(dueDate: string): number {
  const due = new Date(dueDate);
  const now = new Date();
  const diff = due.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// ─── Rental Store ─────────────────────────────────────────────────────────────

export async function getRentals(): Promise<RentalRecord[]> {
  return load<RentalRecord[]>(KEYS.rentals, []);
}

export async function getActiveRentals(): Promise<RentalRecord[]> {
  const all = await getRentals();
  return all.filter((r) => r.status === "active" || r.status === "overdue");
}

export async function getRentalHistory(): Promise<RentalRecord[]> {
  const all = await getRentals();
  return all.filter((r) => r.status === "returned");
}

export async function isBookRented(bookId: string): Promise<boolean> {
  const active = await getActiveRentals();
  return active.some((r) => r.bookId === bookId);
}

export async function rentBook(bookId: string): Promise<RentalRecord> {
  const rentals = await getRentals();
  const now = new Date();
  const record: RentalRecord = {
    id: `rental_${Date.now()}`,
    bookId,
    rentedAt: now.toISOString(),
    dueDate: addDays(now, 14).toISOString(),
    status: "active",
  };
  await save(KEYS.rentals, [...rentals, record]);
  return record;
}

export async function returnBook(rentalId: string): Promise<void> {
  const rentals = await getRentals();
  const updated = rentals.map((r) =>
    r.id === rentalId
      ? { ...r, status: "returned" as const, returnedAt: new Date().toISOString() }
      : r
  );
  await save(KEYS.rentals, updated);
}

export async function extendRental(rentalId: string): Promise<void> {
  const rentals = await getRentals();
  const updated = rentals.map((r) => {
    if (r.id === rentalId) {
      const newDue = addDays(new Date(r.dueDate), 7);
      return { ...r, dueDate: newDue.toISOString() };
    }
    return r;
  });
  await save(KEYS.rentals, updated);
}

// ─── Wishlist Store ───────────────────────────────────────────────────────────

export async function getWishlist(): Promise<string[]> {
  return load<string[]>(KEYS.wishlist, []);
}

export async function isWishlisted(bookId: string): Promise<boolean> {
  const list = await getWishlist();
  return list.includes(bookId);
}

export async function toggleWishlist(bookId: string): Promise<boolean> {
  const list = await getWishlist();
  const exists = list.includes(bookId);
  const updated = exists ? list.filter((id) => id !== bookId) : [...list, bookId];
  await save(KEYS.wishlist, updated);
  return !exists;
}

// ─── Review Store ─────────────────────────────────────────────────────────────

export async function getReviews(): Promise<Review[]> {
  return load<Review[]>(KEYS.reviews, []);
}

export async function getReviewsByBook(bookId: string): Promise<Review[]> {
  const all = await getReviews();
  return all.filter((r) => r.bookId === bookId);
}

export async function addReview(
  bookId: string,
  rating: number,
  text: string,
  nickname: string
): Promise<Review> {
  const reviews = await getReviews();
  const review: Review = {
    id: `review_${Date.now()}`,
    bookId,
    rating,
    text,
    createdAt: new Date().toISOString(),
    nickname,
  };
  await save(KEYS.reviews, [...reviews, review]);
  return review;
}

export async function deleteReview(reviewId: string): Promise<void> {
  const reviews = await getReviews();
  await save(
    KEYS.reviews,
    reviews.filter((r) => r.id !== reviewId)
  );
}

// ─── Recommendation Store ─────────────────────────────────────────────────────

const SEED_RECOMMENDATIONS: Recommendation[] = [
  {
    id: "rec_seed_1",
    bookId: "1",
    reason:
      "한강 작가의 노벨문학상 수상 이후 꼭 읽어야 할 작품! 짧지만 강렬한 여운이 오래 남아요.",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    nickname: "독서왕민준",
    likes: 24,
    likedByMe: false,
  },
  {
    id: "rec_seed_2",
    bookId: "4",
    reason:
      "우주에 대한 경이로움을 느끼고 싶다면 코스모스를 강력 추천합니다. 과학책이지만 시처럼 읽혀요.",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    nickname: "별빛서연",
    likes: 18,
    likedByMe: false,
  },
  {
    id: "rec_seed_3",
    bookId: "10",
    reason:
      "잠들기 전에 읽기 딱 좋은 책이에요. 따뜻하고 몽환적인 세계관에 빠져들게 됩니다.",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    nickname: "꿈꾸는지훈",
    likes: 31,
    likedByMe: false,
  },
  {
    id: "rec_seed_4",
    bookId: "7",
    reason:
      "어른이 되어서 다시 읽으면 완전히 다른 감동을 줍니다. 어린 왕자는 어른을 위한 책이에요.",
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    nickname: "책벌레수아",
    likes: 45,
    likedByMe: false,
  },
];

export async function getRecommendations(): Promise<Recommendation[]> {
  const stored = await load<Recommendation[]>(KEYS.recommendations, []);
  // Merge seed data (only add seeds not already present)
  const storedIds = new Set(stored.map((r) => r.id));
  const seeds = SEED_RECOMMENDATIONS.filter((s) => !storedIds.has(s.id));
  const merged = [...seeds, ...stored];
  merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return merged;
}

export async function addRecommendation(
  bookId: string,
  reason: string,
  nickname: string
): Promise<Recommendation> {
  const stored = await load<Recommendation[]>(KEYS.recommendations, []);
  const rec: Recommendation = {
    id: `rec_${Date.now()}`,
    bookId,
    reason,
    createdAt: new Date().toISOString(),
    nickname,
    likes: 0,
    likedByMe: false,
  };
  await save(KEYS.recommendations, [rec, ...stored]);
  return rec;
}

export async function toggleLike(recId: string): Promise<void> {
  const stored = await load<Recommendation[]>(KEYS.recommendations, []);
  // Also handle seed recommendations
  const all = await getRecommendations();
  const updated = all.map((r) => {
    if (r.id === recId) {
      return {
        ...r,
        likedByMe: !r.likedByMe,
        likes: r.likedByMe ? r.likes - 1 : r.likes + 1,
      };
    }
    return r;
  });
  await save(KEYS.recommendations, updated);
}

// ─── Profile Store ────────────────────────────────────────────────────────────

export interface UserProfile {
  nickname: string;
  joinedAt: string;
}

export async function getProfile(): Promise<UserProfile> {
  return load<UserProfile>(KEYS.profile, {
    nickname: "독서가",
    joinedAt: new Date().toISOString(),
  });
}

export async function updateNickname(nickname: string): Promise<void> {
  const profile = await getProfile();
  await save(KEYS.profile, { ...profile, nickname });
}
