import React from "react";
import { Appearance } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { notSelected, primary } from "../colors";
import { IconProps } from "./iconPropType";

const colorScheme = Appearance.getColorScheme();

export function HomeIcon({ isSelected, size }: IconProps) {
  if (isSelected) {
    return <Ionicons name="home-outline" size={size} color={primary()} />;
  }
  return <Ionicons name="home-outline" size={size} color={notSelected()} />;
}

export function BrowseIcon({ isSelected, size }: IconProps) {
  if (isSelected) {
    return (
      <Ionicons name="md-git-network-sharp" size={size} color={primary()} />
    );
  }
  return (
    <Ionicons name="md-git-network-sharp" size={size} color={notSelected()} />
  );
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
    return <Feather name="message-square" size={size} color={primary()} />;
  }
  return <Feather name="message-square" size={size} color={notSelected()} />;
}
