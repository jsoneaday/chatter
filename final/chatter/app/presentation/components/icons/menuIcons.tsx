import React from "react";
import { Ionicons, Feather, Entypo } from "@expo/vector-icons";
import { notSelected, primary } from "../../theme/colors";
import { IconProps } from "./iconPropType";

export function HomeIcon({ isSelected, size }: IconProps) {
  if (isSelected) {
    return <Ionicons name="home-outline" size={size} color={primary()} />;
  }
  return <Ionicons name="home-outline" size={size} color={notSelected()} />;
}

export function BrowseIcon({ isSelected, size }: IconProps) {
  if (isSelected) {
    return <Entypo name="magnifying-glass" size={size} color={primary()} />;
  }
  return <Entypo name="magnifying-glass" size={size} color={notSelected()} />;
}

export function NotificationIcon({ isSelected, size }: IconProps) {
  if (isSelected) {
    return (
      <Ionicons name="notifications-outline" size={size} color={primary()} />
    );
  }
  return (
    <Ionicons name="notifications-outline" size={size} color={notSelected()} />
  );
}

export function DirectMessageIcon({ isSelected, size }: IconProps) {
  if (isSelected) {
    return <Ionicons name="mail-outline" size={size} color={primary()} />;
  }
  return <Ionicons name="mail-outline" size={size} color={notSelected()} />;
}
