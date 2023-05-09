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
  const windowDimensions = useWindowDimensions();
  const width = useRef(new Animated.Value(-1 * windowDimensions.width)).current;

  useEffect(() => {
    if (show) {
      console.log(
        "maxWidth show",
        maxWidth,
        maxWidth ? maxWidth : windowDimensions.width
      );
      Animated.timing(width, {
        toValue: maxWidth
          ? windowDimensions.width - maxWidth
          : windowDimensions.width,
        duration: defaultDuration + 500,
        useNativeDriver: false,
      }).start();
    } else {
      console.log("maxWidth no show", 0);
      Animated.timing(width, {
        toValue: windowDimensions.width,
        duration: defaultDuration + 500,
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
    <Animated.View
      style={{
        ...styles.container,
        zIndex: 1,
        width: maxWidth ? maxWidth : windowDimensions.width,
        right: width,
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
