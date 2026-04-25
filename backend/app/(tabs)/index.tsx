import { ScrollView, View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { BookCard } from "@/components/BookCard";
import { BookListItem } from "@/components/BookListItem";
import { SectionHeader } from "@/components/SectionHeader";
import { CategoryChip } from "@/components/CategoryChip";
import { useColors } from "@/hooks/use-colors";
import { getFeaturedBooks, getNewBooks, getTopRatedBooks, GENRES } from "@/data/books";
import { useState } from "react";

const featuredBooks = getFeaturedBooks();
const newBooks = getNewBooks();
const topBooks = getTopRatedBooks(5);

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const goToBook = (id: string) => {
    router.push({ pathname: "/book/[id]", params: { id } });
  };

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.appName, { color: colors.primary }]}>도서기록</Text>
            <Text style={[styles.subtitle, { color: colors.muted }]}>오늘도 좋은 책 한 권 어떠세요?</Text>
          </View>
          <Pressable
            onPress={() => router.push("/(tabs)/explore")}
            style={({ pressed }) => [
              styles.searchBtn,
              { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Text style={{ fontSize: 18 }}>🔍</Text>
          </Pressable>
        </View>

        {/* 이달의 추천 도서 배너 */}
        <View style={styles.section}>
          <SectionHeader title="✨ 이달의 추천 도서" />
          <FlatList
            data={featuredBooks}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <BookCard book={item} onPress={() => goToBook(item.id)} size="lg" />
            )}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* 신착 도서 */}
        <View style={styles.section}>
          <SectionHeader
            title="🆕 신착 도서"
            onMore={() => router.push("/(tabs)/explore")}
          />
          <FlatList
            data={newBooks}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <BookCard book={item} onPress={() => goToBook(item.id)} size="md" />
            )}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* 장르별 탐색 */}
        <View style={styles.section}>
          <SectionHeader title="📚 장르별 탐색" />
          <FlatList
            data={["전체", ...GENRES]}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <CategoryChip
                label={item}
                selected={selectedGenre === item || (item === "전체" && !selectedGenre)}
                onPress={() => {
                  if (item === "전체") {
                    setSelectedGenre(null);
                    router.push("/(tabs)/explore");
                  } else {
                    setSelectedGenre(item);
                    router.push({ pathname: "/(tabs)/explore", params: { genre: item } });
                  }
                }}
              />
            )}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* 인기 도서 TOP 5 */}
        <View style={styles.section}>
          <SectionHeader
            title="🏆 인기 도서 TOP 5"
            onMore={() => router.push("/(tabs)/explore")}
          />
          {topBooks.map((book, index) => (
            <BookListItem
              key={book.id}
              book={book}
              rank={index + 1}
              onPress={() => goToBook(book.id)}
            />
          ))}
        </View>

        {/* 커뮤니티 배너 */}
        <Pressable
          onPress={() => router.push("/(tabs)/community")}
          style={({ pressed }) => [
            styles.communityBanner,
            { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Text style={styles.bannerTitle}>💬 독서 커뮤니티</Text>
          <Text style={styles.bannerSub}>다른 독자들의 추천과 리뷰를 확인해보세요</Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  appName: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  searchBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  horizontalList: {
    paddingRight: 20,
  },
  communityBanner: {
    marginHorizontal: 20,
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
    gap: 6,
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  bannerSub: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
  },
});
