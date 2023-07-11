import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import MessageModel from "../../common/models/message";
import {
  bodyFontStyle,
  subHeaderFontStyle,
} from "../../theme/element-styles/textStyles";
import { parseISO, formatDistanceToNow } from "date-fns";
import { primary, tertiary } from "../../theme/colors";
import Avatar from "../avatar";
import MessageListItemToolbar from "./messageListItemToolbar";
import { DotsIcon } from "../icons/menuItemToolbarIcons";
const profileImg = require("../../theme/assets/profile.jpeg");
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../screens/home/home";
import { bottomBorder } from "../../theme/element-styles/dividerStyles";
import MessageList from "./messageList";
import { useNavigation } from "@react-navigation/native";
import { useProfile } from "../../../domain/store/profile/profileHooks";

export interface MessageItemThreadProps {
  message: MessageModel;
  imageUri: string;
}

type MessageItemThreadRouteProps = StackScreenProps<
  RootStackParamList,
  "MessageItemThread"
>;

export default function MessageItemThread({
  route,
}: MessageItemThreadRouteProps) {
  const [updatedAt, setUpdatedAt] = useState("");
  const { message, imageUri } = route.params;
  const [profile] = useProfile();
  const navigation =
    useNavigation<
      StackNavigationProp<
        RootStackParamList,
        keyof RootStackParamList,
        undefined
      >
    >();

  useEffect(() => {
    const date = parseISO(message.updatedAt);
    setUpdatedAt(formatDistanceToNow(date, { addSuffix: true }));
  }, [message]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.avatarContainer}>
          <Avatar imgFile={profileImg} size={50} />
        </View>
        <View style={styles.containerBodyHeader}>
          <View style={styles.containerBodyHeaderLeft}>
            <Text style={styles.txtFullName}>{message.profile.fullName}</Text>
            <Text
              style={styles.txtUserName}
            >{`@${message.profile.userName}`}</Text>
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
        <View style={styles.updatedAtContainer as object}>
          <Text
            style={{ ...styles.txtUpdatedAt, marginLeft: 5 }}
          >{`${updatedAt}`}</Text>
        </View>
        <View style={styles.toolbarContainer}>
          <MessageListItemToolbar />
        </View>
      </View>
      <View>
        {/* <MessageList
          navigation={navigation}
          messageItems={messageItems}
          onRefreshList={onRefreshList}
          isRefreshing={isRefreshing}
        /> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: primary(true),
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingRight: 15,
    paddingLeft: 15,
    paddingTop: 10,
    paddingVertical: 5,
    width: "100%",
    height: "100%",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
  },
  avatarContainer: {
    paddingTop: 2,
    width: "15%",
  },
  contentContainer: {
    width: "100%",
    paddingTop: 10,
    paddingBottom: 10,
  },
  containerBody: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    minHeight: 60,
    marginBottom: 10,
  },
  containerBodyHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    width: "82%",
  },
  containerBodyHeaderLeft: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  updatedAtContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    marginBottom: 8,
    paddingBottom: 8,
    ...bottomBorder,
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
    flexWrap: "wrap",
  },
  txtUpdatedAt: {
    color: tertiary(),
  },
  imageStyle: {
    marginTop: 50,
    width: "100%",
    minHeight: 400,
  },
});
