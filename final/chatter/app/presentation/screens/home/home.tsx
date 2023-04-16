import React, { useState } from "react";
import { View, Text, Dimensions, Pressable } from "react-native";
import PostMessageButton from "../../components/postMessageButton";
import { containerStyle } from "../../theme/element-styles/screenStyles";

interface HomeProps {
  toggleHalfSheet: () => void;
}

export default function Home({ toggleHalfSheet }: HomeProps) {
  return (
    <>
      <View style={{ ...(containerStyle as object) }}>
        <Text>Home</Text>
      </View>

      <PostMessageButton toggleHalfSheet={toggleHalfSheet} />
    </>
  );
}
