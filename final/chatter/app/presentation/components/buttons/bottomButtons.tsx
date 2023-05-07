import React, { ReactNode } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { PrimaryButton } from "./buttons";
import { primary, tertiary } from "../../theme/colors";
import { headerFontStyle } from "../../theme/element-styles/textStyles";

interface BottomButtonProps {
  children: ReactNode;
  onPressBottomButton: () => void;
  isInverted?: boolean;
}

export default function BottomButton({
  children,
  onPressBottomButton,
  isInverted = false,
}: BottomButtonProps) {
  return (
    <View style={styles.container}>
      {/* View container used to stretch button full width */}
      <PrimaryButton
        onPress={onPressBottomButton}
        containerStyle={{
          ...styles.button,
          backgroundColor: primary(isInverted),
          borderColor: tertiary(true, 0.5),
          borderWidth: isInverted ? 1 : 0,
        }}
        txtStyle={headerFontStyle(!isInverted)}
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
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 25,
  },
});
