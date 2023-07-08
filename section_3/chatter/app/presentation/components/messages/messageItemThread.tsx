import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import MessageModel from "../../common/models/message";
import {
  bodyFontStyle,
  subHeaderFontStyle,
} from "../../theme/element-styles/textStyles";
import { parseISO, formatDistanceToNow } from "date-fns";
import { tertiary } from "../../theme/colors";
import Avatar from "../avatar";
import MessageListItemToolbar from "./messageListItemToolbar";
import { DotsIcon } from "../icons/menuItemToolbarIcons";
const profile = require("../../theme/assets/profile.jpeg");
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../screens/home/home";

export interface MessageItemThreadProps {
  message: MessageModel;
  imageUri: string;
}

export type MessageItemThreadNavProps = StackScreenProps<
  RootStackParamList,
  "MessageItemThread"
>;

export default function MessageItemThread({
  route,
}: MessageItemThreadNavProps) {
  const [updatedAt, setUpdatedAt] = useState("");
  const { message, imageUri } = route.params;

  useEffect(() => {
    const date = parseISO(message.updatedAt);
    setUpdatedAt(formatDistanceToNow(date, { addSuffix: true }));
  }, [message]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.avatarContainer}>
          <Avatar imgFile={profile} size={50} />
        </View>
        <View style={styles.containerBodyHeader}>
          <View style={styles.containerBodyHeaderLeft}>
            <Text style={styles.txtFullName}>{message.profile.fullName}</Text>
            <Text
              style={styles.txtUserName}
            >{`@${message.profile.userName}`}</Text>
            <View style={styles.updatedAtContainer}>
              <Text
                style={{ ...styles.txtUpdatedAt, fontSize: 6 }}
              >{`\u2B22`}</Text>
              <Text
                style={{ ...styles.txtUpdatedAt, marginLeft: 5 }}
              >{`${updatedAt}`}</Text>
            </View>
          </View>
          <DotsIcon size={18} />
        </View>
      </View>
      {/* top width sets following widths if wrapped */}
      <View style={styles.contentContainer}>
        <View style={styles.containerBody}>
          <Text style={styles.txtBody}>{message.body}</Text>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.imageStyle} />
          ) : null}
        </View>
        <View style={styles.toolbarContainer}>
          <MessageListItemToolbar />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingRight: 10,
    paddingLeft: 4,
    paddingVertical: 5,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  avatarContainer: {
    paddingTop: 2,
    width: "15%",
  },
  contentContainer: {
    width: "85%",
  },
  containerBody: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    minHeight: 60,
    marginBottom: 5,
  },
  containerBodyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  containerBodyHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  updatedAtContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  toolbarContainer: {
    padding: 4,
  },
  txtFullName: {
    ...subHeaderFontStyle(),
    fontWeight: "bold",
    marginRight: 10,
  },
  txtUserName: {
    ...subHeaderFontStyle(),
    color: tertiary(),
    marginRight: 5,
  },
  txtBody: {
    ...bodyFontStyle,
    flex: 1,
    flexWrap: "wrap",
  },
  txtUpdatedAt: {
    color: tertiary(),
  },
  imageStyle: {
    marginTop: 50,
    width: 340,
    height: 340,
  },
});
