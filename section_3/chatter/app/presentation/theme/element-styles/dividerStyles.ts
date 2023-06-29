import { Platform } from "react-native";
import { secondary } from "../colors";

export const headerOrFooterStyle = {
  borderOpacity: Platform.OS === "ios" ? 0.05 : 0.2,
  borderColor: secondary(),
  borderStyle: "solid",
  shadowOpacity: 0,
  width: "100%",
  maxHeight: 100,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
};

export const listBottomDividerStyle = {
  borderOpacity: Platform.OS === "ios" ? 0.05 : 0.2,
  borderBottomWidth: Platform.OS === "ios" ? 0.17 : 0.2,
  borderColor: secondary(),
  borderStyle: "solid",
  shadowOpacity: 0,
};
