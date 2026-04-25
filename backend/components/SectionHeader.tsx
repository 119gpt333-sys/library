import { View, Text, Pressable, StyleSheet } from "react-native";
import { useColors } from "@/hooks/use-colors";

interface SectionHeaderProps {
  title: string;
  onMore?: () => void;
}

export function SectionHeader({ title, onMore }: SectionHeaderProps) {
  const colors = useColors();

  return (
    <View style={styles.row}>
      <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
      {onMore && (
        <Pressable
          onPress={onMore}
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
        >
          <Text style={[styles.more, { color: colors.primary }]}>더보기</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  more: {
    fontSize: 13,
    fontWeight: "500",
  },
});
