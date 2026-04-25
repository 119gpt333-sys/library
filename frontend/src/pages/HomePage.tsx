import { BookCard } from "../components/BookCard";
import { trpc } from "../lib/trpc";
import { Loader } from "lucide-react";

interface HomePageProps {
  onBookClick: (bookId: string) => void;
}

export default function HomePage({ onBookClick }: HomePageProps) {
  const { data: books, isLoading } = trpc.books.list.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin" size={32} />
      </div>
    );
  }

  const newBooks = books?.slice(0, 4) || [];
  const popularBooks = books?.slice(4, 9) || [];
  const recommendedBooks = books?.slice(9, 13) || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-24">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">도서기록</h1>
        <p className="text-gray-600">오늘도 좋은 책 한 권 어떨까요?</p>
      </div>

      {/* 이달의 추천 */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">✨ 이달의 추천 도서</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {recommendedBooks.map((book) => (
            <BookCard key={book.id} book={book} onPress={onBookClick} size="md" />
          ))}
        </div>
      </section>

      {/* 신착 도서 */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">📚 신착 도서</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {newBooks.map((book) => (
            <BookCard key={book.id} book={book} onPress={onBookClick} size="md" />
          ))}
        </div>
      </section>

      {/* 인기 도서 */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">⭐ 인기 도서 TOP 5</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {popularBooks.map((book) => (
            <BookCard key={book.id} book={book} onPress={onBookClick} size="md" />
          ))}
        </div>
      </section>
    </div>
  );
}
