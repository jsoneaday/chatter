import {
  GestureResponderEvent,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import {
  primaryButtonStyle,
  secondaryButtonStyle,
} from "../theme/element-styles/ButtonStyles";
import { primaryDark, primaryLight } from "../theme/colors";
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
  const style = { ...primaryButtonStyle(disabled), ...containerStyle };
  console.log("style", style);
  return (
    <TouchableOpacity onPress={onPress} style={style} disabled={disabled}>
      <Text style={{ ...styles.txtPrimary, ...txtStyle }}>{children}</Text>
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
      <Text style={{ ...styles.txtSecondary, ...txtStyle }}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  txtPrimary: {
    color: primaryDark(),
    fontSize: 14,
  },
  txtSecondary: {
    color: primaryLight(),
    fontSize: 14,
  },
});
