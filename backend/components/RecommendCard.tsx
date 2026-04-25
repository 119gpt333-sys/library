import { View, Text, Pressable, StyleSheet } from "react-native";
import { useColors } from "@/hooks/use-colors";
import type { Recommendation } from "@/store";
import type { Book } from "@/data/books";

interface RecommendCardProps {
  recommendation: Recommendation;
  book: Book;
  onBookPress: () => void;
  onLike: () => void;
}

export function RecommendCard({ recommendation, book, onBookPress, onLike }: RecommendCardProps) {
  const colors = useColors();

  const dateStr = new Date(recommendation.createdAt).toLocaleDateString("ko-KR", {
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
      {/* 추천인 헤더 */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{recommendation.nickname[0]}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={[styles.nickname, { color: colors.foreground }]}>
            {recommendation.nickname}
          </Text>
          <Text style={[styles.date, { color: colors.muted }]}>{dateStr} · 도서 추천</Text>
        </View>
      </View>

      {/* 도서 정보 */}
      <Pressable
        onPress={onBookPress}
        style={({ pressed }) => [
          styles.bookRow,
          {
            backgroundColor: colors.background,
            borderColor: colors.border,
            opacity: pressed ? 0.75 : 1,
          },
        ]}
      >
        <View
          style={[
            styles.miniCover,
            { backgroundColor: book.coverColor, borderColor: colors.border },
          ]}
        >
          <Text style={styles.coverEmoji}>{book.coverEmoji}</Text>
        </View>
        <View style={styles.bookInfo}>
          <Text style={[styles.bookTitle, { color: colors.foreground }]} numberOfLines={1}>
            {book.title}
          </Text>
          <Text style={[styles.bookAuthor, { color: colors.muted }]} numberOfLines={1}>
            {book.author}
          </Text>
        </View>
        <Text style={[styles.chevron, { color: colors.muted }]}>›</Text>
      </Pressable>

      {/* 추천 이유 */}
      <Text style={[styles.reason, { color: colors.foreground }]}>{recommendation.reason}</Text>

      {/* 좋아요 */}
      <Pressable
        onPress={onLike}
        style={({ pressed }) => [styles.likeRow, { opacity: pressed ? 0.6 : 1 }]}
      >
        <Text style={[styles.likeIcon, { color: recommendation.likedByMe ? "#C4873A" : colors.muted }]}>
          {recommendation.likedByMe ? "♥" : "♡"}
        </Text>
        <Text style={[styles.likeCount, { color: colors.muted }]}>{recommendation.likes}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#3B6B4A",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  headerInfo: {
    flex: 1,
    gap: 2,
  },
  nickname: {
    fontSize: 14,
    fontWeight: "600",
  },
  date: {
    fontSize: 12,
  },
  bookRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 10,
  },
  miniCover: {
    width: 44,
    height: 58,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  coverEmoji: {
    fontSize: 24,
  },
  bookInfo: {
    flex: 1,
    gap: 3,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  bookAuthor: {
    fontSize: 12,
  },
  chevron: {
    fontSize: 20,
    fontWeight: "300",
  },
  reason: {
    fontSize: 14,
    lineHeight: 22,
  },
  likeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-start",
  },
  likeIcon: {
    fontSize: 18,
  },
  likeCount: {
    fontSize: 13,
    fontWeight: "500",
  },
});
