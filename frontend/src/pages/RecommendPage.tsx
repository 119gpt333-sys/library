import { useState } from "react";
import { BOOKS, searchBooks } from "../data/books";
import { BookCard } from "../components/BookCard";
import { addRecommendation, getProfile } from "../store";
import { ChevronLeft, Search } from "lucide-react";

interface RecommendPageProps {
  onBack: () => void;
}

export default function RecommendPage({ onBack }: RecommendPageProps) {
  const [step, setStep] = useState<"select" | "write">("select");
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const searchResults = searchQuery ? searchBooks(searchQuery) : BOOKS.slice(0, 8);

  const handleSubmit = async () => {
    if (!selectedBook) return;
    if (!reason.trim()) {
      alert("추천 이유를 입력해주세요.");
      return;
    }
    setSubmitting(true);
    try {
      const profile = await getProfile();
      await addRecommendation(selectedBook.id, reason.trim(), profile.nickname);
      alert("도서 추천이 등록되었습니다!");
      onBack();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
      {/* 네비게이션 */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => {
            if (step === "write") {
              setStep("select");
            } else {
              onBack();
            }
          }}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft size={24} />
          <span>{step === "write" ? "뒤로" : "취소"}</span>
        </button>
        <h1 className="text-lg font-bold text-gray-900">도서 추천</h1>
        {step === "write" && (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="font-bold text-blue-600 hover:text-blue-700 disabled:text-gray-400"
          >
            {submitting ? "등록 중..." : "등록"}
          </button>
        )}
      </div>

      {/* 단계 표시 */}
      <div className="flex items-center gap-2 mb-8">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${step === "select" ? "bg-blue-600" : "bg-gray-400"}`}>
          1
        </div>
        <div className={`flex-1 h-1 ${step === "write" ? "bg-blue-600" : "bg-gray-300"}`} />
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${step === "write" ? "bg-blue-600" : "bg-gray-400"}`}>
          2
        </div>
      </div>

      {/* 도서 선택 단계 */}
      {step === "select" && (
        <div>
          {/* 검색 바 */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="추천할 도서를 검색하세요..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* 도서 목록 */}
          <div className="space-y-3">
            {searchResults.map((book) => (
              <button
                key={book.id}
                onClick={() => {
                  setSelectedBook(book);
                  setStep("write");
                }}
                className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-left"
              >
                <div
                  className="w-12 h-16 rounded flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: book.coverColor }}
                >
                  {book.coverEmoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{book.title}</p>
                  <p className="text-sm text-gray-600">{book.author}</p>
                  <p className="text-xs text-blue-600 font-medium mt-1">{book.genre}</p>
                </div>
                <span className="text-gray-400">›</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 추천 이유 작성 단계 */}
      {step === "write" && selectedBook && (
        <div>
          {/* 선택된 도서 */}
          <div className="flex gap-4 p-4 bg-gray-50 rounded-lg mb-8">
            <div
              className="w-16 h-24 rounded flex items-center justify-center text-3xl flex-shrink-0"
              style={{ backgroundColor: selectedBook.coverColor }}
            >
              {selectedBook.coverEmoji}
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-gray-900 line-clamp-2">{selectedBook.title}</h2>
              <p className="text-sm text-gray-600">{selectedBook.author}</p>
            </div>
          </div>

          {/* 추천 이유 */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">
              이 책을 추천하는 이유를 알려주세요
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value.slice(0, 300))}
              placeholder="이 책의 어떤 점이 좋았나요? 어떤 분께 추천하고 싶으신가요?"
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
              rows={6}
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-2 text-right">{reason.length}/300</p>
          </div>
        </div>
      )}
    </div>
  );
}
