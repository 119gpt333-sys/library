import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { RecommendCard } from "@/components/RecommendCard";
import { ReviewCard } from "@/components/ReviewCard";
import { useColors } from "@/hooks/use-colors";
import {
  getRecommendations,
  getReviews,
  toggleLike,
  type Recommendation,
  type Review,
} from "@/store";
import { getBookById } from "@/data/books";
import { useState, useEffect, useCallback } from "react";

export default function CommunityScreen() {
  const colors = useColors();
  const router = useRouter();
  const [tab, setTab] = useState<"recommend" | "review">("recommend");
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const loadData = useCallback(async () => {
    const [recs, revs] = await Promise.all([getRecommendations(), getReviews()]);
    setRecommendations(recs);
    setReviews(revs);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleLike = async (recId: string) => {
    await toggleLike(recId);
    await loadData();
  };

  const goToBook = (id: string) => {
    router.push({ pathname: "/book/[id]", params: { id } });
  };

  return (
    <ScreenContainer>
      {/* 헤더 */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>커뮤니티</Text>
        <Pressable
          onPress={() => router.push("/recommend")}
          style={({ pressed }) => [
            styles.writeBtn,
            { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Text style={styles.writeBtnText}>+ 추천 작성</Text>
        </Pressable>
      </View>

      {/* 탭 */}
      <View style={[styles.tabRow, { borderBottomColor: colors.border }]}>
        {(["recommend", "review"] as const).map((t) => (
          <Pressable
            key={t}
            onPress={() => setTab(t)}
            style={[
              styles.tabBtn,
              {
                borderBottomColor: tab === t ? colors.primary : "transparent",
                borderBottomWidth: 2,
              },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: tab === t ? colors.primary : colors.muted,
                  fontWeight: tab === t ? "700" : "400",
                },
              ]}
            >
              {t === "recommend" ? `추천 피드 (${recommendations.length})` : `리뷰 (${reviews.length})`}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* 추천 피드 */}
      {tab === "recommend" && (
        <FlatList
          data={recommendations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const book = getBookById(item.bookId);
            if (!book) return null;
            return (
              <RecommendCard
                recommendation={item}
                book={book}
                onBookPress={() => goToBook(book.id)}
                onLike={() => handleLike(item.id)}
              />
            );
          }}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>💬</Text>
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
                아직 추천이 없습니다
              </Text>
              <Text style={[styles.emptyDesc, { color: colors.muted }]}>
                첫 번째 도서 추천을 작성해보세요
              </Text>
              <Pressable
                onPress={() => router.push("/recommend")}
                style={({ pressed }) => [
                  styles.writeEmptyBtn,
                  { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <Text style={styles.writeEmptyBtnText}>추천 작성하기</Text>
              </Pressable>
            </View>
          }
        />
      )}

      {/* 리뷰 */}
      {tab === "review" && (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const book = getBookById(item.bookId);
            return (
              <View style={styles.reviewWrapper}>
                {book && (
                  <Pressable
                    onPress={() => goToBook(book.id)}
                    style={({ pressed }) => [
                      styles.reviewBookRow,
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
                      <Text style={styles.emoji}>{book.coverEmoji}</Text>
                    </View>
                    <Text style={[styles.reviewBookTitle, { color: colors.foreground }]} numberOfLines={1}>
                      {book.title}
                    </Text>
                  </Pressable>
                )}
                <ReviewCard review={item} />
              </View>
            );
          }}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>📝</Text>
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
                아직 리뷰가 없습니다
              </Text>
              <Text style={[styles.emptyDesc, { color: colors.muted }]}>
                도서 상세 페이지에서 리뷰를 작성해보세요
              </Text>
            </View>
          }
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
  },
  writeBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  writeBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  tabRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
  },
  tabText: {
    fontSize: 14,
  },
  list: {
    padding: 16,
    paddingBottom: 24,
  },
  empty: {
    alignItems: "center",
    paddingTop: 80,
    gap: 10,
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  emptyDesc: {
    fontSize: 14,
    textAlign: "center",
  },
  writeEmptyBtn: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  writeEmptyBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  reviewWrapper: {
    marginBottom: 4,
  },
  reviewBookRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 6,
    gap: 8,
  },
  miniCover: {
    width: 32,
    height: 42,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 18,
  },
  reviewBookTitle: {
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
});
