import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { StarRating } from "@/components/StarRating";
import { useColors } from "@/hooks/use-colors";
import { getBookById } from "@/data/books";
import { addReview, getProfile } from "@/store";
import { useState } from "react";

export default function WriteReviewScreen() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const colors = useColors();
  const router = useRouter();

  const book = getBookById(bookId ?? "");
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert("별점 필요", "별점을 선택해주세요.");
      return;
    }
    setSubmitting(true);
    try {
      const profile = await getProfile();
      await addReview(bookId ?? "", rating, text, profile.nickname);
      Alert.alert("리뷰 등록 완료", "리뷰가 등록되었습니다.", [
        { text: "확인", onPress: () => router.back() },
      ]);
    } finally {
      setSubmitting(false);
    }
  };

  if (!book) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text style={{ color: colors.muted }}>도서를 찾을 수 없습니다.</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      {/* 네비게이션 바 */}
      <View style={[styles.navBar, { borderBottomColor: colors.border }]}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
        >
          <Text style={[styles.cancelText, { color: colors.muted }]}>취소</Text>
        </Pressable>
        <Text style={[styles.navTitle, { color: colors.foreground }]}>리뷰 작성</Text>
        <Pressable
          onPress={handleSubmit}
          disabled={submitting}
          style={({ pressed }) => [{ opacity: pressed || submitting ? 0.6 : 1 }]}
        >
          <Text style={[styles.submitText, { color: colors.primary }]}>
            {submitting ? "등록 중..." : "등록"}
          </Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* 도서 정보 */}
          <View style={[styles.bookRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.miniCover, { backgroundColor: book.coverColor, borderColor: colors.border }]}>
              <Text style={styles.emoji}>{book.coverEmoji}</Text>
            </View>
            <View style={styles.bookInfo}>
              <Text style={[styles.bookTitle, { color: colors.foreground }]} numberOfLines={2}>
                {book.title}
              </Text>
              <Text style={[styles.bookAuthor, { color: colors.muted }]}>{book.author}</Text>
            </View>
          </View>

          {/* 별점 */}
          <View style={[styles.ratingSection, { borderBottomColor: colors.border }]}>
            <Text style={[styles.sectionLabel, { color: colors.foreground }]}>별점</Text>
            <View style={styles.starsRow}>
              <StarRating rating={rating} size={40} interactive onRate={setRating} />
            </View>
            <Text style={[styles.ratingHint, { color: colors.muted }]}>
              {rating === 0
                ? "별점을 선택해주세요"
                : rating === 1
                ? "별로예요"
                : rating === 2
                ? "그저 그래요"
                : rating === 3
                ? "보통이에요"
                : rating === 4
                ? "좋아요"
                : "최고예요!"}
            </Text>
          </View>

          {/* 리뷰 텍스트 */}
          <View style={styles.textSection}>
            <Text style={[styles.sectionLabel, { color: colors.foreground }]}>리뷰 내용 (선택)</Text>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="이 책에 대한 솔직한 리뷰를 남겨주세요..."
              placeholderTextColor={colors.muted}
              style={[
                styles.textInput,
                {
                  color: colors.foreground,
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              maxLength={500}
            />
            <Text style={[styles.charCount, { color: colors.muted }]}>{text.length}/500</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  cancelText: {
    fontSize: 16,
  },
  navTitle: {
    fontSize: 17,
    fontWeight: "700",
  },
  submitText: {
    fontSize: 16,
    fontWeight: "700",
  },
  scroll: {
    padding: 20,
    gap: 24,
  },
  bookRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  miniCover: {
    width: 56,
    height: 74,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 30,
  },
  bookInfo: {
    flex: 1,
    gap: 4,
  },
  bookTitle: {
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 22,
  },
  bookAuthor: {
    fontSize: 13,
  },
  ratingSection: {
    alignItems: "center",
    paddingBottom: 24,
    borderBottomWidth: 1,
    gap: 12,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "700",
    alignSelf: "flex-start",
  },
  starsRow: {
    marginVertical: 8,
  },
  ratingHint: {
    fontSize: 14,
  },
  textSection: {
    gap: 10,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    lineHeight: 22,
    minHeight: 140,
  },
  charCount: {
    fontSize: 12,
    textAlign: "right",
  },
});
