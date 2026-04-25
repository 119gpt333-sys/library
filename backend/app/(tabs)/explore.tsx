import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Pressable,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { CategoryChip } from "@/components/CategoryChip";
import { BookListItem } from "@/components/BookListItem";
import { useColors } from "@/hooks/use-colors";
import { BOOKS, GENRES, searchBooks, getBooksByGenre, type Genre } from "@/data/books";
import { useState, useMemo } from "react";

export default function ExploreScreen() {
  const colors = useColors();
  const router = useRouter();
  const params = useLocalSearchParams<{ genre?: string }>();

  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(
    (params.genre as Genre) || null
  );
  const [sortBy, setSortBy] = useState<"rating" | "newest" | "reviews">("rating");

  const filteredBooks = useMemo(() => {
    let books = query
      ? searchBooks(query)
      : selectedGenre
      ? getBooksByGenre(selectedGenre)
      : BOOKS;

    switch (sortBy) {
      case "rating":
        return [...books].sort((a, b) => b.rating - a.rating);
      case "newest":
        return [...books].sort((a, b) => b.publishedYear - a.publishedYear);
      case "reviews":
        return [...books].sort((a, b) => b.reviewCount - a.reviewCount);
    }
  }, [query, selectedGenre, sortBy]);

  const goToBook = (id: string) => {
    router.push({ pathname: "/book/[id]", params: { id } });
  };

  return (
    <ScreenContainer>
      {/* 검색 바 */}
      <View
        style={[
          styles.searchBar,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.searchIcon, { color: colors.muted }]}>🔍</Text>
        <TextInput
          value={query}
          onChangeText={(t) => {
            setQuery(t);
            if (t) setSelectedGenre(null);
          }}
          placeholder="제목, 저자, 장르 검색..."
          placeholderTextColor={colors.muted}
          style={[styles.input, { color: colors.foreground }]}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery("")}>
            <Text style={[styles.clearBtn, { color: colors.muted }]}>✕</Text>
          </Pressable>
        )}
      </View>

      {/* 장르 필터 */}
      {!query && (
        <FlatList
          data={["전체", ...GENRES]}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <CategoryChip
              label={item}
              selected={
                item === "전체" ? !selectedGenre : selectedGenre === item
              }
              onPress={() =>
                setSelectedGenre(item === "전체" ? null : (item as Genre))
              }
            />
          )}
          contentContainerStyle={styles.genreList}
        />
      )}

      {/* 정렬 옵션 */}
      <View style={[styles.sortRow, { borderBottomColor: colors.border }]}>
        <Text style={[styles.resultCount, { color: colors.muted }]}>
          {filteredBooks.length}권
        </Text>
        <View style={styles.sortBtns}>
          {(["rating", "newest", "reviews"] as const).map((s) => (
            <Pressable
              key={s}
              onPress={() => setSortBy(s)}
              style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
            >
              <Text
                style={[
                  styles.sortBtn,
                  {
                    color: sortBy === s ? colors.primary : colors.muted,
                    fontWeight: sortBy === s ? "700" : "400",
                  },
                ]}
              >
                {s === "rating" ? "평점순" : s === "newest" ? "최신순" : "리뷰순"}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* 도서 목록 */}
      <FlatList
        data={filteredBooks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BookListItem book={item} onPress={() => goToBook(item.id)} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📭</Text>
            <Text style={[styles.emptyText, { color: colors.muted }]}>
              검색 결과가 없습니다
            </Text>
          </View>
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  searchIcon: {
    fontSize: 16,
  },
  input: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },
  clearBtn: {
    fontSize: 14,
    padding: 2,
  },
  genreList: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  sortRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  resultCount: {
    fontSize: 13,
  },
  sortBtns: {
    flexDirection: "row",
    gap: 14,
  },
  sortBtn: {
    fontSize: 13,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  empty: {
    alignItems: "center",
    paddingTop: 60,
    gap: 12,
  },
  emptyEmoji: {
    fontSize: 48,
  },
  emptyText: {
    fontSize: 15,
  },
});
