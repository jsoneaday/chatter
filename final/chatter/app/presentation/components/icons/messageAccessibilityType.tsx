import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { primary, secondary } from "../../theme/colors";
import { tertiary } from "../../theme/colors";

export enum Accessor {
  Public,
  Circle,
}

interface MessageAccessibilityTypeProps {
  type: Accessor;
}

export default function MessageAccessiblityType({
  type,
}: MessageAccessibilityTypeProps) {
  switch (type) {
    case Accessor.Public:
      return (
        <View style={{ ...styles.container, backgroundColor: secondary() }}>
          <View
            style={{
              backgroundColor: primary(true),
              borderRadius: 50,
            }}
          >
            <Ionicons name="earth" size={35} color="black" />
          </View>
        </View>
      );
    case Accessor.Circle:
      return (
        <View style={{ ...styles.container, backgroundColor: tertiary() }}>
          <View
            style={{
              backgroundColor: primary(true),
              borderRadius: 50,
            }}
          >
            <MaterialIcons name="person-add-alt" size={35} color="black" />
          </View>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderRadius: 15,
  },
});
