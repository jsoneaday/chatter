import {
  Animated,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  SafeAreaView,
  Dimensions,
} from "react-native";
import React, { useRef, useState } from "react";
import { primary, secondary } from "../theme/colors";
import { AntDesign } from "@expo/vector-icons";
import { PrimaryButton, SecondaryButton } from "./buttons";

export default function PostMessageButton() {
  const messagePostContainerHeight = useRef(new Animated.Value(0)).current;
  const [showSubmitBtn, setShowSubmitBtn] = useState(true);

  const onPressCancelMessage = () => {
    toggleShowMessageCreator();
  };

  const onPressSubmitMessage = () => {
    throw new Error("not implemented");
  };

  const onPressShowMessageCreator = () => {
    toggleShowMessageCreator();
  };

  const toggleShowMessageCreator = () => {
    console.log(
      "window height",
      Dimensions.get("window").height,
      showSubmitBtn
    );
    if (!showSubmitBtn) {
      Animated.timing(messagePostContainerHeight, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(messagePostContainerHeight, {
        toValue: Dimensions.get("window").height,
        duration: 250,
        useNativeDriver: false,
      }).start();
    }

    setShowSubmitBtn(!showSubmitBtn);
  };

  return (
    <SafeAreaView>
      <Animated.View
        style={{
          ...styles.sheetContainer,
          height: messagePostContainerHeight,
        }}
      >
        {!showSubmitBtn && (
          <>
            <View style={styles.sheetHeader}>
              <SecondaryButton onPress={onPressCancelMessage}>
                Cancel
              </SecondaryButton>
              <PrimaryButton onPress={onPressSubmitMessage}>Chat</PrimaryButton>
            </View>
            <View>
              <Text>Body</Text>
            </View>
          </>
        )}
      </Animated.View>
      {showSubmitBtn && (
        <View style={styles.submitBtn}>
          <TouchableOpacity onPress={onPressShowMessageCreator}>
            <AntDesign name="pluscircle" size={50} color={secondary()} />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sheetContainer: {
    backgroundColor: primary(true),
    padding: 15,
    zIndex: 4,
    elevation: 4,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "stretch",
  },
  submitBtn: {
    backgroundColor: primary(true),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingRight: 15,
    paddingBottom: 15,
  },
});
