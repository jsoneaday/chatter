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
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-around",
    marginBottom: 50,
    borderColor: "blue",
    borderWidth: 5,
  },
  subContainer: {
    flex: 0,
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "flex-start",
    borderColor: "red",
    borderWidth: 15,
    height: "25%",
  },
});
