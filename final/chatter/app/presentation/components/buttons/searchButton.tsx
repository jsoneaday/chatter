import React, { ReactNode } from "react";
import { StyleSheet } from "react-native";
import { PrimaryButton } from "./buttons";
import { headerFontStyle } from "../../theme/element-styles/textStyles";
import { notSelected, tertiary } from "../../theme/colors";

interface SearchButtonProps {
  children: ReactNode;
}

export default function SearchButton({ children }: SearchButtonProps) {
  return (
    <PrimaryButton
      containerStyle={styles.button}
      txtStyle={{ ...headerFontStyle(), color: notSelected(0.5) }}
    >
      {children}
    </PrimaryButton>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    backgroundColor: tertiary(false, 0.1),
    paddingTop: 12,
    paddingBottom: 12,
    borderRadius: 25,
  },
});
