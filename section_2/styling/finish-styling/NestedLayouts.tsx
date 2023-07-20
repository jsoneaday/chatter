import { StyleSheet, View } from "react-native";

export function RootContainer() {
  return (
    <View style={styles.rootContainer}>
      <View style={styles.subContainer}></View>
      <View style={{ ...styles.subContainer, borderColor: "orange" }}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-around",
    marginBottom: 50,
    borderColor: "blue",
    borderWidth: 5,
  },
  subContainer: {
    flex: 1,
    borderColor: "red",
    borderWidth: 15,
  },
});
