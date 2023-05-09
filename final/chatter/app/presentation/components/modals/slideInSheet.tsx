import React, { ReactNode, useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { horizontalSlideDuration } from "../../common/animationUtils";

export enum SlideInFromSide {
  Left,
  Right,
}

interface SlideInSheetProps {
  slideInFromSide: SlideInFromSide;
  show: boolean;
  toggleShow: () => void;
  children: ReactNode;
  maxWidth?: number;
}

export default function SlideInSheet({
  slideInFromSide,
  show,
  toggleShow,
  children,
  maxWidth,
}: SlideInSheetProps) {
  const windowDimensions = useWindowDimensions();
  // right's normal starting value is screen width (or container width)
  // left's normal starting value is 0
  const right = useRef(new Animated.Value(windowDimensions.width)).current;

  useEffect(() => {
    if (show) {
      Animated.timing(right, {
        toValue: maxWidth
          ? windowDimensions.width - maxWidth
          : windowDimensions.width,
        duration: horizontalSlideDuration + 400,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(right, {
        toValue: windowDimensions.width,
        duration: horizontalSlideDuration + 400,
        useNativeDriver: false,
      }).start();
    }
  }, [show]);

  const getCorrectLeftRightCoordinate = () => {
    if (slideInFromSide === SlideInFromSide.Left) {
      return {
        left: 0,
        right: right,
      };
    }
    return {
      left: right,
      right: 0,
    };
  };

  return (
    <Animated.View
      style={{
        ...styles.container,
        width: maxWidth ? maxWidth : windowDimensions.width,
        right,
      }}
    >
      {show && (
        <Pressable onPress={toggleShow} style={styles.childContainer}>
          {children}
        </Pressable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "blue",
    opacity: 0.5,
    height: "100%",
    position: "absolute",
  },
  childContainer: {
    backgroundColor: "red",
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
