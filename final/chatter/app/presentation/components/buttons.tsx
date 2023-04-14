import { GestureResponderEvent, TouchableOpacity, Text } from "react-native";
import {
  primaryButtonStyle,
  secondaryButtonStyle,
  txtPrimary,
  txtSecondary,
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
    <TouchableOpacity
      onPress={onPress}
      style={{ ...primaryButtonStyle(disabled), ...containerStyle }}
      disabled={disabled}
    >
      <Text style={{ ...txtPrimary, ...txtStyle }}>{children}</Text>
    </TouchableOpacity>
  );
}

export function SecondaryButton({
  onPress,
  containerStyle = {},
  txtStyle = {},
  children,
  disabled = false,
}: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ ...secondaryButtonStyle(disabled), ...containerStyle }}
      disabled={disabled}
    >
      <Text style={{ ...txtSecondary, ...txtStyle }}>{children}</Text>
    </TouchableOpacity>
  );
}
