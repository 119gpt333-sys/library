import { useState, useEffect } from "react";
import { getBookById } from "../data/books";
import { StarRating } from "../components/StarRating";
import { ReviewCard } from "../components/ReviewCard";
import { isBookRented, rentBook, isWishlisted, toggleWishlist, getReviewsByBook, type Review } from "../store";
import { ChevronLeft, Heart } from "lucide-react";

interface BookDetailPageProps {
  bookId: string;
  onBack: () => void;
  onReviewClick: (bookId: string) => void;
}

export default function BookDetailPage({ bookId, onBack, onReviewClick }: BookDetailPageProps) {
  const book = getBookById(bookId);
  const [rented, setRented] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [descExpanded, setDescExpanded] = useState(false);

  useEffect(() => {
    const loadState = async () => {
      if (!bookId) return;
      const [r, w, revs] = await Promise.all([
        isBookRented(bookId),
        isWishlisted(bookId),
        getReviewsByBook(bookId),
      ]);
      setRented(r);
      setWishlisted(w);
      setReviews(revs);
    };
    loadState();
  }, [bookId]);

  if (!book) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">도서를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const handleRent = async () => {
    if (rented) {
      alert("현재 대여 중인 도서입니다. 대여 탭에서 확인하세요.");
      return;
    }
    if (!book.isAvailable) {
      alert("현재 모든 권이 대여 중입니다. 나중에 다시 시도해주세요.");
      return;
    }
    if (confirm(`"${book.title}"을(를) 대여하시겠습니까?\n반납 기한은 14일입니다.`)) {
      await rentBook(book.id);
      setRented(true);
      alert("대여가 신청되었습니다. 대여 탭에서 확인하세요.");
    }
  };

  const handleWishlist = async () => {
    const added = await toggleWishlist(book.id);
    setWishlisted(added);
  };

  const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : book.rating;
  const totalReviews = reviews.length + book.reviewCount;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-32">
      {/* 네비게이션 */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <ChevronLeft size={24} />
          <span>뒤로</span>
        </button>
        <button onClick={handleWishlist} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Heart
            size={24}
            className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}
          />
        </button>
      </div>

      {/* 히어로 섹션 */}
      <div className="text-center mb-8">
        <div
          className="w-40 h-56 rounded-lg mx-auto mb-6 flex items-center justify-center text-7xl shadow-lg"
          style={{ backgroundColor: book.coverColor }}
        >
          {book.coverEmoji}
        </div>
        <div
          className={`inline-block px-4 py-2 rounded-full text-white font-medium mb-4 ${
            book.isAvailable ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {book.isAvailable ? `대여 가능 (${book.availableCopies}/${book.totalCopies}권)` : "전권 대여 중"}
        </div>
      </div>

      {/* 도서 정보 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
        <p className="text-gray-600 mb-4">
          {book.author} · {book.publisher} · {book.publishedYear > 0 ? book.publishedYear : "고전"}
        </p>

        {/* 장르 배지 */}
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
            {book.genre}
          </span>
        </div>

        {/* 평점 */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
          <span className="text-4xl font-bold text-gray-900">{avgRating.toFixed(1)}</span>
          <div>
            <StarRating rating={avgRating} size={24} />
            <p className="text-sm text-gray-600 mt-1">({totalReviews.toLocaleString()}개 리뷰)</p>
          </div>
        </div>

        {/* 소개 */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3">책 소개</h2>
          <p className={`text-gray-700 leading-relaxed ${!descExpanded && "line-clamp-3"}`}>
            {book.description}
          </p>
          <button
            onClick={() => setDescExpanded(!descExpanded)}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm mt-2"
          >
            {descExpanded ? "접기 ▲" : "더보기 ▼"}
          </button>
        </div>
      </div>

      {/* 리뷰 섹션 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">리뷰 ({reviews.length})</h2>
          <button
            onClick={() => onReviewClick(book.id)}
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
          >
            리뷰 작성
          </button>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">아직 리뷰가 없습니다. 첫 번째 리뷰를 작성해보세요!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>

      {/* 하단 대여 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <button
          onClick={handleRent}
          disabled={rented || !book.isAvailable}
          className={`w-full py-4 rounded-lg font-bold text-lg text-white transition-colors ${
            rented
              ? "bg-gray-400 cursor-not-allowed"
              : book.isAvailable
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {rented ? "대여 중 (대여 탭에서 확인)" : book.isAvailable ? "대여 신청" : "대여 불가"}
        </button>
      </div>
    </div>
  );
}
