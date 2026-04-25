import { useState } from "react";
import { BookCard } from "../components/BookCard";
import { BOOKS, searchBooks, GENRES } from "../data/books";
import { Search } from "lucide-react";

interface ExplorePageProps {
  onBookClick: (bookId: string) => void;
}

export default function ExplorePage({ onBookClick }: ExplorePageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [sortBy, setSortBy] = useState<"rating" | "newest" | "reviews">("rating");

  let results = searchQuery ? searchBooks(searchQuery) : BOOKS;

  if (selectedGenre) {
    results = results.filter((book) => book.genre === selectedGenre);
  }

  results = [...results].sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "newest") return b.publishedYear - a.publishedYear;
    return b.reviewCount - a.reviewCount;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-24">
      {/* 헤더 */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">도서 탐색</h1>

        {/* 검색 바 */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="도서명, 저자, 장르 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* 필터 및 정렬 */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* 장르 필터 */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">장르</label>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">모든 장르</option>
              {GENRES.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          {/* 정렬 */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">정렬</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="rating">평점 높은순</option>
              <option value="newest">최신순</option>
              <option value="reviews">리뷰 많은순</option>
            </select>
          </div>
        </div>
      </div>

      {/* 결과 */}
      <div>
        <p className="text-sm text-gray-600 mb-4">
          총 <span className="font-bold">{results.length}</span>개의 도서
        </p>
        {results.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">검색 결과가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {results.map((book) => (
              <BookCard key={book.id} book={book} onPress={onBookClick} size="md" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
