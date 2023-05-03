import React, { useRef, ReactNode, useEffect, useState } from "react";
import { Animated, StyleSheet, View, useWindowDimensions } from "react-native";
import { defaultDuration } from "../../common/animationUtils";
import { containerStyle } from "../../theme/element-styles/screenStyles";

const topLimiter = 60;

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
        toValue: windowDimension.height,
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
      <View
        style={{
          ...styles.childContainer,
          // container View generally do not automatically expand to fill their space
          // therefore we need to set the height and width
          // so the topLimiter is needed to prevent the bottom of this view from going below the visible screen,
          // and causing cascading effects to children
          height: windowDimension.height - topLimiter,
        }}
      >
        {children}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...(containerStyle as object),
    alignItems: "flex-start",
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  childContainer: {
    marginTop: topLimiter,
    width: "100%",
  },
});
