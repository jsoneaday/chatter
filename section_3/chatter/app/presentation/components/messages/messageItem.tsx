import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import MessageModel from "../../common/models/message";
import { ListRenderItemInfo } from "@shopify/flash-list";
import {
  bodyFontStyle,
  subHeaderFontStyle,
} from "../../theme/element-styles/textStyles";
import { parseISO, formatDistanceToNow } from "date-fns";
import { tertiary } from "../../theme/colors";
import Avatar from "../avatar";
import MessageItemToolbar from "./messageItemToolbar";
import { DotsIcon } from "../icons/menuItemToolbarIcons";
const profile = require("../../theme/assets/profile.jpeg");
import * as FileSystem from "expo-file-system";
import { MSG_IMAGE_URL } from "../../../domain/utils/api";

interface MessageItemProps {
  messageModel: ListRenderItemInfo<MessageModel>;
}

export default function MessageItem({ messageModel }: MessageItemProps) {
  const [updatedAt, setUpdatedAt] = useState("");
  const [image, setImage] = useState<string>("");

  useEffect(() => {
    console.log(
      "useEffect imageUri",
      messageModel.item.id,
      messageModel.item.hasImage
    );
    if (messageModel.item.hasImage) {
      FileSystem.downloadAsync(
        `${MSG_IMAGE_URL}/${messageModel.item.id}`,
        FileSystem.documentDirectory + `msg${messageModel.item.id}.jpg`,
        {
          headers: { Accept: "image/jpeg" },
        }
      )
        .then((response) => {
          setImage(response.uri);
        })
        .catch((error) => {
          console.error("failed to download message file", error);
        });
    }
  }, [messageModel.item.hasImage]);

  useEffect(() => {
    const date = parseISO(messageModel.item.updatedAt);
    setUpdatedAt(formatDistanceToNow(date, { addSuffix: true }));
  }, [messageModel]);

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Avatar imgFile={profile} size={50} />
      </View>
      {/* top width sets following widths if wrapped */}
      <View style={styles.contentContainer}>
        <View style={styles.containerBodyHeader}>
          <View style={styles.containerBodyHeaderLeft}>
            <Text style={styles.txtFullName}>
              {messageModel.item.profile.fullName}
            </Text>
            <Text
              style={styles.txtUserName}
            >{`@${messageModel.item.profile.userName}`}</Text>
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
        <View style={styles.containerBody}>
          <Text style={styles.txtBody}>{messageModel.item.body}</Text>
          {image ? (
            <Image source={{ uri: image }} style={styles.imageStyle} />
          ) : null}
        </View>
        <View style={styles.toolbarContainer}>
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
