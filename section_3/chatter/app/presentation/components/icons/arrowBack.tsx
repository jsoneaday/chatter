import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { IconProps } from "./iconPropType";
import { primary } from "../../theme/colors";
import { Pressable } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../screens/home/home";
import { useNavigation } from "@react-navigation/native";

export function ArrowBack({ size }: IconProps) {
  const navigation =
    useNavigation<
      StackNavigationProp<
        RootStackParamList,
        keyof RootStackParamList,
        undefined
      >
    >();

  const onPressGoBack = () => {
    navigation.goBack();
  };

  return (
    <Pressable onPress={onPressGoBack}>
      <MaterialIcons name="arrow-back-ios" size={size} color={primary()} />
    </Pressable>
  );
}
