import {
  Animated,
  StyleSheet,
  View,
  TextInput,
  Text,
  Pressable,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { primary, secondary } from "../theme/colors";
import { AntDesign } from "@expo/vector-icons";
import { RingedButton, PrimaryButton, SecondaryButton } from "./buttons";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { defaultDuration } from "../common/animation-utils";
import { bodyFontStyle } from "../theme/element-styles/textStyles";

interface PostMessageButtonProps {
  toggleHalfSheet: () => void;
  height: number;
}

export default function PostMessageButton({
  toggleHalfSheet,
  height,
}: PostMessageButtonProps) {
  const messagePostContainerHeight = useRef(new Animated.Value(0)).current;
  const [showSubmitBtn, setShowSubmitBtn] = useState(true);
  const [showSubmitBody, setShowSubmitBody] = useState(false);

  useEffect(() => {
    messagePostContainerHeight.addListener(({ value }) => {
      value === 0 ? setShowSubmitBody(false) : setShowSubmitBody(true);
    });

    return () => messagePostContainerHeight.removeAllListeners();
  }, []);

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
    if (!showSubmitBtn) {
      Animated.timing(messagePostContainerHeight, {
        toValue: 0,
        duration: defaultDuration,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(messagePostContainerHeight, {
        toValue: height - 50,
        duration: defaultDuration,
        useNativeDriver: false,
      }).start();
    }

    setShowSubmitBtn(!showSubmitBtn);
  };

  const onFocusBody = () => {
    // raise half sheet
  };

  const onPressDropDown = () => {
    toggleHalfSheet();
  };

  return (
    <>
      <Animated.View
        style={{
          ...styles.sheetContainer,
          height: messagePostContainerHeight,
        }}
      >
        {showSubmitBody && (
          <>
            <View style={styles.sheetHeader}>
              <SecondaryButton onPress={onPressCancelMessage}>
                Cancel
              </SecondaryButton>
              <PrimaryButton onPress={onPressSubmitMessage}>Chat</PrimaryButton>
            </View>
            <View style={styles.sheetBody}>
              <View style={styles.sheetBodyHeader}>
                <Ionicons
                  name="person-circle-outline"
                  size={38}
                  color={primary()}
                />
                <RingedButton
                  containerStyle={{ marginLeft: 8 }}
                  onPress={onPressDropDown}
                >
                  <Text style={{ color: secondary() }}>Public</Text>
                  <Entypo
                    name="chevron-small-down"
                    size={20}
                    color={secondary()}
                  />
                </RingedButton>
              </View>
              <TextInput
                style={{ ...(bodyFontStyle as object), paddingLeft: 35 }}
                placeholder="What's happening"
                placeholderTextColor={primary()}
                onFocus={onFocusBody}
              ></TextInput>
            </View>
          </>
        )}
      </Animated.View>
      {showSubmitBtn && (
        <Pressable
          style={styles.submitBtnContainer}
          onPress={onPressShowMessageCreator}
        >
          <AntDesign name="pluscircle" size={50} color={secondary()} />
        </Pressable>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  sheetContainer: {
    backgroundColor: primary(true),
    padding: 15,
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "stretch",
  },
  submitBtnContainer: {
    backgroundColor: primary(true),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingRight: 15,
    paddingBottom: 15,
    width: "100%",
    position: "absolute",
    bottom: 80,
  },
  sheetBody: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  sheetBodyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
});
