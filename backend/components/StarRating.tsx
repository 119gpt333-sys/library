import { View, Text, Pressable, StyleSheet } from "react-native";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

export function StarRating({
  rating,
  maxStars = 5,
  size = 20,
  interactive = false,
  onRate,
}: StarRatingProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: maxStars }, (_, i) => {
        const filled = i < Math.round(rating);
        return (
          <Pressable
            key={i}
            onPress={() => interactive && onRate?.(i + 1)}
            style={({ pressed }) => [{ opacity: pressed && interactive ? 0.6 : 1 }]}
            disabled={!interactive}
          >
            <Text style={[styles.star, { fontSize: size, color: filled ? "#C4873A" : "#D4C9B8" }]}>
              ★
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 2,
  },
  star: {
    lineHeight: undefined,
  },
});
