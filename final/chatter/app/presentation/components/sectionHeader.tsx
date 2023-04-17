import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";
import { subHeaderFontStyle } from "../theme/element-styles/textStyles";
import { ReactNode } from "react";

interface SectionHeaderProps {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
}

export default function SectionHeader({
  children,
  style = {},
}: SectionHeaderProps) {
  return (
    <Text style={{ ...(style as object), ...styles.container }}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  container: {
    ...(subHeaderFontStyle as object),
    fontWeight: "800",
  },
});
