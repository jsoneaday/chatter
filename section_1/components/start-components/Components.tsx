import React from "react";
import { View, Text } from "react-native";

export function ComponentA({ children }: { children: React.ReactNode }) {
  return <View>{children}</View>;
}

export function ComponentB() {
  return <Text style={{ fontSize: 40 }}>Hello world from B</Text>;
}
