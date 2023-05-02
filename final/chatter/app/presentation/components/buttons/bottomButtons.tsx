import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { PrimaryButton } from "./buttons";
import { primary } from "../../theme/colors";
import { headerFontStyle } from "../../theme/element-styles/textStyles";

interface BottomButtonProps {
  children: ReactNode;
}

export default function BottomButton({ children }: BottomButtonProps) {
  return (
    <View style={styles.container}>
      <PrimaryButton
        containerStyle={styles.button}
        txtStyle={headerFontStyle(true)}
      >
        {children}
      </PrimaryButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    right: 0,
    padding: 25,
  },
  button: {
    backgroundColor: primary(),
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 25,
  },
});
