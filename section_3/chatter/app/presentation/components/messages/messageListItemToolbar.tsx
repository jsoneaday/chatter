import React from "react";
import { View, StyleSheet } from "react-native";
import {
  BroadcastIcon,
  LikeIcon,
  ResponseIcon,
  ShareIcon,
} from "../icons/menuItemToolbarIcons";

const size = 21;

export default function MessageListItemToolbar() {
  return (
    <View style={styles.container}>
      <ResponseIcon size={size} />
      <BroadcastIcon size={size} />
      <LikeIcon size={size} />
      <ShareIcon size={size} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
