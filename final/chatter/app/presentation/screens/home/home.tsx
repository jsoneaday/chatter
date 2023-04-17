import React from "react";
import { View, Text } from "react-native";
import { containerStyle } from "../../theme/element-styles/screenStyles";

export default function Home() {
  return (
    <>
      <View style={{ ...(containerStyle as object) }}>
        <Text>Home</Text>
      </View>
    </>
  );
}
