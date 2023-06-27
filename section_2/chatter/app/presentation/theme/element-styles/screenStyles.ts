import { primary } from "../colors";
import { bodyFontStyle } from "./textStyles";

export const containerStyle = {
  ...bodyFontStyle,
  flex: 1,
  alignSelf: "stretch",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  backgroundColor: primary(true),
};
