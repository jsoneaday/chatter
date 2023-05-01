import React, { useRef, ReactNode, useEffect, useState } from "react";
import { Animated, StyleSheet, useWindowDimensions } from "react-native";
import { primary } from "../../theme/colors";
import { defaultDuration } from "../../common/animationUtils";

interface FullSheetProps {
  children: ReactNode;
  show: boolean;
}

export default function FullSheet({ children, show }: FullSheetProps) {
  const sheetContainerHeight = useRef(new Animated.Value(0)).current;
  const windowDimension = useWindowDimensions();

  useEffect(() => {
    sheetContainerHeight.addListener(({ value }) => {});

    return () => {
      sheetContainerHeight.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    if (show) {
      console.log("show full sheet", show);
      Animated.timing(sheetContainerHeight, {
        toValue: windowDimension.height - 50,
        duration: defaultDuration,
        useNativeDriver: false,
      }).start();
    } else {
      console.log("hide full sheet", show);
      Animated.timing(sheetContainerHeight, {
        toValue: 0,
        duration: defaultDuration,
        useNativeDriver: false,
      }).start();
    }
  }, [show]);

  return (
    <Animated.View
      style={{
        ...styles.container,
        height: sheetContainerHeight,
      }}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: primary(true),
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
});
