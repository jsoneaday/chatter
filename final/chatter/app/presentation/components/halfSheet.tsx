import { Animated, Pressable, StyleSheet } from "react-native";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { defaultDuration } from "../common/animation-utils";
import { modalBackgroundColor, primary } from "../theme/colors";
import { bodyFontStyle } from "../theme/element-styles/textStyles";

interface HalfSheetProps {
  show: boolean;
  toggleShow: () => void;
  height: number;
  children: ReactNode;
}

export default function HalfSheet({
  show,
  toggleShow,
  height,
  children,
}: HalfSheetProps) {
  const [containerHeight, setContainerHeight] = useState(0);
  const halfSheetTop = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (show) {
      console.log("show halfSheet");

      setContainerHeight(height);

      Animated.timing(halfSheetTop, {
        toValue: height / 3,
        duration: defaultDuration,
        useNativeDriver: false,
      }).start();
    } else {
      console.log("hide halfSheet");

      Animated.timing(halfSheetTop, {
        toValue: 0,
        duration: defaultDuration,
        useNativeDriver: false,
      }).start();

      setTimeout(() => {
        setContainerHeight(0);
      }, 300);
    }
  }, [show]);

  return (
    <Pressable
      onPress={toggleShow}
      style={{
        height: containerHeight,
        backgroundColor: modalBackgroundColor,
      }}
    >
      <Animated.View
        style={{
          ...styles.container,
          top: halfSheetTop,
        }}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    ...(bodyFontStyle as object),
    backgroundColor: primary(true),
    borderWidth: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderColor: primary(true),
    height: "100%",
    padding: 15,
  },
});
