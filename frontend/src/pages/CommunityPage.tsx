import { useState, useEffect } from "react";
import { getRecommendations, getReviews, toggleLike, type Recommendation, type Review } from "../store";
import { getBookById } from "../data/books";
import { ReviewCard } from "../components/ReviewCard";
import { Heart } from "lucide-react";

interface CommunityPageProps {
  onBookClick: (bookId: string) => void;
  onRecommendClick: () => void;
}

export default function CommunityPage({ onBookClick, onRecommendClick }: CommunityPageProps) {
  const [tab, setTab] = useState<"recommend" | "review">("recommend");
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const loadData = async () => {
    const [recs, revs] = await Promise.all([getRecommendations(), getReviews()]);
    setRecommendations(recs);
    setReviews(revs);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLike = async (recId: string) => {
    await toggleLike(recId);
    await loadData();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">커뮤니티</h1>
        <button
          onClick={onRecommendClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          + 추천 작성
        </button>
      </div>

      {/* 탭 */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        {(["recommend", "review"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 font-medium transition-colors ${
              tab === t
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {t === "recommend" ? `추천 피드 (${recommendations.length})` : `리뷰 (${reviews.length})`}
          </button>
        ))}
      </div>

      {/* 추천 피드 */}
      {tab === "recommend" && (
        <div className="space-y-4">
          {recommendations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">아직 추천이 없습니다</p>
              <button
                onClick={onRecommendClick}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                첫 번째 추천 작성하기
              </button>
            </div>
          ) : (
            recommendations.map((rec) => {
              const book = getBookById(rec.bookId);
              return (
                <div key={rec.id} className="border border-gray-200 rounded-lg p-4">
                  {book && (
                    <button
                      onClick={() => onBookClick(book.id)}
                      className="flex items-center gap-3 mb-3 p-2 hover:bg-gray-50 rounded w-full text-left"
                    >
                      <div
                        className="w-12 h-16 rounded flex items-center justify-center text-xl flex-shrink-0"
                        style={{ backgroundColor: book.coverColor }}
                      >
                        {book.coverEmoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{book.title}</p>
                        <p className="text-sm text-gray-600">{book.author}</p>
                      </div>
                    </button>
                  )}

                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-2">{rec.reason}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{rec.nickname}</span>
                      <span>{new Date(rec.createdAt).toLocaleDateString("ko-KR")}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleLike(rec.id)}
                    className="flex items-center gap-1 text-sm hover:text-red-600 transition-colors"
                  >
                    <Heart
                      size={16}
                      className={rec.liked ? "fill-red-600 text-red-600" : "text-gray-400"}
                    />
                    <span className={rec.liked ? "text-red-600" : "text-gray-600"}>{rec.likes}</span>
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 리뷰 */}
      {tab === "review" && (
        <div>
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">아직 리뷰가 없습니다</p>
              <p className="text-sm text-gray-400 mt-2">도서 상세 페이지에서 리뷰를 작성해보세요</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => {
                const book = getBookById(review.bookId);
                return (
                  <div key={review.id}>
                    {book && (
                      <button
                        onClick={() => onBookClick(book.id)}
                        className="flex items-center gap-2 mb-2 p-2 hover:bg-gray-50 rounded w-full text-left text-sm"
                      >
                        <div
                          className="w-10 h-14 rounded flex items-center justify-center text-base flex-shrink-0"
                          style={{ backgroundColor: book.coverColor }}
                        >
                          {book.coverEmoji}
                        </div>
                        <p className="font-semibold text-gray-900 truncate">{book.title}</p>
                      </button>
                    )}
                    <ReviewCard review={review} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
