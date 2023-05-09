import React from "react";
import SlideInSheet, { SlideInFromSide } from "../modals/slideInSheet";
import { useWindowDimensions } from "react-native";
import { useSlideMenuOpener } from "../../../domain/store/slideMenuOpener/slideMenuOpenerHooks";
import { Text } from "react-native";

export default function LeftSlideMenu() {
  const [show, setShow] = useSlideMenuOpener();
  const windowDimensions = useWindowDimensions();

  const toggleShow = () => {
    setShow(!show);
  };

  return (
    <SlideInSheet
      show={show}
      toggleShow={toggleShow}
      slideInFromSide={SlideInFromSide.Left}
      maxWidth={windowDimensions.width / 0.1}
    >
      <Text>Hello</Text>
    </SlideInSheet>
  );
}
