import { View, Text, Pressable, StyleSheet } from "react-native";
import { useColors } from "@/hooks/use-colors";
import type { Book } from "@/data/books";

interface BookCardProps {
  book: Book;
  onPress: () => void;
  size?: "sm" | "md" | "lg";
}

export function BookCard({ book, onPress, size = "md" }: BookCardProps) {
  const colors = useColors();

  const dimensions = {
    sm: { width: 100, height: 140, fontSize: 11, authorSize: 10 },
    md: { width: 130, height: 180, fontSize: 13, authorSize: 11 },
    lg: { width: 160, height: 220, fontSize: 14, authorSize: 12 },
  }[size];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          width: dimensions.width,
          opacity: pressed ? 0.75 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
      ]}
    >
      {/* 표지 */}
      <View
        style={[
          styles.cover,
          {
            width: dimensions.width,
            height: dimensions.height,
            backgroundColor: book.coverColor,
            borderColor: colors.border,
          },
        ]}
      >
        <Text style={styles.emoji}>{book.coverEmoji}</Text>
        {/* 대여 불가 배지 */}
        {!book.isAvailable && (
          <View style={[styles.unavailableBadge, { backgroundColor: colors.error }]}>
            <Text style={styles.unavailableText}>대여중</Text>
          </View>
        )}
        {/* 신착 배지 */}
        {book.isNew && book.isAvailable && (
          <View style={[styles.newBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.newText}>NEW</Text>
          </View>
        )}
      </View>

      {/* 정보 */}
      <View style={styles.info}>
        <Text
          style={[styles.title, { fontSize: dimensions.fontSize, color: colors.foreground }]}
          numberOfLines={2}
        >
          {book.title}
        </Text>
        <Text
          style={[styles.author, { fontSize: dimensions.authorSize, color: colors.muted }]}
          numberOfLines={1}
        >
          {book.author}
        </Text>
        <View style={styles.ratingRow}>
          <Text style={[styles.star, { color: "#C4873A" }]}>★</Text>
          <Text style={[styles.ratingText, { color: colors.muted, fontSize: dimensions.authorSize }]}>
            {book.rating.toFixed(1)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: 12,
  },
  cover: {
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
  },
  emoji: {
    fontSize: 48,
  },
  unavailableBadge: {
    position: "absolute",
    bottom: 6,
    right: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  unavailableText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "700",
  },
  newBadge: {
    position: "absolute",
    top: 6,
    left: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  newText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "700",
  },
  info: {
    marginTop: 8,
    gap: 2,
  },
  title: {
    fontWeight: "600",
    lineHeight: 18,
  },
  author: {
    lineHeight: 16,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginTop: 2,
  },
  star: {
    fontSize: 11,
  },
  ratingText: {
    lineHeight: 16,
  },
});
