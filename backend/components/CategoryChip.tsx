import { Pressable, Text, StyleSheet } from "react-native";
import { useColors } from "@/hooks/use-colors";

interface CategoryChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
}

export function CategoryChip({ label, selected = false, onPress }: CategoryChipProps) {
  const colors = useColors();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? colors.primary : colors.surface,
          borderColor: selected ? colors.primary : colors.border,
          opacity: pressed ? 0.75 : 1,
          transform: [{ scale: pressed ? 0.96 : 1 }],
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: selected ? "#fff" : colors.foreground },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
  },
});
