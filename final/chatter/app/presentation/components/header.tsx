import React from "react";
import { View, StyleSheet, Pressable, Platform } from "react-native";
import { Config, Logo, Profile } from "./icons/headerIcons";

export default function Header() {
  return (
    <View style={styles.container}>
      <Pressable testID="profileBtn">
        <Profile size={30} />
      </Pressable>
      <Logo size={30} />
      <Pressable testID="configBtn">
        <Config size={30} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: Platform.OS === "ios" ? 20 : 0,
  },
});
