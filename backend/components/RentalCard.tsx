import { View, Text, Pressable, StyleSheet } from "react-native";
import { useColors } from "@/hooks/use-colors";
import type { RentalRecord } from "@/store";
import { daysUntilDue } from "@/store";
import type { Book } from "@/data/books";

interface RentalCardProps {
  rental: RentalRecord;
  book: Book;
  onReturn: () => void;
  onExtend: () => void;
  onBookPress: () => void;
}

export function RentalCard({ rental, book, onReturn, onExtend, onBookPress }: RentalCardProps) {
  const colors = useColors();
  const days = daysUntilDue(rental.dueDate);
  const isOverdue = days < 0;
  const isUrgent = days >= 0 && days <= 3;

  const badgeColor = isOverdue ? colors.error : isUrgent ? "#F59E0B" : colors.success;
  const badgeText = isOverdue ? `${Math.abs(days)}일 초과` : `D-${days}`;

  const dueDateStr = new Date(rental.dueDate).toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
  });
  const rentedDateStr = new Date(rental.rentedAt).toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
  });

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      {/* 도서 정보 */}
      <Pressable
        onPress={onBookPress}
        style={({ pressed }) => [styles.bookRow, { opacity: pressed ? 0.75 : 1 }]}
      >
        <View
          style={[
            styles.cover,
            { backgroundColor: book.coverColor, borderColor: colors.border },
          ]}
        >
          <Text style={styles.emoji}>{book.coverEmoji}</Text>
        </View>
        <View style={styles.bookInfo}>
          <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={2}>
            {book.title}
          </Text>
          <Text style={[styles.author, { color: colors.muted }]}>{book.author}</Text>
          <View style={styles.dateRow}>
            <Text style={[styles.dateLabel, { color: colors.muted }]}>대여일 {rentedDateStr}</Text>
          </View>
          <View style={styles.dueRow}>
            <Text style={[styles.dateLabel, { color: colors.muted }]}>반납기한 {dueDateStr}</Text>
            <View style={[styles.badge, { backgroundColor: badgeColor + "22" }]}>
              <Text style={[styles.badgeText, { color: badgeColor }]}>{badgeText}</Text>
            </View>
          </View>
        </View>
      </Pressable>

      {/* 액션 버튼 */}
      <View style={styles.actions}>
        <Pressable
          onPress={onExtend}
          style={({ pressed }) => [
            styles.extendBtn,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
              opacity: pressed ? 0.75 : 1,
            },
          ]}
        >
          <Text style={[styles.extendText, { color: colors.foreground }]}>7일 연장</Text>
        </Pressable>
        <Pressable
          onPress={onReturn}
          style={({ pressed }) => [
            styles.returnBtn,
            { backgroundColor: colors.primary, opacity: pressed ? 0.75 : 1 },
          ]}
        >
          <Text style={styles.returnText}>반납 신청</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    overflow: "hidden",
  },
  bookRow: {
    flexDirection: "row",
    padding: 14,
    gap: 12,
  },
  cover: {
    width: 64,
    height: 84,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 32,
  },
  bookInfo: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 22,
  },
  author: {
    fontSize: 13,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  dueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dateLabel: {
    fontSize: 12,
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  actions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#E0DDD6",
  },
  extendBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: "#E0DDD6",
  },
  extendText: {
    fontSize: 14,
    fontWeight: "500",
  },
  returnBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  returnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
});
