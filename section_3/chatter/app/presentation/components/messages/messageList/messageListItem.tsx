import React, { useEffect, useState } from "react";
import { View, Text, Image, Pressable } from "react-native";
import MessageModel from "../../../common/models/message";
import { ListRenderItemInfo } from "@shopify/flash-list";
import Avatar from "../../avatar";
import MessageListItemToolbar from "./messageListItemToolbar";
import { DotsIcon } from "../../icons/menuItemToolbarIcons";
const profile = require("../../../theme/assets/profile.jpeg");
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../screens/home/home";
import {
  cacheFile,
  listItemStyles,
  setUpdatedAtDate,
} from "./messageItemUtils";
import ResentItem from "./resentItem";

interface MessageItemProps {
  messageModel: ListRenderItemInfo<MessageModel>;
  navigation: StackNavigationProp<
    RootStackParamList,
    keyof RootStackParamList,
    undefined
  >;
  isQuoteResentMessage?: boolean;
}

export default function MessageListItem({
  messageModel,
  navigation,
  isQuoteResentMessage = false,
}: MessageItemProps) {
  const [updatedAt, setUpdatedAt] = useState("");
  const [imageUri, setImageUri] = useState<string>("");

  useEffect(() => {
    cacheFile(messageModel.item, setImageUri);
    setUpdatedAtDate(messageModel.item, setUpdatedAt);
  }, [messageModel.item]);

  const onPressNavigate = () => {
    navigation.navigate("MessageItemThread", {
      message: messageModel.item,
      imageUri: imageUri,
    });
  };

  return (
    <View style={listItemStyles.container}>
      <View style={listItemStyles.avatarContainer}>
        <Avatar imgFile={profile} size={50} />
      </View>
      {/* top width sets following widths if wrapped */}
      <View style={listItemStyles.contentContainer}>
        <View style={listItemStyles.containerBodyHeader}>
          <View style={listItemStyles.containerBodyHeaderLeft}>
            <Text style={listItemStyles.txtFullName}>
              {messageModel.item.profile.fullName}
            </Text>
            <Text
              style={listItemStyles.txtUserName}
            >{`@${messageModel.item.profile.userName}`}</Text>
            <View style={listItemStyles.updatedAtContainer}>
              <Text
                style={{ ...listItemStyles.txtUpdatedAt, fontSize: 6 }}
              >{`\u2B22`}</Text>
              <Text
                style={{ ...listItemStyles.txtUpdatedAt, marginLeft: 5 }}
              >{`${updatedAt}`}</Text>
            </View>
          </View>
          <DotsIcon size={18} />
        </View>
        <Pressable onPress={onPressNavigate}>
          <View style={listItemStyles.containerBody}>
            <Text style={listItemStyles.txtBody}>{messageModel.item.body}</Text>
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={listItemStyles.imageStyle}
              />
            ) : null}
            {isQuoteResentMessage && (
              <ResentItem
                messageModel={messageModel.item}
                navigation={navigation}
              />
            )}
          </View>
        </Pressable>
        <View style={listItemStyles.toolbarContainer}>
          <MessageListItemToolbar currentMsgId={messageModel.item.id} />
        </View>
      </View>
    </View>
  );
}
