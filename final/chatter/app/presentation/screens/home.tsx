import React from "react";
import { View, Text } from "react-native";
import PostMessageButton from "../components/postMessageButton";
import { containerStyle } from "../theme/element-styles/screenStyles";

export default function Home() {
  return (
    <>
      <View style={{ ...(containerStyle as object) }}>
        <Text>Home</Text>
      </View>
      <PostMessageButton />
    </>
  );
}
