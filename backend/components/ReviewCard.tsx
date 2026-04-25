import { View, Text, StyleSheet } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { StarRating } from "./StarRating";
import type { Review } from "@/store";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const colors = useColors();

  const dateStr = new Date(review.createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{review.nickname[0]}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={[styles.nickname, { color: colors.foreground }]}>{review.nickname}</Text>
          <Text style={[styles.date, { color: colors.muted }]}>{dateStr}</Text>
        </View>
        <StarRating rating={review.rating} size={14} />
      </View>
      {review.text ? (
        <Text style={[styles.text, { color: colors.foreground }]}>{review.text}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
    gap: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#3B6B4A",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  headerInfo: {
    flex: 1,
    gap: 1,
  },
  nickname: {
    fontSize: 13,
    fontWeight: "600",
  },
  date: {
    fontSize: 11,
  },
  text: {
    fontSize: 14,
    lineHeight: 21,
  },
});
