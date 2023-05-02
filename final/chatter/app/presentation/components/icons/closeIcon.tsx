import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { IconProps } from "./iconPropType";
import { primary } from "../../theme/colors";

export function CloseButton({ size }: IconProps) {
  return <AntDesign name="close" size={size} color={primary()} />;
}
