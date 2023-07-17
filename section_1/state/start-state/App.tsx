import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function App() {
  const [counter, setCounter] = useState(0);

  const onPress = () => {
    setCounter(counter + 1);
  };
  return (
    <View style={styles.container}>
      <Pressable onPress={onPress}>
        <Text style={styles.txt}>Click me</Text>
      </Pressable>
      <Text style={styles.txt}>{counter}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  txt: { fontSize: 30 },
});
