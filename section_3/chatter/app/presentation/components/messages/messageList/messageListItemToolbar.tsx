import React from "react";
import { View, StyleSheet } from "react-native";
import {
  BroadcastIcon,
  LikeIcon,
  ResponseIcon,
  ShareIcon,
} from "../../icons/menuItemToolbarIcons";
import MessageModel from "../../../common/models/message";

const size = 21;

export interface MessageListItemToolbarProps {
  currentMsg: MessageModel | undefined;
}

export default function MessageListItemToolbar({
  currentMsg,
}: MessageListItemToolbarProps) {
  if (currentMsg) {
    return (
      <View style={styles.container}>
        <ResponseIcon size={size} message={currentMsg} />
        <BroadcastIcon size={size} message={currentMsg} />
        <LikeIcon size={size} message={currentMsg} />
        <ShareIcon size={size} />
      </View>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
