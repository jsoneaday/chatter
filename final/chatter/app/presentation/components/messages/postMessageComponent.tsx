import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Pressable,
  Keyboard,
  ViewStyle,
  StyleProp,
} from "react-native";
import React, { useEffect, useState } from "react";
import { primary, secondary, tertiary } from "../../theme/colors";
import { AntDesign } from "@expo/vector-icons";
import {
  RingedButton,
  PrimaryButton,
  SecondaryButton,
} from "../buttons/buttons";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { bodyFontStyle } from "../../theme/element-styles/textStyles";
import KeyboardToolBar from "../toolBars/keyboardToolBar";
import { MSG_URL } from "../../../domain/utils/api";
import FullSheet from "../modals/fullSheet";
import { MessageAccessibility } from "../icons/messageAccessibilityType";
import { visibleBorder } from "../../theme/visibleBorder";

interface PostMessageButtonProps {
  togglePostMsgGroupSelector: () => void;
  toggleSelf: () => void;
  show: boolean;
  messageAccessibility: MessageAccessibility;
}

export default function PostMessageComponent({
  togglePostMsgGroupSelector,
  toggleSelf,
  show,
  messageAccessibility,
}: PostMessageButtonProps) {
  const [showSubmitBtn, setShowSubmitBtn] = useState(true);
  const [keyboardBarStyle, setKeyboardBarStyle] = useState<
    StyleProp<ViewStyle>
  >({ width: "100%" });
  const [showKeyboardTabBar, setShowKeyboardTabBar] = useState(false);
  const [messageValue, setMessageValue] = useState("");

  useEffect(() => {
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
      keyboardShow.remove();
      keyboardDismiss.remove();
    };
  }, []);

  const onChangeText = (text: string) => {
    setMessageValue(text);
  };

  const onPressCancelMessage = () => {
    toggleShowPostMessageDialog();
  };

  const onPressSubmitMessage = async () => {
    const result = await fetch(`${MSG_URL}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: 1,
        body: messageValue,
      }),
    });

    if (result.ok) {
      console.log("result", await result.json());
      setMessageValue("");
      toggleShowPostMessageDialog();
    } else {
      console.log("result", result.statusText);
    }
  };

  const onPressShowPostMessageDialog = () => {
    toggleShowPostMessageDialog();
  };

  const toggleShowPostMessageDialog = () => {
    setShowSubmitBtn(!showSubmitBtn);
    toggleSelf();
  };

  const onPressDropDown = () => {
    togglePostMsgGroupSelector();
  };

  return (
    <>
      <FullSheet show={show}>
        {!showSubmitBtn && (
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
                    <Text style={{ color: secondary() }}>
                      {messageAccessibility}
                    </Text>
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
                />
              </View>
              <KeyboardToolBar
                show={showKeyboardTabBar}
                style={keyboardBarStyle}
              />
            </View>
          </>
        )}
      </FullSheet>

      {showSubmitBtn && (
        <Pressable
          style={styles.submitBtnContainer}
          onPress={onPressShowPostMessageDialog}
        >
          <AntDesign name="pluscircle" size={50} color={secondary()} />
        </Pressable>
      )}
    </>
  );
}

const styles = StyleSheet.create({
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
    paddingRight: 10,
  },
});
