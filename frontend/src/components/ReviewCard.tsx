import { Review } from "../store";
import { StarRating } from "./StarRating";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const createdDate = new Date(review.createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-3">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-semibold text-sm text-gray-900">{review.nickname}</p>
          <p className="text-xs text-gray-500">{createdDate}</p>
        </div>
        <StarRating rating={review.rating} size={14} />
      </div>
      {review.text && <p className="text-sm text-gray-700 leading-relaxed">{review.text}</p>}
    </div>
  );
}
