import React from "react";
import { View, StyleSheet, Text } from "react-native";
import MessageModel from "../../common/models/message";
import { ListRenderItemInfo } from "@shopify/flash-list";

interface MessageItemProps {
  item: ListRenderItemInfo<MessageModel>;
}

export default function MessageItem({ item }: MessageItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.containerBodyHeader}>
        <Text>{item.item.profile.full_name}</Text>
        <Text>{`@${item.item.profile.user_name}`}</Text>
      </View>
      <Text>{item.item.body}</Text>
      <View style={styles.containerBodyFooter}>footer</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
  containerBody: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
  containerBodyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  containerBodyFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
