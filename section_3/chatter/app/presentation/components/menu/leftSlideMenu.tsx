import React from "react";
import SlideInSheet, { SlideInFromSide } from "../modals/slideInSheet";
import { useWindowDimensions } from "react-native";
import { useSlideMenuOpener } from "../../../domain/store/slideMenuOpener/slideMenuOpenerHooks";
import LeftSlideMenuItems from "./leftSlideMenuItems";

export default function LeftSlideMenu() {
  const [show, setShow] = useSlideMenuOpener();
  const windowDimensions = useWindowDimensions();
  const currentProfile = {
    fullName: "John David",
    userName: "jon_dave",
  };

  const toggleShow = () => {
    setShow(!show);
  };

  return (
    <SlideInSheet
      show={show}
      toggleShow={toggleShow}
      slideInFromSide={SlideInFromSide.Left}
      maxWidth={windowDimensions.width * 0.85}
    >
      <LeftSlideMenuItems
        fullName={currentProfile.fullName}
        userName={currentProfile.userName}
      />
    </SlideInSheet>
  );
}
