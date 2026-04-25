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
import { RentalCard } from "@/components/RentalCard";
import { useColors } from "@/hooks/use-colors";
import { getActiveRentals, getRentalHistory, returnBook, extendRental, type RentalRecord } from "@/store";
import { getBookById } from "@/data/books";
import { useState, useEffect, useCallback } from "react";

export default function RentalScreen() {
  const colors = useColors();
  const router = useRouter();
  const [tab, setTab] = useState<"active" | "history">("active");
  const [activeRentals, setActiveRentals] = useState<RentalRecord[]>([]);
  const [historyRentals, setHistoryRentals] = useState<RentalRecord[]>([]);

  const loadData = useCallback(async () => {
    const [active, history] = await Promise.all([
      getActiveRentals(),
      getRentalHistory(),
    ]);
    setActiveRentals(active);
    setHistoryRentals(history);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleReturn = (rentalId: string, bookTitle: string) => {
    Alert.alert("반납 신청", `"${bookTitle}"을(를) 반납 신청하시겠습니까?`, [
      { text: "취소", style: "cancel" },
      {
        text: "반납 신청",
        style: "destructive",
        onPress: async () => {
          await returnBook(rentalId);
          await loadData();
        },
      },
    ]);
  };

  const handleExtend = (rentalId: string, bookTitle: string) => {
    Alert.alert("대여 연장", `"${bookTitle}" 대여 기간을 7일 연장하시겠습니까?`, [
      { text: "취소", style: "cancel" },
      {
        text: "연장",
        onPress: async () => {
          await extendRental(rentalId);
          await loadData();
          Alert.alert("연장 완료", "7일 연장되었습니다.");
        },
      },
    ]);
  };

  const goToBook = (id: string) => {
    router.push({ pathname: "/book/[id]", params: { id } });
  };

  const currentList = tab === "active" ? activeRentals : historyRentals;

  return (
    <ScreenContainer>
      {/* 헤더 */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>대여 현황</Text>
      </View>

      {/* 탭 */}
      <View style={[styles.tabRow, { borderBottomColor: colors.border }]}>
        {(["active", "history"] as const).map((t) => (
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
              {t === "active"
                ? `대여 중 (${activeRentals.length})`
                : `대여 이력 (${historyRentals.length})`}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* 목록 */}
      <FlatList
        data={currentList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const book = getBookById(item.bookId);
          if (!book) return null;
          if (tab === "active") {
            return (
              <RentalCard
                rental={item}
                book={book}
                onReturn={() => handleReturn(item.id, book.title)}
                onExtend={() => handleExtend(item.id, book.title)}
                onBookPress={() => goToBook(book.id)}
              />
            );
          }
          // 이력 아이템
          const returnedDate = item.returnedAt
            ? new Date(item.returnedAt).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "";
          return (
            <Pressable
              onPress={() => goToBook(book.id)}
              style={({ pressed }) => [
                styles.historyItem,
                {
                  backgroundColor: colors.surface,
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
              <View style={styles.historyInfo}>
                <Text style={[styles.historyTitle, { color: colors.foreground }]} numberOfLines={1}>
                  {book.title}
                </Text>
                <Text style={[styles.historyAuthor, { color: colors.muted }]}>{book.author}</Text>
                <Text style={[styles.historyDate, { color: colors.muted }]}>
                  반납 완료 · {returnedDate}
                </Text>
              </View>
              <View style={[styles.returnedBadge, { backgroundColor: colors.success + "22" }]}>
                <Text style={[styles.returnedText, { color: colors.success }]}>반납완료</Text>
              </View>
            </Pressable>
          );
        }}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>{tab === "active" ? "📚" : "📋"}</Text>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              {tab === "active" ? "대여 중인 도서가 없습니다" : "대여 이력이 없습니다"}
            </Text>
            <Text style={[styles.emptyDesc, { color: colors.muted }]}>
              {tab === "active"
                ? "홈에서 마음에 드는 도서를 찾아보세요"
                : "도서를 대여하면 이력이 기록됩니다"}
            </Text>
            {tab === "active" && (
              <Pressable
                onPress={() => router.push("/(tabs)/explore")}
                style={({ pressed }) => [
                  styles.exploreBtn,
                  { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <Text style={styles.exploreBtnText}>도서 탐색하기</Text>
              </Pressable>
            )}
          </View>
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
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
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    gap: 12,
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
  historyInfo: {
    flex: 1,
    gap: 3,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  historyAuthor: {
    fontSize: 12,
  },
  historyDate: {
    fontSize: 11,
    marginTop: 2,
  },
  returnedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  returnedText: {
    fontSize: 11,
    fontWeight: "600",
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
  exploreBtn: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  exploreBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
