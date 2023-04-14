import { GestureResponderEvent, Pressable, Text } from "react-native";
import {
  dropDownButtonStyle,
  primaryButtonStyle,
  secondaryButtonStyle,
  txtPrimaryFont,
  txtSecondaryFont,
} from "../theme/element-styles/buttonStyles";
import React, { ReactNode } from "react";

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
      style={{ ...(dropDownButtonStyle() as object), ...containerStyle }}
    >
      {children}
    </Pressable>
  );
}
