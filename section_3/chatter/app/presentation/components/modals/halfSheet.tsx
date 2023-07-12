import {
  Animated,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { verticalSlideDuration } from "../../common/animationUtils";
import { modalBackgroundColor, primary } from "../../theme/colors";
import { bodyFontStyle } from "../../theme/element-styles/textStyles";
import DragPill from "../buttons/dragPill";

interface HalfSheetProps {
  show: boolean;
  toggleShow: () => void;
  children: ReactNode;
  sheetHeightDenom?: number;
}

export default function HalfSheet({
  show,
  toggleShow,
  children,
  sheetHeightDenom = 3,
}: HalfSheetProps) {
  const [containerHeight, setContainerHeight] = useState(0);
  const halfSheetHeight = useRef(new Animated.Value(0)).current;
  const windowsDimension = useWindowDimensions();

  useEffect(() => {
    if (show) {
      setContainerHeight(windowsDimension.height);

      Animated.timing(halfSheetHeight, {
        toValue: (windowsDimension.height / sheetHeightDenom) * 2,
        duration: verticalSlideDuration,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(halfSheetHeight, {
        toValue: 0,
        duration: verticalSlideDuration,
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
          ...styles.container,
          height: containerHeight,
        }}
      />
      <Animated.View
        style={{
          ...styles.animatedContainer,
          height: halfSheetHeight,
        }}
      >
        <View
          style={{
            width: "100%",
            alignItems: "center",
            marginTop: 5,
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
    position: "absolute",
    width: "100%",
    bottom: 0,
    opacity: 0.25,
    backgroundColor: modalBackgroundColor,
  },
  animatedContainer: {
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
  },
});
