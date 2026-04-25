import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  size?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

export function StarRating({ rating, size = 16, interactive = false, onRate }: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => interactive && onRate?.(star)}
          disabled={!interactive}
          className={interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}
        >
          <Star
            size={size}
            className={
              star <= Math.round(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }
          />
        </button>
      ))}
    </div>
  );
}
