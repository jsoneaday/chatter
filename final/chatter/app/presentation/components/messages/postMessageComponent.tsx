import {
  Animated,
  StyleSheet,
  View,
  TextInput,
  Text,
  Pressable,
  Keyboard,
  ViewStyle,
  StyleProp,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { primary, secondary, tertiary } from "../../theme/colors";
import { AntDesign } from "@expo/vector-icons";
import {
  RingedButton,
  PrimaryButton,
  SecondaryButton,
} from "../buttons/buttons";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { defaultDuration } from "../../common/animation-utils";
import { bodyFontStyle } from "../../theme/element-styles/textStyles";
import KeyboardToolBar from "../toolBars/keyboardToolBar";

interface PostMessageButtonProps {
  toggleHalfSheet: () => void;
  height: number;
}

export default function PostMessageComponent({
  toggleHalfSheet,
  height,
}: PostMessageButtonProps) {
  const messagePostContainerHeight = useRef(new Animated.Value(0)).current;
  const [showSubmitBtn, setShowSubmitBtn] = useState(true);
  const [showSubmitBody, setShowSubmitBody] = useState(false);
  const [keyboardBarStyle, setKeyboardBarStyle] = useState<
    StyleProp<ViewStyle>
  >({ width: "100%" });
  const [showKeyboardTabBar, setShowKeyboardTabBar] = useState(false);
  const [messageValue, setMessageValue] = useState("");

  useEffect(() => {
    messagePostContainerHeight.addListener(({ value }) => {
      value === 0 ? setShowSubmitBody(false) : setShowSubmitBody(true);
    });

    const keyboardShow = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardBarStyle({
        width: "100%",
        position: "absolute",
        paddingHorizontal: 10,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderColor: tertiary(),
        top: e.endCoordinates.height + 92,
      });
      setShowKeyboardTabBar(true);
    });
    const keyboardDismiss = Keyboard.addListener("keyboardDidHide", () => {
      setShowKeyboardTabBar(false);
    });

    return () => {
      messagePostContainerHeight.removeAllListeners();
      keyboardShow.remove();
      keyboardDismiss.remove();
    };
  }, []);

  const onChangeText = (text: string) => {
    setMessageValue(text);
  };

  const onPressCancelMessage = () => {
    toggleShowMessageCreator();
  };

  const onPressSubmitMessage = async () => {
    const result = await fetch("http://localhost:4001/v1/msg", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: 1,
        body: messageValue,
      }),
    });

    if (result.ok) {
      console.log("result", await result.json());
    } else {
      console.log("result", result.statusText);
    }
    setMessageValue("");
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

  const onPressDropDown = () => {
    toggleHalfSheet();
  };

  return (
    <>
      <Animated.View
        style={{
          ...styles.container,
          height: messagePostContainerHeight,
        }}
      >
        {showSubmitBody && (
          <>
            <View style={styles.header}>
              <SecondaryButton onPress={onPressCancelMessage}>
                Cancel
              </SecondaryButton>
              <PrimaryButton onPress={onPressSubmitMessage}>Chat</PrimaryButton>
            </View>
            <View style={styles.body}>
              <View style={{ width: "100%" }}>
                <View style={styles.bodyTop}>
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
                  style={{ ...styles.txtInput }}
                  autoFocus={true}
                  autoCapitalize="sentences"
                  maxLength={140}
                  multiline={true}
                  placeholder="What's happening"
                  placeholderTextColor={primary()}
                  onSubmitEditing={Keyboard.dismiss}
                  value={messageValue}
                  onChangeText={onChangeText}
                ></TextInput>
              </View>
              <KeyboardToolBar
                show={showKeyboardTabBar}
                style={keyboardBarStyle}
              />
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
  container: {
    backgroundColor: primary(true),
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "stretch",
    paddingHorizontal: 15,
    marginBottom: 10,
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
  body: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    margin: 5,
  },
  bodyTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 15,
  },
  txtInput: {
    ...(bodyFontStyle as object),
    paddingLeft: 60,
  },
});
