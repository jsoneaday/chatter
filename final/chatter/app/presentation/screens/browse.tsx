import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { containerStyle } from "../theme/element-styles/screenStyles";

export default function Browse() {
  return (
    <View style={{ ...(containerStyle as object) }}>
      <Text>Browse</Text>
    </View>
  );
}
