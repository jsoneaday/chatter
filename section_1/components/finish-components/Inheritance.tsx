import React from "react";
import { View, Text } from "react-native";

export class ClassA extends React.Component {
  render() {
    return <Text style={{ fontSize: 40 }}>Hello world</Text>;
  }
}

export class ClassB extends ClassA {}
