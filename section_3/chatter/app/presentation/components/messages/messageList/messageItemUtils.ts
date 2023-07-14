import React from "react";
import * as FileSystem from "expo-file-system";
import { MSG_IMAGE_URL } from "../../../../domain/utils/api";
import MessageModel from "../../../common/models/message";
import { parseISO, formatDistanceToNow } from "date-fns";
import {
  bodyFontStyle,
  subHeaderFontStyle,
} from "../../../theme/element-styles/textStyles";
import { secondary, tertiary } from "../../../theme/colors";
import { Platform, StyleSheet } from "react-native";

export function cacheFile(
  messageModel: MessageModel,
  setImageUri: React.Dispatch<React.SetStateAction<string>>
) {
  if (messageModel.hasImage) {
    FileSystem.downloadAsync(
      `${MSG_IMAGE_URL}/${messageModel.id}`,
      FileSystem.cacheDirectory + `msg${messageModel.id}.jpg`,
      {
        headers: { Accept: "image/jpeg" },
      }
    )
      .then((response) => {
        setImageUri(response.uri);
      })
      .catch((error) => {
        console.error("failed to download message file", error);
      });
  } else {
    setImageUri("");
  }
}

export function setUpdatedAtDate(
  messageModel: MessageModel,
  setUpdatedAt: React.Dispatch<React.SetStateAction<string>>
) {
  const date = parseISO(messageModel.updatedAt);
  setUpdatedAt(formatDistanceToNow(date, { addSuffix: true }));
}

export const listItemStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingRight: 10,
    paddingLeft: 4,
    paddingVertical: 5,
  },
  resentContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: Platform.OS === "ios" ? 0.17 : 0.2,
    borderColor: secondary(),
    borderStyle: "solid",
    width: "100%",
    maxHeight: 175,
  },
  avatarContainer: {
    paddingTop: 2,
    width: "15%",
  },
  resentAvatarContainer: {
    paddingTop: 2,
    marginRight: 10,
  },
  contentContainer: {
    width: "85%",
  },
  resentContentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 5,
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
    marginTop: 30,
    width: 340,
    height: 340,
  },
  resentHeader: { marginLeft: 65 },
});
