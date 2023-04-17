import { StyleSheet, View } from "react-native";
import { primary } from "../theme/colors";

export default function DragPill() {
  return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  container: {
    width: 35,
    height: 4,
    borderWidth: 1,
    borderColor: primary(),
  },
});
