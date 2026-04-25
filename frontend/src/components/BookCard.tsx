import { Book } from "../data/books";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { isWishlisted, toggleWishlist } from "../store";

interface BookCardProps {
  book: Book;
  onPress: (id: string) => void;
  size?: "sm" | "md" | "lg";
}

export function BookCard({ book, onPress, size = "md" }: BookCardProps) {
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    isWishlisted(book.id).then(setWishlisted);
  }, [book.id]);

  const handleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const added = await toggleWishlist(book.id);
    setWishlisted(added);
  };

  const sizeClasses = {
    sm: "w-24 h-32",
    md: "w-32 h-44",
    lg: "w-40 h-56",
  };

  return (
    <div
      onClick={() => onPress(book.id)}
      className="cursor-pointer group"
    >
      <div
        className={`${sizeClasses[size]} rounded-lg relative overflow-hidden shadow-md hover:shadow-lg transition-shadow`}
        style={{ backgroundColor: book.coverColor }}
      >
        <div className="w-full h-full flex items-center justify-center text-white">
          <span className={size === "sm" ? "text-3xl" : size === "md" ? "text-5xl" : "text-7xl"}>
            {book.coverEmoji}
          </span>
        </div>

        {/* 찜 버튼 */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors"
        >
          <Heart
            size={size === "sm" ? 14 : size === "md" ? 18 : 24}
            className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}
          />
        </button>

        {/* NEW 배지 */}
        {book.isNew && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
            NEW
          </div>
        )}
      </div>

      {/* 도서 정보 */}
      {size !== "sm" && (
        <div className="mt-2">
          <h3 className="font-semibold text-sm line-clamp-2 text-gray-900">{book.title}</h3>
          <p className="text-xs text-gray-600">{book.author}</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-yellow-500">★</span>
            <span className="text-xs font-medium text-gray-700">{book.rating.toFixed(1)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
