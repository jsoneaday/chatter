import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";
import { headerFontStyle } from "../../theme/element-styles/textStyles";
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
    <Text style={{ ...styles.container, ...(style as object) }}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  container: {
    ...(headerFontStyle() as object),
    fontWeight: "bold",
  },
});
