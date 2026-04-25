import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  Pressable,
  Alert,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { BookCard } from "@/components/BookCard";
import { ReviewCard } from "@/components/ReviewCard";
import { useColors } from "@/hooks/use-colors";
import {
  getProfile,
  updateNickname,
  getWishlist,
  getReviews,
  getRentals,
  type UserProfile,
  type Review,
  type RentalRecord,
} from "@/store";
import { getBookById } from "@/data/books";
import { useState, useEffect, useCallback } from "react";

export default function MyScreen() {
  const colors = useColors();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>({ nickname: "독서가", joinedAt: "" });
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [myReviews, setMyReviews] = useState<Review[]>([]);
  const [rentals, setRentals] = useState<RentalRecord[]>([]);
  const [editingNickname, setEditingNickname] = useState(false);
  const [nicknameInput, setNicknameInput] = useState("");
  const [activeSection, setActiveSection] = useState<"wishlist" | "reviews">("wishlist");

  const loadData = useCallback(async () => {
    const [p, w, r, allRentals] = await Promise.all([
      getProfile(),
      getWishlist(),
      getReviews(),
      getRentals(),
    ]);
    setProfile(p);
    setWishlist(w);
    setMyReviews(r.filter((rv) => rv.nickname === p.nickname));
    setRentals(allRentals);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSaveNickname = async () => {
    if (!nicknameInput.trim()) return;
    await updateNickname(nicknameInput.trim());
    setEditingNickname(false);
    await loadData();
  };

  const goToBook = (id: string) => {
    router.push({ pathname: "/book/[id]", params: { id } });
  };

  const totalRentals = rentals.length;
  const returnedRentals = rentals.filter((r) => r.status === "returned").length;
  const activeRentals = rentals.filter((r) => r.status === "active").length;

  const joinedDate = profile.joinedAt
    ? new Date(profile.joinedAt).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
      })
    : "";

  const wishlistBooks = wishlist
    .map((id) => getBookById(id))
    .filter(Boolean) as NonNullable<ReturnType<typeof getBookById>>[];

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* 프로필 섹션 */}
        <View style={[styles.profileSection, { backgroundColor: colors.primary }]}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeText}>{profile.nickname[0]}</Text>
          </View>
          {editingNickname ? (
            <View style={styles.editRow}>
              <TextInput
                value={nicknameInput}
                onChangeText={setNicknameInput}
                style={[styles.nicknameInput, { color: "#fff", borderColor: "rgba(255,255,255,0.5)" }]}
                placeholder="닉네임 입력"
                placeholderTextColor="rgba(255,255,255,0.6)"
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleSaveNickname}
              />
              <Pressable onPress={handleSaveNickname} style={styles.saveBtn}>
                <Text style={styles.saveBtnText}>저장</Text>
              </Pressable>
              <Pressable onPress={() => setEditingNickname(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>취소</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={() => {
                setNicknameInput(profile.nickname);
                setEditingNickname(true);
              }}
              style={styles.nicknameRow}
            >
              <Text style={styles.nickname}>{profile.nickname}</Text>
              <Text style={styles.editIcon}>✏️</Text>
            </Pressable>
          )}
          {joinedDate && (
            <Text style={styles.joinedDate}>{joinedDate} 가입</Text>
          )}
        </View>

        {/* 통계 카드 */}
        <View style={[styles.statsRow, { borderBottomColor: colors.border }]}>
          {[
            { label: "총 대여", value: totalRentals },
            { label: "대여 중", value: activeRentals },
            { label: "반납 완료", value: returnedRentals },
            { label: "찜한 책", value: wishlist.length },
          ].map((stat) => (
            <View key={stat.label} style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* 섹션 탭 */}
        <View style={[styles.sectionTabRow, { borderBottomColor: colors.border }]}>
          {(["wishlist", "reviews"] as const).map((s) => (
            <Pressable
              key={s}
              onPress={() => setActiveSection(s)}
              style={[
                styles.sectionTab,
                {
                  borderBottomColor: activeSection === s ? colors.primary : "transparent",
                  borderBottomWidth: 2,
                },
              ]}
            >
              <Text
                style={[
                  styles.sectionTabText,
                  {
                    color: activeSection === s ? colors.primary : colors.muted,
                    fontWeight: activeSection === s ? "700" : "400",
                  },
                ]}
              >
                {s === "wishlist" ? `찜한 도서 (${wishlist.length})` : `내 리뷰 (${myReviews.length})`}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* 찜한 도서 */}
        {activeSection === "wishlist" && (
          <View style={styles.sectionContent}>
            {wishlistBooks.length === 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyEmoji}>🔖</Text>
                <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
                  찜한 도서가 없습니다
                </Text>
                <Text style={[styles.emptyDesc, { color: colors.muted }]}>
                  도서 상세 페이지에서 하트를 눌러 찜해보세요
                </Text>
              </View>
            ) : (
              <FlatList
                data={wishlistBooks}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <BookCard book={item} onPress={() => goToBook(item.id)} size="md" />
                )}
                contentContainerStyle={styles.horizontalList}
                scrollEnabled={false}
              />
            )}
          </View>
        )}

        {/* 내 리뷰 */}
        {activeSection === "reviews" && (
          <View style={styles.sectionContent}>
            {myReviews.length === 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyEmoji}>📝</Text>
                <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
                  작성한 리뷰가 없습니다
                </Text>
                <Text style={[styles.emptyDesc, { color: colors.muted }]}>
                  도서 상세 페이지에서 리뷰를 작성해보세요
                </Text>
              </View>
            ) : (
              myReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))
            )}
          </View>
        )}

        {/* 설정 메뉴 */}
        <View style={[styles.settingsSection, { borderTopColor: colors.border }]}>
          <Text style={[styles.settingsTitle, { color: colors.muted }]}>설정</Text>
          {[
            { icon: "🔔", label: "알림 설정" },
            { icon: "🌙", label: "다크 모드" },
            { icon: "❓", label: "도움말" },
            { icon: "ℹ️", label: "앱 정보" },
          ].map((item) => (
            <Pressable
              key={item.label}
              style={({ pressed }) => [
                styles.settingsItem,
                { borderBottomColor: colors.border, opacity: pressed ? 0.6 : 1 },
              ]}
              onPress={() => Alert.alert(item.label, "준비 중인 기능입니다.")}
            >
              <Text style={styles.settingsIcon}>{item.icon}</Text>
              <Text style={[styles.settingsLabel, { color: colors.foreground }]}>{item.label}</Text>
              <Text style={[styles.settingsChevron, { color: colors.muted }]}>›</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 32,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 20,
    gap: 10,
  },
  avatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  avatarLargeText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "700",
  },
  nicknameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  nickname: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  editIcon: {
    fontSize: 16,
  },
  editRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  nicknameInput: {
    fontSize: 18,
    fontWeight: "600",
    borderBottomWidth: 1,
    paddingBottom: 4,
    minWidth: 120,
    textAlign: "center",
  },
  saveBtn: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  cancelBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  cancelBtnText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
  },
  joinedDate: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
  },
  statsRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    gap: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
  },
  statLabel: {
    fontSize: 11,
  },
  sectionTabRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  sectionTab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
  },
  sectionTabText: {
    fontSize: 14,
  },
  sectionContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  horizontalList: {
    paddingRight: 16,
  },
  empty: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 8,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  emptyDesc: {
    fontSize: 13,
    textAlign: "center",
  },
  settingsSection: {
    marginTop: 24,
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  settingsTitle: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  settingsIcon: {
    fontSize: 18,
    width: 24,
    textAlign: "center",
  },
  settingsLabel: {
    flex: 1,
    fontSize: 15,
  },
  settingsChevron: {
    fontSize: 22,
    fontWeight: "300",
  },
});
