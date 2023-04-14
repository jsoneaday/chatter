import React from "react";
import { View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { Config, Logo, Profile } from "../theme/icons/headerIcons";

export default function Header() {
  return (
    <View style={styles.container}>
      <TouchableOpacity testID="profileBtn">
        <Profile size={30} />
      </TouchableOpacity>
      <Logo size={30} />
      <TouchableOpacity testID="configBtn">
        <Config size={30} />
      </TouchableOpacity>
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
