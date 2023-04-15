import { View } from "react-native";

export default function Spacer({
  width = "auto",
}: {
  width?: number | string;
}) {
  return <View style={{ width }} />;
}
