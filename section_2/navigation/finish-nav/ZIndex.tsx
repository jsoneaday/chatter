import { StyleSheet, View } from "react-native";

export function TestZIndex() {
  return (
    <View style={styles.container}>
      <View
        style={{ ...styles.subContainer, backgroundColor: "red", zIndex: 3 }}
      ></View>
      <View
        style={{
          ...styles.subContainer,
          backgroundColor: "orange",
          zIndex: 2,
          top: -100,
        }}
      ></View>
      <View
        style={{
          ...styles.subContainer,
          backgroundColor: "green",
          zIndex: 1,
          top: -200,
        }}
      ></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "blue",
    borderWidth: 5,
  },
  subContainer: {
    height: 200,
    width: "100%",
  },
});
