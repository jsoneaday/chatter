import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import MessageModel from "../../common/models/message";
import { ListRenderItemInfo } from "@shopify/flash-list";
import {
  bodyFontStyle,
  headerFontStyle,
  subHeaderFontStyle,
} from "../../theme/element-styles/textStyles";
import { parseISO, formatDistanceToNow } from "date-fns";
import { tertiary } from "../../theme/colors";
import Avatar from "../avatar";
import Spacer from "../spacer";
const profile = require("../../theme/assets/profile.jpeg");

interface MessageItemProps {
  messageModel: ListRenderItemInfo<MessageModel>;
}

export default function MessageItem({ messageModel }: MessageItemProps) {
  const [updatedAt, setUpdatedAt] = useState("");
  useEffect(() => {
    console.log("updatedDate", messageModel.item.updatedAt);
    const date = parseISO(messageModel.item.updatedAt);
    console.log("date", date);
    setUpdatedAt(formatDistanceToNow(date, { addSuffix: true }));
  }, [messageModel]);

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Avatar imgFile={profile} size={50} />
      </View>
      <Spacer width={10} />
      <View style={styles.containerBody}>
        <View style={styles.containerBodyHeader}>
          <Text style={styles.txtFullName}>
            {messageModel.item.profile.fullName}
          </Text>
          <Text
            numberOfLines={1}
            style={styles.txtUserName}
          >{` @${messageModel.item.profile.userName}`}</Text>
          <View style={styles.updatedAtContainer}>
            <Text
              style={{ ...styles.txtUpdatedAt, fontSize: 4 }}
            >{`\u2B22`}</Text>
            <Text style={styles.txtUpdatedAt}>{` ${updatedAt}`}</Text>
          </View>
        </View>
        <Text style={styles.txtBody}>{messageModel.item.body}</Text>
        <View style={styles.containerBodyFooter}>
          <Text>footer</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingRight: 10,
    paddingLeft: 4,
    paddingVertical: 5,
  },
  avatarContainer: {},
  containerBody: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  containerBodyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  updatedAtContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  txtFullName: {
    ...subHeaderFontStyle,
    fontWeight: "bold",
  },
  txtUserName: {
    ...subHeaderFontStyle,
    width: 95,
    color: tertiary(),
  },
  txtBody: {
    ...bodyFontStyle,
  },
  txtUpdatedAt: {
    color: tertiary(),
  },
  containerBodyFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
