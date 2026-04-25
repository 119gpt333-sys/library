import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { BookCard } from '../components/BookCard';

export default function HomePage() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const result = await api.books.list();
        setBooks(result.data || []);
      } catch (error) {
        console.error('Failed to fetch books:', error);
        // 샘플 데이터 사용
        setBooks([
          { id: '1', title: '도서기록', author: '작가명', rating: 4.5, reviews: 10 },
          { id: '2', title: '추천도서', author: '작가명', rating: 4.0, reviews: 8 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleBookClick = (bookId: string) => {
    console.log('Book clicked:', bookId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="space-y-8">
        <div className="text-center gap-2">
          <h1 className="text-4xl font-bold text-gray-900">도서기록</h1>
          <p className="text-base text-gray-600 mt-2">
            도서를 대여하고 추천하세요
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">이달의 추천</h2>
          <div className="grid grid-cols-2 gap-4">
            {books.slice(0, 4).map((book) => (
              <BookCard key={book.id} book={book} onPress={() => handleBookClick(book.id)} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">신착 도서</h2>
          <div className="grid grid-cols-2 gap-4">
            {books.slice(4, 8).map((book) => (
              <BookCard key={book.id} book={book} onPress={() => handleBookClick(book.id)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
