import React, { ReactNode, useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { defaultDuration } from "../../common/animationUtils";

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
  const width = useRef(new Animated.Value(0)).current;
  const windowDimensions = useWindowDimensions();

  useEffect(() => {
    if (show) {
      console.log("width", maxWidth ? maxWidth : windowDimensions.width);
      Animated.timing(width, {
        toValue: maxWidth ? maxWidth : windowDimensions.width,
        duration: defaultDuration,
        useNativeDriver: false,
      }).start();
    } else {
      console.log("width", 0);
      Animated.timing(width, {
        toValue: 0,
        duration: defaultDuration,
        useNativeDriver: false,
      }).start();
    }
  }, [show]);

  const getCorrectLeftRightCoordinate = () => {
    if (slideInFromSide === SlideInFromSide.Left) {
      return {
        left: 0,
        right: width,
      };
    }
    return {
      left: width,
      right: 0,
    };
  };

  return (
    <Animated.View style={{ ...styles.container, width }}>
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
    alignItems: "center",
    justifyContent: "center",
  },
});
