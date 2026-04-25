import { useState, useEffect } from "react";
import { getActiveRentals, getRentalHistory, returnBook, extendRental, type RentalRecord } from "../store";
import { getBookById } from "../data/books";
import { ChevronRight } from "lucide-react";

interface RentalPageProps {
  onBookClick: (bookId: string) => void;
}

export default function RentalPage({ onBookClick }: RentalPageProps) {
  const [tab, setTab] = useState<"active" | "history">("active");
  const [activeRentals, setActiveRentals] = useState<RentalRecord[]>([]);
  const [historyRentals, setHistoryRentals] = useState<RentalRecord[]>([]);

  const loadData = async () => {
    const [active, history] = await Promise.all([getActiveRentals(), getRentalHistory()]);
    setActiveRentals(active);
    setHistoryRentals(history);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReturn = async (rentalId: string) => {
    if (confirm("반납 신청하시겠습니까?")) {
      await returnBook(rentalId);
      await loadData();
    }
  };

  const handleExtend = async (rentalId: string) => {
    if (confirm("7일 연장하시겠습니까?")) {
      await extendRental(rentalId);
      await loadData();
    }
  };

  const currentList = tab === "active" ? activeRentals : historyRentals;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
      {/* 헤더 */}
      <h1 className="text-3xl font-bold text-gray-900 mb-6">대여 현황</h1>

      {/* 탭 */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        {(["active", "history"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 font-medium transition-colors ${
              tab === t
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {t === "active" ? `대여 중 (${activeRentals.length})` : `대여 이력 (${historyRentals.length})`}
          </button>
        ))}
      </div>

      {/* 목록 */}
      {currentList.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-2">{tab === "active" ? "대여 중인 도서가 없습니다" : "대여 이력이 없습니다"}</p>
          <p className="text-sm text-gray-400">
            {tab === "active" ? "홈에서 마음에 드는 도서를 찾아보세요" : "도서를 대여하면 이력이 기록됩니다"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {currentList.map((rental) => {
            const book = getBookById(rental.bookId);
            if (!book) return null;

            const dueDate = new Date(rental.dueDate);
            const today = new Date();
            const daysLeft = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            const isOverdue = daysLeft < 0;

            return (
              <div
                key={rental.id}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => onBookClick(book.id)}
              >
                <div
                  className="w-14 h-20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: book.coverColor }}
                >
                  {book.coverEmoji}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{book.title}</h3>
                  <p className="text-sm text-gray-600">{book.author}</p>
                  {tab === "active" ? (
                    <p className={`text-sm font-medium ${isOverdue ? "text-red-600" : "text-gray-600"}`}>
                      {isOverdue ? `연체 ${Math.abs(daysLeft)}일` : `${daysLeft}일 남음`}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">
                      반납 완료 · {new Date(rental.returnedAt!).toLocaleDateString("ko-KR")}
                    </p>
                  )}
                </div>

                {tab === "active" && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExtend(rental.id);
                      }}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                    >
                      연장
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReturn(rental.id);
                      }}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                    >
                      반납
                    </button>
                  </div>
                )}

                {tab === "history" && (
                  <ChevronRight className="text-gray-400 flex-shrink-0" size={20} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
