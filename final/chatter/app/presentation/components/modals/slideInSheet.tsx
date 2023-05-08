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
      Animated.timing(width, {
        toValue: maxWidth ? maxWidth : windowDimensions.width,
        duration: defaultDuration,
        useNativeDriver: false,
      });
    } else {
      Animated.timing(width, {
        toValue: 0,
        duration: defaultDuration,
        useNativeDriver: false,
      });
    }
  }, [show]);

  const getCorrectPosition = () => {
    if (slideInFromSide === SlideInFromSide.Left) {
      return {
        right: width,
      };
    }
    return {
      left: width,
    };
  };

  return (
    <Animated.View
      style={{ ...styles.container, ...getCorrectPosition(), zIndex: 1 }}
    >
      <Pressable onPress={toggleShow}>{show && children}</Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
});
