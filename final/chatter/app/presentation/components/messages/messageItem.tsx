import React from "react";
import { View, StyleSheet } from "react-native";

export default function MessageItem() {
  return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  containerBody: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
  containerBodyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  containerBodyFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
