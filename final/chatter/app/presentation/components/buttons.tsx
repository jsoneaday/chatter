import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";
import {
  primaryButtonStyle,
  secondaryButtonStyle,
  txtPrimaryFont,
  txtSecondaryFont,
} from "../theme/element-styles/buttonStyles";
import React, { ReactNode } from "react";
import { secondary } from "../theme/colors";

export interface ButtonProps {
  children: ReactNode;
  containerStyle?: object;
  txtStyle?: object;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
}

export function PrimaryButton({
  children,
  containerStyle = {},
  txtStyle = {},
  onPress,
  disabled = false,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{ ...primaryButtonStyle(disabled), ...containerStyle }}
      disabled={disabled}
    >
      <Text style={{ ...txtPrimaryFont, ...txtStyle }}>{children}</Text>
    </Pressable>
  );
}

export function SecondaryButton({
  children,
  containerStyle = {},
  txtStyle = {},
  onPress,
  disabled = false,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{ ...secondaryButtonStyle(disabled), ...containerStyle }}
      disabled={disabled}
    >
      <Text style={{ ...txtSecondaryFont, ...txtStyle }}>{children}</Text>
    </Pressable>
  );
}

export function DropDownButton({
  children,
  containerStyle = {},
  onPress,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{ ...styles.dropDownButtonStyle, ...containerStyle }}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  dropDownButtonStyle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    border: 1,
    borderWidth: 1,
    borderColor: secondary(),
    borderRadius: 20,
    paddingLeft: 15,
    paddingRight: 10,
    paddingTop: 3,
    paddingBottom: 3,
    maxWidth: 90,
  },
});
