import React, { useState } from "react";
import { View, Text, Dimensions } from "react-native";
import PostMessageButton from "../../components/postMessageButton";
import { containerStyle } from "../../theme/element-styles/screenStyles";
import HalfSheet from "../../components/halfSheet";
import { modalBackgroundColor, primary } from "../../theme/colors";

interface HomeProps {
  toggleModal: () => void;
}

export default function Home({ toggleModal }: HomeProps) {
  const [localModalBackgroundColor, setLocalModalBackgroundColor] =
    useState<string>(primary(true));
  const [showHomeSheet, setShowHomeSheet] = useState(false);

  const toggleHomeSheet = () => {
    setShowHomeSheet(!showHomeSheet);
  };

  const toggleLocalModal = () => {
    toggleModal();
    setLocalModalBackgroundColor(
      localModalBackgroundColor === primary(true)
        ? modalBackgroundColor
        : primary(true)
    );
  };

  return (
    <>
      <View style={{ ...(containerStyle as object) }}>
        <Text>Home</Text>
      </View>

      <PostMessageButton toggleHomeSheet={toggleHomeSheet} />

      {showHomeSheet && (
        <View
          style={{
            width: "100%",
            position: "absolute",
            height: Dimensions.get("screen").height,
            backgroundColor: modalBackgroundColor,
            zIndex: 2,
            elevation: 2,
            borderWidth: 1,
            borderColor: "blue",
          }}
        >
          <HalfSheet show={showHomeSheet} toggleModal={toggleLocalModal}>
            <Text>testing</Text>
          </HalfSheet>
        </View>
      )}
    </>
  );
}
