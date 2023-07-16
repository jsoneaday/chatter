import { ReactNode } from "react";
import { View, Text } from "react-native";

export function ComponentA({ children }: { children: ReactNode }) {
  return <View>{children}</View>;
}

export function ComponentB() {
  return (
    <View>
      <Text style={{ fontSize: 40 }}>Hello world</Text>
    </View>
  );
}
