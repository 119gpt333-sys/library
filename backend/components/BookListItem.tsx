import { View, Text, Pressable, StyleSheet } from "react-native";
import { useColors } from "@/hooks/use-colors";
import type { Book } from "@/data/books";

interface BookListItemProps {
  book: Book;
  onPress: () => void;
  rank?: number;
}

export function BookListItem({ book, onPress, rank }: BookListItemProps) {
  const colors = useColors();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.75 : 1,
        },
      ]}
    >
      {/* 순위 */}
      {rank !== undefined && (
        <Text style={[styles.rank, { color: rank <= 3 ? "#C4873A" : colors.muted }]}>
          {rank}
        </Text>
      )}

      {/* 표지 미니 */}
      <View
        style={[
          styles.miniCover,
          { backgroundColor: book.coverColor, borderColor: colors.border },
        ]}
      >
        <Text style={styles.emoji}>{book.coverEmoji}</Text>
      </View>

      {/* 정보 */}
      <View style={styles.info}>
        <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={1}>
          {book.title}
        </Text>
        <Text style={[styles.author, { color: colors.muted }]} numberOfLines={1}>
          {book.author} · {book.genre}
        </Text>
        <View style={styles.bottomRow}>
          <Text style={[styles.star, { color: "#C4873A" }]}>★ {book.rating.toFixed(1)}</Text>
          <Text style={[styles.reviews, { color: colors.muted }]}>
            리뷰 {book.reviewCount.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* 대여 상태 */}
      <View
        style={[
          styles.statusBadge,
          { backgroundColor: book.isAvailable ? "#E8F5E9" : "#FFEBEE" },
        ]}
      >
        <Text
          style={[
            styles.statusText,
            { color: book.isAvailable ? colors.success : colors.error },
          ]}
        >
          {book.isAvailable ? "대여가능" : "대여중"}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    gap: 12,
  },
  rank: {
    width: 22,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  miniCover: {
    width: 52,
    height: 68,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 28,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
  author: {
    fontSize: 12,
    lineHeight: 16,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  star: {
    fontSize: 12,
    fontWeight: "600",
  },
  reviews: {
    fontSize: 11,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
});
