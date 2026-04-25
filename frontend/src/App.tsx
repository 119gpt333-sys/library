import { useState } from "react";
import { Home, Search, BookOpen, MessageSquare, User } from "lucide-react";
import HomePage from "./pages/HomePage";

type Page = "home" | "explore" | "rental" | "community" | "my";

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* 메인 콘텐츠 */}
      <div className="flex-1 overflow-y-auto">
        {currentPage === "home" && <HomePage />}
      </div>

      {/* 하단 탭 네비게이션 */}
      <nav className="border-t border-gray-200 bg-white">
        <div className="flex justify-around">
          <button
            onClick={() => setCurrentPage("home")}
            className={`flex-1 py-4 flex flex-col items-center gap-1 ${
              currentPage === "home" ? "text-green-600" : "text-gray-600"
            }`}
          >
            <Home size={24} />
            <span className="text-xs">홈</span>
          </button>
          <button
            onClick={() => setCurrentPage("explore")}
            className={`flex-1 py-4 flex flex-col items-center gap-1 ${
              currentPage === "explore" ? "text-green-600" : "text-gray-600"
            }`}
          >
            <Search size={24} />
            <span className="text-xs">탐색</span>
          </button>
          <button
            onClick={() => setCurrentPage("rental")}
            className={`flex-1 py-4 flex flex-col items-center gap-1 ${
              currentPage === "rental" ? "text-green-600" : "text-gray-600"
            }`}
          >
            <BookOpen size={24} />
            <span className="text-xs">대여</span>
          </button>
          <button
            onClick={() => setCurrentPage("community")}
            className={`flex-1 py-4 flex flex-col items-center gap-1 ${
              currentPage === "community" ? "text-green-600" : "text-gray-600"
            }`}
          >
            <MessageSquare size={24} />
            <span className="text-xs">커뮤니티</span>
          </button>
          <button
            onClick={() => setCurrentPage("my")}
            className={`flex-1 py-4 flex flex-col items-center gap-1 ${
              currentPage === "my" ? "text-green-600" : "text-gray-600"
            }`}
          >
            <User size={24} />
            <span className="text-xs">마이</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default App;
