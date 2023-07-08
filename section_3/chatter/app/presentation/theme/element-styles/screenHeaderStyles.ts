import { Platform } from "react-native";

export const headerStyle = {
  height: Platform.OS === "ios" ? 108 : 88,
};
