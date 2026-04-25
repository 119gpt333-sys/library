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
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { BOOKS, searchBooks, type Book } from "@/data/books";
import { addRecommendation, getProfile } from "@/store";
import { useState } from "react";

export default function RecommendScreen() {
  const colors = useColors();
  const router = useRouter();

  const [step, setStep] = useState<"select" | "write">("select");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const searchResults = searchQuery
    ? searchBooks(searchQuery)
    : BOOKS.slice(0, 8);

  const handleSubmit = async () => {
    if (!selectedBook) return;
    if (!reason.trim()) {
      Alert.alert("추천 이유 필요", "추천 이유를 입력해주세요.");
      return;
    }
    setSubmitting(true);
    try {
      const profile = await getProfile();
      await addRecommendation(selectedBook.id, reason.trim(), profile.nickname);
      Alert.alert("추천 등록 완료", "도서 추천이 등록되었습니다!", [
        { text: "확인", onPress: () => router.back() },
      ]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      {/* 네비게이션 바 */}
      <View style={[styles.navBar, { borderBottomColor: colors.border }]}>
        <Pressable
          onPress={() => {
            if (step === "write") {
              setStep("select");
            } else {
              router.back();
            }
          }}
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
        >
          <Text style={[styles.backText, { color: colors.muted }]}>
            {step === "write" ? "‹ 뒤로" : "취소"}
          </Text>
        </Pressable>
        <Text style={[styles.navTitle, { color: colors.foreground }]}>도서 추천</Text>
        {step === "write" ? (
          <Pressable
            onPress={handleSubmit}
            disabled={submitting}
            style={({ pressed }) => [{ opacity: pressed || submitting ? 0.6 : 1 }]}
          >
            <Text style={[styles.submitText, { color: colors.primary }]}>
              {submitting ? "등록 중..." : "등록"}
            </Text>
          </Pressable>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      {/* 단계 표시 */}
      <View style={[styles.stepRow, { borderBottomColor: colors.border }]}>
        <View style={[styles.stepDot, { backgroundColor: colors.primary }]} />
        <View style={[styles.stepLine, { backgroundColor: step === "write" ? colors.primary : colors.border }]} />
        <View style={[styles.stepDot, { backgroundColor: step === "write" ? colors.primary : colors.border }]} />
        <Text style={[styles.stepText, { color: colors.muted }]}>
          {step === "select" ? "1. 도서 선택" : "2. 추천 이유 작성"}
        </Text>
      </View>

      {/* 도서 선택 단계 */}
      {step === "select" && (
        <View style={{ flex: 1 }}>
          <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={{ color: colors.muted, fontSize: 16 }}>🔍</Text>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="추천할 도서를 검색하세요..."
              placeholderTextColor={colors.muted}
              style={[styles.searchInput, { color: colors.foreground }]}
              returnKeyType="search"
            />
          </View>

          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  setSelectedBook(item);
                  setStep("write");
                }}
                style={({ pressed }) => [
                  styles.bookItem,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    opacity: pressed ? 0.75 : 1,
                  },
                ]}
              >
                <View style={[styles.miniCover, { backgroundColor: item.coverColor, borderColor: colors.border }]}>
                  <Text style={styles.emoji}>{item.coverEmoji}</Text>
                </View>
                <View style={styles.bookInfo}>
                  <Text style={[styles.bookTitle, { color: colors.foreground }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={[styles.bookAuthor, { color: colors.muted }]}>{item.author}</Text>
                  <Text style={[styles.bookGenre, { color: colors.primary }]}>{item.genre}</Text>
                </View>
                <Text style={[styles.chevron, { color: colors.muted }]}>›</Text>
              </Pressable>
            )}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      {/* 추천 이유 작성 단계 */}
      {step === "write" && selectedBook && (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.writeScroll}>
            {/* 선택된 도서 */}
            <View style={[styles.selectedBook, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.selectedCover, { backgroundColor: selectedBook.coverColor, borderColor: colors.border }]}>
                <Text style={styles.selectedEmoji}>{selectedBook.coverEmoji}</Text>
              </View>
              <View style={styles.selectedInfo}>
                <Text style={[styles.selectedTitle, { color: colors.foreground }]} numberOfLines={2}>
                  {selectedBook.title}
                </Text>
                <Text style={[styles.selectedAuthor, { color: colors.muted }]}>
                  {selectedBook.author}
                </Text>
              </View>
            </View>

            {/* 추천 이유 */}
            <View style={styles.reasonSection}>
              <Text style={[styles.reasonLabel, { color: colors.foreground }]}>
                이 책을 추천하는 이유를 알려주세요
              </Text>
              <TextInput
                value={reason}
                onChangeText={setReason}
                placeholder="이 책의 어떤 점이 좋았나요? 어떤 분께 추천하고 싶으신가요?"
                placeholderTextColor={colors.muted}
                style={[
                  styles.reasonInput,
                  {
                    color: colors.foreground,
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                maxLength={300}
                autoFocus
              />
              <Text style={[styles.charCount, { color: colors.muted }]}>{reason.length}/300</Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
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
  backText: {
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
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 8,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  stepLine: {
    flex: 1,
    height: 2,
    borderRadius: 1,
  },
  stepText: {
    fontSize: 13,
    marginLeft: 4,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  bookItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    gap: 12,
  },
  miniCover: {
    width: 48,
    height: 64,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 26,
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
  bookGenre: {
    fontSize: 11,
    fontWeight: "500",
  },
  chevron: {
    fontSize: 22,
    fontWeight: "300",
  },
  writeScroll: {
    padding: 20,
    gap: 20,
  },
  selectedBook: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  selectedCover: {
    width: 60,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedEmoji: {
    fontSize: 32,
  },
  selectedInfo: {
    flex: 1,
    gap: 4,
  },
  selectedTitle: {
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 22,
  },
  selectedAuthor: {
    fontSize: 13,
  },
  reasonSection: {
    gap: 10,
  },
  reasonLabel: {
    fontSize: 16,
    fontWeight: "700",
  },
  reasonInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    lineHeight: 22,
    minHeight: 160,
  },
  charCount: {
    fontSize: 12,
    textAlign: "right",
  },
});
