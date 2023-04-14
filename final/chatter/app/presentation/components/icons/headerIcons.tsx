import { Entypo, Ionicons } from "@expo/vector-icons";
import { IconProps } from "./iconPropType";
import { primary } from "../../theme/colors";

export function Logo({ size }: IconProps) {
  return <Entypo name="network" size={size} color={primary()} />;
}

export function Profile({ size }: IconProps) {
  return (
    <Ionicons name="person-circle-outline" size={size} color={primary()} />
  );
}

export function Config({ size }: IconProps) {
  return <Ionicons name="settings-outline" size={size} color={primary()} />;
}
