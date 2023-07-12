import React from "react";
import { View, StyleSheet } from "react-native";
import {
  BroadcastIcon,
  LikeIcon,
  ResponseIcon,
  ShareIcon,
} from "../../icons/menuItemToolbarIcons";

const size = 21;

export interface MessageListItemToolbarProps {
  currentMsgId: bigint;
}

export default function MessageListItemToolbar({
  currentMsgId,
}: MessageListItemToolbarProps) {
  return (
    <View style={styles.container}>
      <ResponseIcon size={size} msgId={currentMsgId} />
      <BroadcastIcon size={size} msgId={currentMsgId} />
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
