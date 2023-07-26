import React, { useEffect, useState } from "react";
import { View, Text, Image, Pressable } from "react-native";
import MessageModel from "../../../common/models/message";
import { ListRenderItemInfo } from "@shopify/flash-list";
import Avatar from "../../avatar";
import MessageListItemToolbar from "./messageListItemToolbar";
import { DotsIcon } from "../../icons/menuItemToolbarIcons";
const profile = require("../../../theme/assets/profile.png");
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../screens/home/home";
import {
  cacheFile,
  listItemStyles,
  setUpdatedAtDate,
} from "./messageItemUtils";
import ResentItem from "./resentItem";
import { usePostMessageSheetOpener } from "../../../../domain/store/postMessageSheetOpener/postMessageSheetOpenerHooks";

interface MessageItemProps {
  messageModel: ListRenderItemInfo<MessageModel>;
  navigation: StackNavigationProp<
    RootStackParamList,
    keyof RootStackParamList,
    undefined
  >;
}

enum MessageModelType {
  Plain,
  Resent,
  QuotedResent,
}

export default function MessageListItem({
  messageModel,
  navigation,
}: MessageItemProps) {
  const [updatedAt, setUpdatedAt] = useState("");
  const [imageUri, setImageUri] = useState<string>("");
  // selected using a message or its broadcast message
  const [currentMessageModel, setCurrentMessageModel] =
    useState<MessageModel>();
  const [currentBroadcastMessageModel, setCurrentBroadcastMessageModel] =
    useState<MessageModel | undefined>();
  const [messageModelType, setMessageModelType] = useState<MessageModelType>(
    MessageModelType.Plain
  );
  const [showPostMessageSheet, setShowPostMessageSheet] =
    usePostMessageSheetOpener();

  useEffect(() => {
    cacheFile(messageModel.item, setImageUri);
    setUpdatedAtDate(messageModel.item, setUpdatedAt);

    // if there is no body but there is a broadcasting message then display that
    if (!messageModel.item.broadcastingMsg) {
      setCurrentMessageModel(messageModel.item);
      setCurrentBroadcastMessageModel(undefined);
      setMessageModelType(MessageModelType.Plain);
    } else if (!messageModel.item.body && messageModel.item.broadcastingMsg) {
      setCurrentMessageModel(messageModel.item.broadcastingMsg);
      setCurrentBroadcastMessageModel(undefined);
      setMessageModelType(MessageModelType.Resent);
    } else {
      setCurrentMessageModel(messageModel.item);
      setCurrentBroadcastMessageModel(messageModel.item.broadcastingMsg);
      setMessageModelType(MessageModelType.QuotedResent);
    }
  }, [messageModel.item]);

  const onPressNavigate = () => {
    const postMessageSheet = { ...showPostMessageSheet };
    postMessageSheet.displayPostButton = false;
    setShowPostMessageSheet(postMessageSheet);

    navigation.navigate("MessageItemThread", {
      message: currentMessageModel!,
      imageUri: imageUri,
    });
  };

  const getResentHeader = () => {
    if (messageModelType === MessageModelType.Resent) {
      return (
        <Text style={listItemStyles.resentHeader}>
          {`${messageModel.item.profile.userName}  Retweeted`}
        </Text>
      );
    } else if (messageModelType === MessageModelType.QuotedResent) {
      return (
        <Text style={listItemStyles.resentHeader}>
          {`${currentMessageModel?.profile.userName}  Retweeted`}
        </Text>
      );
    }
    return null;
  };

  const bodyHeight = () => {
    let height = 60; // handle padding and headers
    if (currentMessageModel?.body) {
      height += currentMessageModel?.body.length / 3;
    }
    if (
      messageModelType == MessageModelType.Plain ||
      messageModelType == MessageModelType.Resent
    ) {
      if (currentMessageModel?.hasImage) {
        height += 310;
      }
    } else if (messageModelType == MessageModelType.QuotedResent) {
      height += 60; // handle broadcast padding and headers
      if (currentMessageModel?.hasImage) {
        height += 310;
      }
      if (currentBroadcastMessageModel?.body) {
        height += currentBroadcastMessageModel?.body.length / 3;
      }
      if (currentBroadcastMessageModel?.hasImage) {
        height += 310;
      }
    }
    return height;
  };

  const containerHeight = () => {
    let height = bodyHeight();
    height += 70;
    return height;
  };

  return (
    <>
      {getResentHeader()}
      <View style={{ ...listItemStyles.container, height: containerHeight() }}>
        <View style={listItemStyles.avatarContainer}>
          <Avatar imgFile={profile} size={50} />
        </View>
        {/* top width sets following widths if wrapped */}
        <View style={listItemStyles.contentContainer}>
          <View style={listItemStyles.containerBodyHeader}>
            <View style={listItemStyles.containerBodyHeaderLeft}>
              <Text style={listItemStyles.txtFullName}>
                {currentMessageModel?.profile.fullName}
              </Text>
              <Text
                style={listItemStyles.txtUserName}
              >{`@${currentMessageModel?.profile.userName}`}</Text>
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

          <View
            style={{
              ...listItemStyles.containerBody,
              height: bodyHeight(),
            }}
          >
            <Pressable onPress={onPressNavigate}>
              <Text style={listItemStyles.txtBody}>
                {currentMessageModel?.body}
              </Text>
              {/* this is difficult because adding a component later in render cycle causes its zindex to be higher */}
              {imageUri ? (
                <Image
                  source={{ uri: imageUri }}
                  style={listItemStyles.imageStyle}
                />
              ) : null}
              {currentMessageModel?.body && currentBroadcastMessageModel && (
                <ResentItem
                  messageModel={currentBroadcastMessageModel}
                  navigation={navigation}
                />
              )}
            </Pressable>
          </View>

          <View style={listItemStyles.toolbarContainer}>
            <MessageListItemToolbar currentMsg={currentMessageModel} />
          </View>
        </View>
      </View>
    </>
  );
}
