import { StyleSheet, Text, View } from "react-native";
import { ComponentA, ComponentB } from "./Components";

export default function App() {
  return (
    <View style={styles.container}>
      <ComponentA>
        <ComponentB />
      </ComponentA>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  txt: { fontSize: 30 },
});
