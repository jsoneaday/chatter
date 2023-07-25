import React, { ReactNode, useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { horizontalSlideDuration } from "../../common/animationUtils";
import { modalBackgroundColor, primary } from "../../theme/colors";
import { bodyFontStyle } from "../../theme/element-styles/textStyles";

export enum SlideInFromSide {
  Left,
  Right,
}

interface SlideInSheetProps {
  show: boolean;
  toggleShow: () => void;
  children: ReactNode;
  maxWidth?: number;
}

export default function SlideInSheet({
  show,
  toggleShow,
  children,
  maxWidth,
}: SlideInSheetProps) {
  const windowDimensions = useWindowDimensions();
  const right = useRef(new Animated.Value(windowDimensions.width)).current;

  useEffect(() => {
    if (show) {
      Animated.timing(right, {
        toValue: maxWidth
          ? windowDimensions.width - maxWidth
          : windowDimensions.width,
        duration: horizontalSlideDuration,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(right, {
        toValue: windowDimensions.width,
        duration: horizontalSlideDuration,
        useNativeDriver: false,
      }).start();
    }
  }, [show]);

  return (
    <>
      <Pressable
        style={{
          ...styles.container,
          width: show ? windowDimensions.width : 0,
        }}
        onPress={toggleShow}
      />
      <Animated.View
        style={{
          ...styles.animatedContainer,
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    height: "100%",
    bottom: 0,
    opacity: 0.25,
    backgroundColor: modalBackgroundColor,
  },
  animatedContainer: {
    ...(bodyFontStyle as object),
    height: "100%",
    position: "absolute",
    backgroundColor: primary(true),
  },
  childContainer: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
