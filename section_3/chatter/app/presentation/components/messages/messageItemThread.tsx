import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import MessageModel from "../../common/models/message";
import {
  bodyFontStyle,
  headerFontStyle,
  subHeaderFontStyle,
} from "../../theme/element-styles/textStyles";
import { parseISO, formatDistanceToNow } from "date-fns";
import { primary, tertiary } from "../../theme/colors";
import Avatar from "../avatar";
import MessageListItemToolbar from "./messageList/messageListItemToolbar";
import { DotsIcon } from "../icons/menuItemToolbarIcons";
const profileImg = require("../../theme/assets/profile.png");
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../screens/home/home";
import { bottomBorder } from "../../theme/element-styles/dividerStyles";
import MessageList from "./messageList/messageList";
import { useNavigation } from "@react-navigation/native";
import { useProfile } from "../../../domain/store/profile/profileHooks";
import { getResponseMessages } from "../../../domain/entities/message";
import { visibleBorder } from "../../theme/visibleBorder";
import { usePostMessageSheetOpener } from "../../../domain/store/postMessageSheetOpener/postMessageSheetOpenerHooks";

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
  const [responseMessages, setResponseMessages] = useState<MessageModel[]>([]);
  const [profile] = useProfile();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigation =
    useNavigation<
      StackNavigationProp<
        RootStackParamList,
        keyof RootStackParamList,
        undefined
      >
    >();
  const [showPostMessageSheet, setShowPostMessageSheet] =
    usePostMessageSheetOpener();

  useEffect(() => {
    refreshList();

    const date = parseISO(message.updatedAt);
    setUpdatedAt(formatDistanceToNow(date, { addSuffix: true }));
  }, [message]);

  useEffect(() => {
    if (!showPostMessageSheet.show) {
      refreshList();
    }
  }, [showPostMessageSheet]);

  const refreshList = async () => {
    setIsRefreshing(true);
    getResponseMessages(message.id, new Date().toISOString(), 10)
      .then((messages) => {
        setResponseMessages(messages);
        setIsRefreshing(false);
      })
      .catch((e) => {
        console.log("error getting response messages", e);
        setIsRefreshing(false);
      });
  };

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
      <View style={{ ...(styles.contentContainer as object) }}>
        <View style={styles.containerBody}>
          <Text style={styles.txtBody}>{message.body}</Text>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.imageStyle} />
          ) : null}
        </View>
        <View style={styles.updatedAtContainer as object}>
          <Text style={{ fontSize: 16, marginRight: 6 }}>{`${updatedAt}`}</Text>
          <Text style={{ ...(subHeaderFontStyle() as object), marginRight: 6 }}>
            3.4K
          </Text>
          <Text style={{ fontSize: 16 }}>Views</Text>
        </View>
        <View style={styles.updatedAtContainer as object}>
          <Text style={{ ...(subHeaderFontStyle() as object), marginRight: 6 }}>
            3,401
          </Text>
          <Text style={{ fontSize: 16, marginRight: 6 }}>Resends</Text>
          <Text style={{ ...(subHeaderFontStyle() as object), marginRight: 6 }}>
            685
          </Text>
          <Text style={{ fontSize: 16 }}>Quotes</Text>
        </View>
        <View style={styles.updatedAtContainer as object}>
          <Text style={{ ...(subHeaderFontStyle() as object), marginRight: 6 }}>
            671
          </Text>
          <Text style={{ fontSize: 16, marginRight: 6 }}>Likes</Text>
          <Text style={{ ...(subHeaderFontStyle() as object), marginRight: 6 }}>
            98
          </Text>
          <Text style={{ fontSize: 16 }}>Bookmarks</Text>
        </View>
        <View style={styles.toolbarContainer}>
          <MessageListItemToolbar currentMsg={message} />
        </View>
      </View>
      <View style={{ width: "100%", height: "100%" }}>
        <MessageList
          navigation={navigation}
          messageItems={responseMessages}
          onRefreshList={refreshList}
          isRefreshing={isRefreshing}
        />
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
    ...bottomBorder,
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
    justifyContent: "flex-start",
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
