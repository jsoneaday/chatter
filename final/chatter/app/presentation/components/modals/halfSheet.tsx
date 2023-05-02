import {
  Animated,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { defaultDuration } from "../../common/animationUtils";
import { modalBackgroundColor, primary } from "../../theme/colors";
import { bodyFontStyle } from "../../theme/element-styles/textStyles";
import DragPill from "../buttons/dragPill";

interface HalfSheetProps {
  show: boolean;
  toggleShow: () => void;
  children: ReactNode;
}

export default function HalfSheet({
  show,
  toggleShow,
  children,
}: HalfSheetProps) {
  const [containerHeight, setContainerHeight] = useState(0);
  const halfSheetHeight = useRef(new Animated.Value(0)).current;
  const windowsDimension = useWindowDimensions();

  useEffect(() => {
    if (show) {
      setContainerHeight(windowsDimension.height);

      Animated.timing(halfSheetHeight, {
        toValue: (windowsDimension.height / 3) * 2,
        duration: defaultDuration,
        useNativeDriver: false,
      }).start();
    } else {
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
    <>
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
      />
      <Animated.View
        style={{
          ...styles.container,
          height: halfSheetHeight,
        }}
      >
        <View
          style={{
            width: "100%",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <DragPill />
        </View>
        {children}
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    ...(bodyFontStyle as object),
    alignItems: "center",
    justifyContent: "flex-start",
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: primary(true),
    borderWidth: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderColor: primary(true),
    padding: 15,
  },
});
