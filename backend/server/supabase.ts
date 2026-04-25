import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase credentials");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// 타입 정의
export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  published_year: number;
  genre: string;
  description: string;
  rating: number;
  review_count: number;
  total_copies: number;
  available_copies: number;
  is_new: number;
  is_available: number;
  cover_color: string;
  cover_emoji: string;
}

export interface Rental {
  id: string;
  user_id: number;
  book_id: string;
  rental_date: string;
  due_date: string;
  returned_at: string | null;
  extension_count: number;
  status: string;
}

export interface Review {
  id: string;
  user_id: number;
  book_id: string;
  rating: number;
  text: string | null;
  nickname: string;
  created_at: string;
}

export interface Recommendation {
  id: string;
  user_id: number;
  book_id: string;
  reason: string;
  nickname: string;
  likes: number;
  liked: number;
}

export interface Wishlist {
  id: string;
  user_id: number;
  book_id: string;
  created_at: string;
}

export interface UserProfile {
  user_id: number;
  nickname: string;
  joined_at: string;
}
