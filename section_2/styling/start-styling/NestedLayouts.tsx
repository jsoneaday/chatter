import { StyleSheet, View } from "react-native";

export function RootContainer() {
  return (
    <View style={styles.rootContainer}>
      <View
        style={{ ...styles.subContainer, borderColor: "red", flex: 0 }}
      ></View>
      <View
        style={{ ...styles.subContainer, borderColor: "orange", flex: 0 }}
      ></View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 0,
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "flex-end",
    borderWidth: 5,
    borderColor: "blue",
  },
  subContainer: {
    borderWidth: 15,
  },
});
