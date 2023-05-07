import React from "react";
import { IconProps } from "./iconPropType";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { primary } from "../../theme/colors";

export function DeleteIcon({ size }: IconProps) {
  return <Feather name="trash-2" size={size} color="red" />;
}

export function SaveDraftIcon({ size }: IconProps) {
  return (
    <MaterialCommunityIcons
      name="pencil-plus-outline"
      size={size}
      color={primary()}
    />
  );
}
