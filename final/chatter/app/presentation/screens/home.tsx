import React from "react";
import { View, Text, StyleSheet } from "react-native";
import PostMessageButton from "../components/postMessageButton";
import { styleRootContainer } from "../theme/element-styles/ScreenStyles";

export default function Home() {
  return (
    <>
      <View style={{ ...(styleRootContainer as object) }}>
        <View style={styles.main}>
          <Text style={styles.title}>Home</Text>
          <Text style={styles.subtitle}>
            This is the first screen of your app.
          </Text>
        </View>
      </View>
      <PostMessageButton />
    </>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});
