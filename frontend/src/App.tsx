import { useState } from "react";
import { Home, Search, BookOpen, MessageSquare, User } from "lucide-react";
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import RentalPage from "./pages/RentalPage";
import CommunityPage from "./pages/CommunityPage";
import MyPage from "./pages/MyPage";
import BookDetailPage from "./pages/BookDetailPage";
import ReviewPage from "./pages/ReviewPage";
import RecommendPage from "./pages/RecommendPage";

type Page = "home" | "explore" | "rental" | "community" | "my" | "book" | "review" | "recommend";

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [selectedBookId, setSelectedBookId] = useState<string>("");

  const handleBookClick = (bookId: string) => {
    setSelectedBookId(bookId);
    setCurrentPage("book");
  };

  const handleReviewClick = (bookId: string) => {
    setSelectedBookId(bookId);
    setCurrentPage("review");
  };

  const handleRecommendClick = () => {
    setCurrentPage("recommend");
  };

  const handleBack = () => {
    setCurrentPage("home");
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* 메인 콘텐츠 */}
      <div className="flex-1 overflow-y-auto">
        {currentPage === "home" && <HomePage onBookClick={handleBookClick} />}
        {currentPage === "explore" && <ExplorePage onBookClick={handleBookClick} />}
        {currentPage === "rental" && <RentalPage onBookClick={handleBookClick} />}
        {currentPage === "community" && (
          <CommunityPage
            onBookClick={handleBookClick}
            onRecommendClick={handleRecommendClick}
          />
        )}
        {currentPage === "my" && <MyPage onBookClick={handleBookClick} />}
        {currentPage === "book" && (
          <BookDetailPage
            bookId={selectedBookId}
            onBack={handleBack}
            onReviewClick={handleReviewClick}
          />
        )}
        {currentPage === "review" && (
          <ReviewPage bookId={selectedBookId} onBack={handleBack} />
        )}
        {currentPage === "recommend" && (
          <RecommendPage onBack={handleBack} />
        )}
      </div>

      {/* 하단 탭 바 */}
      {!["book", "review", "recommend"].includes(currentPage) && (
        <nav className="border-t border-gray-200 bg-white sticky bottom-0">
          <div className="flex justify-around">
            {[
              { id: "home", icon: Home, label: "홈" },
              { id: "explore", icon: Search, label: "탐색" },
              { id: "rental", icon: BookOpen, label: "대여" },
              { id: "community", icon: MessageSquare, label: "커뮤니티" },
              { id: "my", icon: User, label: "마이" },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setCurrentPage(id as Page)}
                className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors ${
                  currentPage === id
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Icon size={24} />
                <span className="text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}

export default App;
