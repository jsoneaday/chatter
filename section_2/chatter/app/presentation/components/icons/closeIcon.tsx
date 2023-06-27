import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { IconProps } from "./iconPropType";
import { primary } from "../../theme/colors";
import { Pressable } from "react-native";

interface CloseButtonProps {
  onPress: () => void;
}

export function CloseButton({ size, onPress }: IconProps & CloseButtonProps) {
  return (
    <Pressable onPress={onPress}>
      <AntDesign name="close" size={size} color={primary()} />
    </Pressable>
  );
}
