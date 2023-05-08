import React, { useState } from "react";
import SlideInSheet, { SlideInFromSide } from "../modals/slideInSheet";
import { useWindowDimensions } from "react-native/types";

interface LeftSlideMenuProps {
  show: boolean;
  toggleShow: () => void;
}

export default function LeftSlideMenu({
  show,
  toggleShow,
}: LeftSlideMenuProps) {
  const windowDimensions = useWindowDimensions();

  return (
    <SlideInSheet
      show={show}
      toggleShow={toggleShow}
      slideInFromSide={SlideInFromSide.Left}
      maxWidth={windowDimensions.width / 0.1}
    >
      Hello
    </SlideInSheet>
  );
}
