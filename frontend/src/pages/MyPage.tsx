import { useState, useEffect } from "react";
import { getProfile, updateNickname, getWishlist, getReviews, getRentals, type UserProfile } from "../store";
import { getBookById } from "../data/books";
import { BookCard } from "../components/BookCard";
import { ReviewCard } from "../components/ReviewCard";

interface MyPageProps {
  onBookClick: (bookId: string) => void;
}

export default function MyPage({ onBookClick }: MyPageProps) {
  const [profile, setProfile] = useState<UserProfile>({ nickname: "독서가", joinedAt: "" });
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [myReviews, setMyReviews] = useState<any[]>([]);
  const [rentals, setRentals] = useState<any[]>([]);
  const [editingNickname, setEditingNickname] = useState(false);
  const [nicknameInput, setNicknameInput] = useState("");
  const [activeSection, setActiveSection] = useState<"wishlist" | "reviews">("wishlist");

  const loadData = async () => {
    const [p, w, r, allRentals] = await Promise.all([getProfile(), getWishlist(), getReviews(), getRentals()]);
    setProfile(p);
    setWishlist(w);
    setMyReviews(r.filter((rv) => rv.nickname === p.nickname));
    setRentals(allRentals);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveNickname = async () => {
    if (!nicknameInput.trim()) return;
    await updateNickname(nicknameInput.trim());
    setEditingNickname(false);
    await loadData();
  };

  const totalRentals = rentals.length;
  const returnedRentals = rentals.filter((r) => r.status === "returned").length;
  const activeRentals = rentals.filter((r) => r.status === "active").length;

  const joinedDate = profile.joinedAt
    ? new Date(profile.joinedAt).toLocaleDateString("ko-KR", { year: "numeric", month: "long" })
    : "";

  const wishlistBooks = wishlist.map((id) => getBookById(id)).filter(Boolean);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
      {/* 프로필 섹션 */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-8 text-white mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold">
            {profile.nickname[0]}
          </div>
          <div className="flex-1">
            {editingNickname ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={nicknameInput}
                  onChange={(e) => setNicknameInput(e.target.value)}
                  className="px-3 py-1 rounded text-gray-900 focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={handleSaveNickname}
                  className="px-3 py-1 bg-white text-blue-600 rounded font-medium hover:bg-gray-100"
                >
                  저장
                </button>
                <button
                  onClick={() => setEditingNickname(false)}
                  className="px-3 py-1 bg-white/20 rounded font-medium hover:bg-white/30"
                >
                  취소
                </button>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold">{profile.nickname}</h2>
                <p className="text-blue-100 text-sm">{joinedDate} 가입</p>
              </div>
            )}
          </div>
          {!editingNickname && (
            <button
              onClick={() => {
                setNicknameInput(profile.nickname);
                setEditingNickname(true);
              }}
              className="px-4 py-2 bg-white/20 rounded hover:bg-white/30 transition-colors"
            >
              ✏️ 편집
            </button>
          )}
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "총 대여", value: totalRentals },
          { label: "대여 중", value: activeRentals },
          { label: "반납 완료", value: returnedRentals },
          { label: "찜한 책", value: wishlist.length },
        ].map((stat) => (
          <div key={stat.label} className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* 섹션 탭 */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        {(["wishlist", "reviews"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setActiveSection(s)}
            className={`pb-3 font-medium transition-colors ${
              activeSection === s
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {s === "wishlist" ? `찜한 도서 (${wishlist.length})` : `내 리뷰 (${myReviews.length})`}
          </button>
        ))}
      </div>

      {/* 찜한 도서 */}
      {activeSection === "wishlist" && (
        <div>
          {wishlistBooks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">찜한 도서가 없습니다</p>
              <p className="text-sm text-gray-400 mt-2">도서 상세 페이지에서 하트를 눌러 찜해보세요</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {wishlistBooks.map((book) => (
                <BookCard key={book.id} book={book} onPress={onBookClick} size="md" />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 내 리뷰 */}
      {activeSection === "reviews" && (
        <div>
          {myReviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">작성한 리뷰가 없습니다</p>
              <p className="text-sm text-gray-400 mt-2">도서 상세 페이지에서 리뷰를 작성해보세요</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
