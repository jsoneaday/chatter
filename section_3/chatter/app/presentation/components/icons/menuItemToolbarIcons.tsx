import React from "react";
import { Pressable } from "react-native";
import { Ionicons, Feather, Entypo, MaterialIcons } from "@expo/vector-icons";
import { notSelected, primary } from "../../theme/colors";
import { IconProps } from "./iconPropType";
import { usePostMessageSheetOpener } from "../../../domain/store/postMessageSheetOpener/postMessageSheetOpenerHooks";

export function ResponseIcon({ isSelected, size }: IconProps) {
  const [show, setShow] = usePostMessageSheetOpener();
  const onPressPostMessageSheetOpen = () => {
    setShow(!show);
  };

  return (
    <Pressable onPress={onPressPostMessageSheetOpen}>
      <Ionicons
        name="chatbubble-outline"
        size={size}
        color={isSelected ? primary() : notSelected()}
      />
    </Pressable>
  );
}

export function BroadcastIcon({ isSelected, size }: IconProps) {
  if (isSelected) {
    return <MaterialIcons name="repeat" size={size} color={primary()} />;
  }
  return <MaterialIcons name="repeat" size={size} color={notSelected()} />;
}

export function LikeIcon({ isSelected, size }: IconProps) {
  if (isSelected) {
    return <Ionicons name="heart-sharp" size={size} color={primary()} />;
  }
  return <Ionicons name="heart-outline" size={size} color={notSelected()} />;
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
