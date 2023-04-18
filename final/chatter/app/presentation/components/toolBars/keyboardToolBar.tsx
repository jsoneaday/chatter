import { StyleProp, ViewStyle, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface KeyboardToolBarProps {
  show: boolean;
  style: StyleProp<ViewStyle>;
}

export default function KeyboardToolBar({ show, style }: KeyboardToolBarProps) {
  return show ? (
    <View style={style}>
      <Text>
        <Ionicons name="md-image-outline" size={24} color="black" />
      </Text>
    </View>
  ) : null;
}
