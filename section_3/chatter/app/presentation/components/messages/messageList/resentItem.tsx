import React, { useEffect, useState } from "react";
import { View, Text, Image, Pressable } from "react-native";
import MessageModel from "../../../common/models/message";
import Avatar from "../../avatar";
const profile = require("../../../theme/assets/profile.jpeg");
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../screens/home/home";
import {
  cacheFile,
  listItemStyles,
  setUpdatedAtDate,
} from "./messageItemUtils";

interface ResentProps {
  messageModel: MessageModel;
  navigation?: StackNavigationProp<
    RootStackParamList,
    keyof RootStackParamList,
    undefined
  >;
}

export default function ResentItem({ messageModel, navigation }: ResentProps) {
  const [updatedAt, setUpdatedAt] = useState("");
  const [imageUri, setImageUri] = useState<string>("");

  useEffect(() => {
    cacheFile(messageModel, setImageUri);
    setUpdatedAtDate(messageModel, setUpdatedAt);
  }, [messageModel]);

  const onPressNavigate = () => {
    if (navigation) {
      navigation.navigate("MessageItemThread", {
        message: messageModel,
        imageUri: imageUri,
      });
    }
  };

  return (
    <View style={listItemStyles.resentContainer}>
      <View style={listItemStyles.resentContentContainer}>
        <View style={listItemStyles.resentAvatarContainer}>
          <Avatar imgFile={profile} size={30} />
        </View>
        <View style={listItemStyles.containerBodyHeader}>
          <Text style={listItemStyles.txtFullName}>
            {messageModel.profile.fullName}
          </Text>
          <Text
            style={listItemStyles.txtUserName}
          >{`@${messageModel.profile.userName}`}</Text>
          <View style={listItemStyles.updatedAtContainer}>
            <Text
              style={{ ...listItemStyles.txtUpdatedAt, fontSize: 6 }}
            >{`\u2B22`}</Text>
            <Text
              numberOfLines={1}
              style={{
                ...listItemStyles.txtUpdatedAt,
                marginLeft: 5,
                width: 100,
              }}
            >{`${updatedAt}`}</Text>
          </View>
        </View>
      </View>
      <Pressable onPress={onPressNavigate}>
        <View style={listItemStyles.containerBody}>
          <Text style={listItemStyles.txtBody}>{messageModel.body}</Text>
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={listItemStyles.imageStyle}
            />
          ) : null}
        </View>
      </Pressable>
    </View>
  );
}
