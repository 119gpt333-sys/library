// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * SF Symbols → Material Icons mapping for 도서기록 app
 */
const MAPPING = {
  // Default
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  // 도서기록 tabs
  "book.fill": "menu-book",
  "magnifyingglass": "search",
  "books.vertical.fill": "library-books",
  "bubble.left.and.bubble.right.fill": "forum",
  "person.fill": "person",
  // 도서기록 actions
  "heart.fill": "favorite",
  "heart": "favorite-border",
  "star.fill": "star",
  "arrow.left": "arrow-back",
  "xmark": "close",
  "plus": "add",
  "checkmark": "check",
  "clock.fill": "history",
  "bookmark.fill": "bookmark",
  "bookmark": "bookmark-border",
  "square.and.arrow.up": "share",
  "pencil": "edit",
  "trash": "delete",
  "ellipsis": "more-horiz",
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
