import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
  FlatList,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { StarRating } from "@/components/StarRating";
import { ReviewCard } from "@/components/ReviewCard";
import { useColors } from "@/hooks/use-colors";
import { getBookById } from "@/data/books";
import {
  isBookRented,
  rentBook,
  isWishlisted,
  toggleWishlist,
  getReviewsByBook,
  type Review,
} from "@/store";
import { useState, useEffect, useCallback } from "react";

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const router = useRouter();

  const book = getBookById(id ?? "");

  const [rented, setRented] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [descExpanded, setDescExpanded] = useState(false);

  const loadState = useCallback(async () => {
    if (!id) return;
    const [r, w, revs] = await Promise.all([
      isBookRented(id),
      isWishlisted(id),
      getReviewsByBook(id),
    ]);
    setRented(r);
    setWishlisted(w);
    setReviews(revs);
  }, [id]);

  useEffect(() => {
    loadState();
  }, [loadState]);

  if (!book) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text style={{ color: colors.muted, fontSize: 16 }}>도서를 찾을 수 없습니다.</Text>
      </ScreenContainer>
    );
  }

  const handleRent = () => {
    if (rented) {
      Alert.alert("이미 대여 중", "현재 대여 중인 도서입니다. 대여 탭에서 확인하세요.");
      return;
    }
    if (!book.isAvailable) {
      Alert.alert("대여 불가", "현재 모든 권이 대여 중입니다. 나중에 다시 시도해주세요.");
      return;
    }
    Alert.alert(
      "대여 신청",
      `"${book.title}"을(를) 대여하시겠습니까?\n반납 기한은 14일입니다.`,
      [
        { text: "취소", style: "cancel" },
        {
          text: "대여 신청",
          onPress: async () => {
            await rentBook(book.id);
            await loadState();
            Alert.alert("대여 완료!", "대여가 신청되었습니다. 대여 탭에서 확인하세요.");
          },
        },
      ]
    );
  };

  const handleWishlist = async () => {
    const added = await toggleWishlist(book.id);
    setWishlisted(added);
  };

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : book.rating;

  const totalReviews = reviews.length + book.reviewCount;

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      {/* 헤더 */}
      <View style={[styles.navBar, { borderBottomColor: colors.border }]}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Text style={[styles.backIcon, { color: colors.foreground }]}>‹</Text>
        </Pressable>
        <Text style={[styles.navTitle, { color: colors.foreground }]} numberOfLines={1}>
          {book.title}
        </Text>
        <Pressable
          onPress={handleWishlist}
          style={({ pressed }) => [styles.heartBtn, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Text style={[styles.heartIcon, { color: wishlisted ? "#C4873A" : colors.muted }]}>
            {wishlisted ? "♥" : "♡"}
          </Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* 히어로 섹션 */}
        <View style={[styles.hero, { backgroundColor: book.coverColor }]}>
          <View style={styles.coverLarge}>
            <Text style={styles.coverEmoji}>{book.coverEmoji}</Text>
          </View>
          <View
            style={[
              styles.availBadge,
              { backgroundColor: book.isAvailable ? colors.success : colors.error },
            ]}
          >
            <Text style={styles.availText}>
              {book.isAvailable
                ? `대여 가능 (${book.availableCopies}/${book.totalCopies}권)`
                : "전권 대여 중"}
            </Text>
          </View>
        </View>

        {/* 도서 정보 */}
        <View style={styles.infoSection}>
          <Text style={[styles.title, { color: colors.foreground }]}>{book.title}</Text>
          <Text style={[styles.author, { color: colors.muted }]}>
            {book.author} · {book.publisher} · {book.publishedYear > 0 ? book.publishedYear : "고전"}
          </Text>
          <View style={styles.genreRow}>
            <View style={[styles.genreBadge, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.genreText, { color: colors.primary }]}>{book.genre}</Text>
            </View>
          </View>

          {/* 평점 */}
          <View style={styles.ratingSection}>
            <Text style={[styles.ratingNum, { color: colors.foreground }]}>
              {avgRating.toFixed(1)}
            </Text>
            <StarRating rating={avgRating} size={20} />
            <Text style={[styles.reviewCountText, { color: colors.muted }]}>
              ({totalReviews.toLocaleString()}개 리뷰)
            </Text>
          </View>

          {/* 소개 */}
          <View style={styles.descSection}>
            <Text style={[styles.descTitle, { color: colors.foreground }]}>책 소개</Text>
            <Text
              style={[styles.descText, { color: colors.foreground }]}
              numberOfLines={descExpanded ? undefined : 3}
            >
              {book.description}
            </Text>
            <Pressable
              onPress={() => setDescExpanded(!descExpanded)}
              style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
            >
              <Text style={[styles.expandBtn, { color: colors.primary }]}>
                {descExpanded ? "접기 ▲" : "더보기 ▼"}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* 리뷰 섹션 */}
        <View style={[styles.reviewSection, { borderTopColor: colors.border }]}>
          <View style={styles.reviewHeader}>
            <Text style={[styles.reviewTitle, { color: colors.foreground }]}>
              리뷰 ({reviews.length})
            </Text>
            <Pressable
              onPress={() => router.push({ pathname: "/review", params: { bookId: book.id } })}
              style={({ pressed }) => [
                styles.writeReviewBtn,
                { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.75 : 1 },
              ]}
            >
              <Text style={[styles.writeReviewText, { color: colors.primary }]}>리뷰 작성</Text>
            </Pressable>
          </View>

          {reviews.length === 0 ? (
            <View style={styles.noReview}>
              <Text style={[styles.noReviewText, { color: colors.muted }]}>
                아직 리뷰가 없습니다. 첫 번째 리뷰를 작성해보세요!
              </Text>
            </View>
          ) : (
            reviews.map((review) => <ReviewCard key={review.id} review={review} />)
          )}
        </View>
      </ScrollView>

      {/* 하단 대여 버튼 */}
      <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <Pressable
          onPress={handleRent}
          style={({ pressed }) => [
            styles.rentBtn,
            {
              backgroundColor:
                rented ? colors.muted : book.isAvailable ? colors.primary : colors.muted,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Text style={styles.rentBtnText}>
            {rented ? "대여 중 (대여 탭에서 확인)" : book.isAvailable ? "대여 신청" : "대여 불가"}
          </Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    fontSize: 32,
    lineHeight: 36,
    fontWeight: "300",
  },
  navTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  heartBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  heartIcon: {
    fontSize: 24,
  },
  scroll: {
    paddingBottom: 100,
  },
  hero: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 16,
  },
  coverLarge: {
    width: 140,
    height: 190,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.5)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  coverEmoji: {
    fontSize: 72,
  },
  availBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  availText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  infoSection: {
    padding: 20,
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 32,
  },
  author: {
    fontSize: 14,
    lineHeight: 20,
  },
  genreRow: {
    flexDirection: "row",
    marginTop: 4,
  },
  genreBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  genreText: {
    fontSize: 12,
    fontWeight: "600",
  },
  ratingSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E0DDD6",
  },
  ratingNum: {
    fontSize: 28,
    fontWeight: "800",
  },
  reviewCountText: {
    fontSize: 13,
  },
  descSection: {
    marginTop: 12,
    gap: 8,
  },
  descTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  descText: {
    fontSize: 14,
    lineHeight: 22,
  },
  expandBtn: {
    fontSize: 13,
    fontWeight: "500",
  },
  reviewSection: {
    padding: 20,
    borderTopWidth: 1,
    gap: 12,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  writeReviewBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  writeReviewText: {
    fontSize: 13,
    fontWeight: "600",
  },
  noReview: {
    paddingVertical: 20,
    alignItems: "center",
  },
  noReviewText: {
    fontSize: 14,
    textAlign: "center",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
  },
  rentBtn: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  rentBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
