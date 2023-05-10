import { primary } from "../../theme/colors";
import { IconProps } from "./iconPropType";
import { FontAwesome5 } from "@expo/vector-icons";

export function ProfileMenuIcon({ size }: IconProps) {
  return <FontAwesome5 name="user" size={size} color={primary()} />;
}
