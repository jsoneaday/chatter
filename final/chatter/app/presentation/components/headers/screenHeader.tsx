import React, { useState } from "react";
import { View, StyleSheet, Pressable, Platform } from "react-native";
import { Logo, Profile } from "../icons/headerIcons";
import Spacer from "../spacer";
import { useSlideMenuOpener } from "../../../domain/store/slideMenuOpener/slideMenuOpenerHooks";

export default function Header() {
  const [show, setShow] = useSlideMenuOpener();

  const toggleSlideMenuOpener = () => {
    setShow(!show);
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={toggleSlideMenuOpener}>
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
