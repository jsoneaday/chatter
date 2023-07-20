import { StyleSheet, View } from "react-native";

export function RootContainer() {
  return (
    <View style={styles.rootContainer}>
      <View style={{ ...styles.subContainer, borderColor: "red" }}></View>
      <View style={{ ...styles.subContainer, borderColor: "orange" }}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "flex-start",
    marginTop: 50,
    borderWidth: 15,
    borderColor: "blue",
  },
  subContainer: {
    borderWidth: 15,
  },
});
