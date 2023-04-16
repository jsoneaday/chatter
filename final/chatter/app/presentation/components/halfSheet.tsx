import { Animated, Dimensions, SafeAreaView, StyleSheet } from "react-native";
import React, { ReactNode, useEffect, useRef } from "react";
import { defaultDuration } from "../common/animation-utils";
import { primary } from "../theme/colors";
import { bodyFontStyle } from "../theme/element-styles/textStyles";

interface HalfSheetProps {
  show: boolean;
  toggleModal: () => void;
  children: ReactNode;
}

export default function HalfSheet({
  show,
  toggleModal,
  children,
}: HalfSheetProps) {
  const halfSheetTop = useRef(
    new Animated.Value(Dimensions.get("window").height)
  ).current;

  useEffect(() => {
    if (show) {
      Animated.timing(halfSheetTop, {
        toValue: Dimensions.get("window").height / 3,
        duration: defaultDuration,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(halfSheetTop, {
        toValue: 0,
        duration: defaultDuration,
        useNativeDriver: false,
      }).start();
    }
    toggleModal();
  }, [show]);

  return (
    <SafeAreaView>
      <Animated.View
        style={{
          ...styles.container,
          top: halfSheetTop,
        }}
      >
        {children}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...(bodyFontStyle as object),
    backgroundColor: primary(true),
    borderWidth: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: primary(true),
    height: "100%",
    padding: 15,
    zIndex: 3,
    elevation: 3,
  },
});
