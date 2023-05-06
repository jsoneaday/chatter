import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { primary, secondary } from "../../theme/colors";
import { tertiary } from "../../theme/colors";

export enum MessageAccessibility {
  Public = "Public",
  Circle = "Chatter Circle",
}

interface MessageAccessibilityTypeProps {
  type: MessageAccessibility;
}

export default function MessageAccessiblityTypeIcon({
  type,
}: MessageAccessibilityTypeProps) {
  switch (type) {
    case MessageAccessibility.Public:
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
    case MessageAccessibility.Circle:
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
