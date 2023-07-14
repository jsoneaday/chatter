import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { IconProps } from "./iconPropType";
import { primary } from "../../theme/colors";
import { Pressable } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../screens/home/home";
import { useNavigation } from "@react-navigation/native";
import { usePostMessageSheetOpener } from "../../../domain/store/postMessageSheetOpener/postMessageSheetOpenerHooks";

export function ArrowBack({ size }: IconProps) {
  const [showPostMessageSheet, setShowPostMessageSheet] =
    usePostMessageSheetOpener();

  const navigation =
    useNavigation<
      StackNavigationProp<
        RootStackParamList,
        keyof RootStackParamList,
        undefined
      >
    >();

  const onPressGoBack = () => {
    const postMessageSheet = { ...showPostMessageSheet };
    postMessageSheet.displayPostButton = true;
    setShowPostMessageSheet(postMessageSheet);
    navigation.goBack();
  };

  return (
    <Pressable onPress={onPressGoBack}>
      <MaterialIcons name="arrow-back-ios" size={size} color={primary()} />
    </Pressable>
  );
}
