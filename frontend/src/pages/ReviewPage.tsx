import { useState } from "react";
import { getBookById } from "../data/books";
import { StarRating } from "../components/StarRating";
import { addReview, getProfile } from "../store";
import { ChevronLeft } from "lucide-react";

interface ReviewPageProps {
  bookId: string;
  onBack: () => void;
}

export default function ReviewPage({ bookId, onBack }: ReviewPageProps) {
  const book = getBookById(bookId);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!book) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">도서를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("별점을 선택해주세요.");
      return;
    }
    setSubmitting(true);
    try {
      const profile = await getProfile();
      await addReview(bookId, rating, text, profile.nickname);
      alert("리뷰가 등록되었습니다.");
      onBack();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
      {/* 네비게이션 */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <ChevronLeft size={24} />
          <span>취소</span>
        </button>
        <h1 className="text-lg font-bold text-gray-900">리뷰 작성</h1>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="font-bold text-blue-600 hover:text-blue-700 disabled:text-gray-400"
        >
          {submitting ? "등록 중..." : "등록"}
        </button>
      </div>

      {/* 도서 정보 */}
      <div className="flex gap-4 p-4 bg-gray-50 rounded-lg mb-8">
        <div
          className="w-16 h-24 rounded flex items-center justify-center text-3xl flex-shrink-0"
          style={{ backgroundColor: book.coverColor }}
        >
          {book.coverEmoji}
        </div>
        <div className="flex-1">
          <h2 className="font-bold text-gray-900 line-clamp-2">{book.title}</h2>
          <p className="text-sm text-gray-600">{book.author}</p>
        </div>
      </div>

      {/* 별점 */}
      <div className="mb-8">
        <label className="block text-sm font-bold text-gray-900 mb-4">별점</label>
        <div className="flex justify-center mb-4">
          <StarRating rating={rating} size={48} interactive onRate={setRating} />
        </div>
        <p className="text-center text-gray-600">
          {rating === 0
            ? "별점을 선택해주세요"
            : rating === 1
            ? "별로예요"
            : rating === 2
            ? "그저 그래요"
            : rating === 3
            ? "보통이에요"
            : rating === 4
            ? "좋아요"
            : "최고예요!"}
        </p>
      </div>

      {/* 리뷰 텍스트 */}
      <div className="mb-8">
        <label className="block text-sm font-bold text-gray-900 mb-3">리뷰 내용 (선택)</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 500))}
          placeholder="이 책에 대한 솔직한 리뷰를 남겨주세요..."
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
          rows={6}
        />
        <p className="text-xs text-gray-500 mt-2 text-right">{text.length}/500</p>
      </div>
    </div>
  );
}
