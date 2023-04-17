import { Animated, Pressable, StyleSheet, View } from "react-native";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { defaultDuration } from "../common/animation-utils";
import { modalBackgroundColor, primary } from "../theme/colors";
import { bodyFontStyle } from "../theme/element-styles/textStyles";
import DragPill from "./dragPill";

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
  const halfSheetHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (show) {
      console.log("show halfSheet");

      setContainerHeight(height);

      Animated.timing(halfSheetHeight, {
        toValue: (height / 3) * 2,
        duration: defaultDuration,
        useNativeDriver: false,
      }).start();
    } else {
      console.log("hide halfSheet");

      Animated.timing(halfSheetHeight, {
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
        position: "absolute",
        width: "100%",
        bottom: 0,
        height: containerHeight,
        opacity: 0.5,
        backgroundColor: modalBackgroundColor,
      }}
    >
      <Animated.View
        style={{
          ...styles.container,
          height: halfSheetHeight,
        }}
      >
        <View style={{ width: "100%", alignItems: "center", marginBottom: 20 }}>
          <DragPill />
        </View>
        {children}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    ...(bodyFontStyle as object),
    alignItems: "center",
    justifyContent: "flex-start",
    position: "absolute",
    bottom: 0,
    opacity: 1,
    width: "100%",
    backgroundColor: primary(true),
    borderWidth: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderColor: primary(true),
    padding: 15,
  },
});
