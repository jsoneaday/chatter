import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { Ionicons, Feather, Entypo, MaterialIcons } from "@expo/vector-icons";
import { notSelected, primary } from "../../theme/colors";
import { IconProps } from "./iconPropType";
import { usePostMessageSheetOpener } from "../../../domain/store/postMessageSheetOpener/postMessageSheetOpenerHooks";
import { TypeOfPost } from "../../../domain/store/postMessageSheetOpener/postMessageSheetOpenerSlice";
import { likeMessage } from "../../../domain/entities/message";
import MessageModel from "../../common/models/message";

interface EntityId {
  message: MessageModel;
}

export function ResponseIcon({
  isSelected,
  size,
  message,
}: IconProps & EntityId) {
  const [show, setShow] = usePostMessageSheetOpener();
  const onPressPostMessageSheetOpen = () => {
    const showUpdated = {
      show: !show.show,
      typeOfPost: TypeOfPost.Response,
      broadcastingMsgOrOriginalMsgId: message.id,
    };
    setShow(showUpdated);
    console.log("ResponseIcon", showUpdated);
  };

  return (
    <Pressable style={styles.container} onPress={onPressPostMessageSheetOpen}>
      <Ionicons
        name="chatbubble-outline"
        size={size}
        color={isSelected ? primary() : notSelected()}
      />
      <Text>{message.responses || ""}</Text>
    </Pressable>
  );
}

export function BroadcastIcon({
  isSelected,
  size,
  message,
}: IconProps & EntityId) {
  const [_, setShow] = usePostMessageSheetOpener();
  const onPressPostMessageSheetOpen = () => {
    const showUpdated = {
      show: false,
      typeOfPost: TypeOfPost.Resend,
      broadcastingMsgOrOriginalMsgId: message.id,
    };
    setShow(showUpdated);
    console.log("BroadcastIcon", showUpdated);
  };

  return (
    <Pressable style={styles.container} onPress={onPressPostMessageSheetOpen}>
      <MaterialIcons
        name="repeat"
        size={size}
        color={isSelected ? primary() : notSelected()}
      />
    </Pressable>
  );
}

export function LikeIcon({ isSelected, size, message }: IconProps & EntityId) {
  const onPressPostMessageSheetOpen = async () => {
    await likeMessage(message.id);
    console.log("LikeIcon");
  };

  return (
    <Pressable style={styles.container} onPress={onPressPostMessageSheetOpen}>
      <Ionicons
        name={isSelected ? "heart-sharp" : "heart-outline"}
        size={size}
        color={isSelected ? primary() : notSelected()}
      />
      <Text>{message.likes}</Text>
    </Pressable>
  );
}

export function ShareIcon({ isSelected, size }: IconProps) {
  if (isSelected) {
    return <Feather name="share" size={size} color={primary()} />;
  }
  return <Feather name="share" size={size} color={notSelected()} />;
}

export function DotsIcon({ isSelected, size }: IconProps) {
  if (isSelected) {
    return (
      <Entypo name="dots-three-horizontal" size={size} color={primary()} />
    );
  }
  return (
    <Entypo name="dots-three-horizontal" size={size} color={notSelected()} />
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 35,
  },
});
