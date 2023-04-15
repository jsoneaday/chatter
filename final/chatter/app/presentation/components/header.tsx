import React from "react";
import { View, StyleSheet, Pressable, Platform } from "react-native";
import { Config, Logo, Profile } from "./icons/headerIcons";
import Spacer from "./spacer";

export default function Header() {
  return (
    <View style={styles.container}>
      <Pressable>
        <Profile size={30} />
      </Pressable>
      <View>
        <Logo size={30} />
      </View>
      <View>
        <Spacer width={30} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: Platform.OS === "ios" ? 20 : 0,
  },
});
