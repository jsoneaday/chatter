import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import MessageModel from "../../common/models/message";
import { ListRenderItemInfo } from "@shopify/flash-list";
import {
  bodyFontStyle,
  subHeaderFontStyle,
} from "../../theme/element-styles/textStyles";
import { parseISO, formatDistanceToNow } from "date-fns";
import { tertiary } from "../../theme/colors";
import Avatar from "../avatar";
import Spacer from "../spacer";
import MessageItemToolbar from "./messageItemToolbar";
import { DotsIcon } from "../icons/menuItemToolbarIcons";
const profile = require("../../theme/assets/profile.jpeg");

interface MessageItemProps {
  messageModel: ListRenderItemInfo<MessageModel>;
}

export default function MessageItem({ messageModel }: MessageItemProps) {
  const [updatedAt, setUpdatedAt] = useState("");
  useEffect(() => {
    const date = parseISO(messageModel.item.updatedAt);
    setUpdatedAt(formatDistanceToNow(date, { addSuffix: true }));
  }, [messageModel]);

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Avatar imgFile={profile} size={50} />
      </View>
      <Spacer width={10} />
      {/* top width sets following widths if wrapped */}
      <View>
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
          <DotsIcon size={18} />
        </View>
        <View style={styles.containerBody}>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.txtBody}>{messageModel.item.body}</Text>
          </View>
        </View>
        <View style={{ padding: 4 }}>
          <MessageItemToolbar />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingRight: 10,
    paddingLeft: 4,
    paddingVertical: 5,
  },
  avatarContainer: {
    paddingTop: 2,
  },
  containerBody: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  containerBodyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  updatedAtContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  txtFullName: {
    ...subHeaderFontStyle(),
    fontWeight: "bold",
  },
  txtUserName: {
    ...subHeaderFontStyle(),
    width: 90,
    color: tertiary(),
  },
  txtBody: {
    ...bodyFontStyle,
    flex: 1,
    flexWrap: "wrap",
  },
  txtUpdatedAt: {
    color: tertiary(),
  },
});
