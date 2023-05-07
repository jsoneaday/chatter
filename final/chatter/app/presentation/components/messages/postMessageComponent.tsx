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
import {
  bodyFontStyle,
  headerFontStyle,
} from "../../theme/element-styles/textStyles";
import KeyboardToolBar from "../toolBars/keyboardToolBar";
import { MSG_URL } from "../../../domain/utils/api";
import FullSheet from "../modals/fullSheet";
import { MessageAccessibility } from "../icons/messageAccessibilityType";
import PostMessageGroupSelector from "./postMessageGroupSelector";
import HalfSheet from "../modals/halfSheet";
import { DeleteIcon, SaveDraftIcon } from "../icons/messageEarlyExitIcons";
import Spacer from "../spacer";
import BottomButton from "../buttons/bottomButtons";

interface PostMessageButtonProps {
  toggleSelf: () => void;
  show: boolean;
}

export default function PostMessageComponent({
  toggleSelf,
  show,
}: PostMessageButtonProps) {
  const [showSubmitBtn, setShowSubmitBtn] = useState(true);
  const [keyboardBarStyle, setKeyboardBarStyle] = useState<
    StyleProp<ViewStyle>
  >({ width: "100%" });
  const [showKeyboardTabBar, setShowKeyboardTabBar] = useState(false);
  const [messageValue, setMessageValue] = useState("");
  const [showPostMsgGroupSelector, setShowPostMsgGroupSelector] =
    useState(false);
  const [currentMessageAccessibility, setCurrentMessageAccessibility] =
    useState<MessageAccessibility>(MessageAccessibility.Public);
  const [showEarlyExitSheet, setEarlyExitSheet] = useState(false);

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

  const toggleEarlyExitSheet = () => {
    setEarlyExitSheet(!showEarlyExitSheet);
  };

  const togglePostMsgGroupSelector = () => {
    setShowPostMsgGroupSelector(!showPostMsgGroupSelector);
  };

  const onChangeText = (text: string) => {
    setMessageValue(text);
  };

  const onPressCancelMessage = () => {
    if (!messageValue) {
      toggleShowPostMessageDialog();
    } else {
      toggleEarlyExitSheet();
    }
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
                      {currentMessageAccessibility}
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

      <EarlyExitDeleteOrSave
        show={showEarlyExitSheet}
        toggleSelf={toggleEarlyExitSheet}
      />

      {showSubmitBtn && (
        <Pressable
          style={styles.submitBtnContainer}
          onPress={onPressShowPostMessageDialog}
        >
          <AntDesign name="pluscircle" size={50} color={secondary()} />
        </Pressable>
      )}

      <PostMessageGroupSelector
        show={showPostMsgGroupSelector}
        toggleSelf={togglePostMsgGroupSelector}
        setMessageAccessibility={setCurrentMessageAccessibility}
      />
    </>
  );
}

interface EarlyExitDeleteOrSaveProps {
  show: boolean;
  toggleSelf: () => void;
}

function EarlyExitDeleteOrSave({
  show,
  toggleSelf,
}: EarlyExitDeleteOrSaveProps) {
  const onCancelEarlyExit = () => {
    toggleSelf();
  };

  return (
    <HalfSheet show={show} toggleShow={toggleSelf} sheetHeightDenom={5}>
      {show && (
        <>
          <View style={styles.earlyExitContainer}>
            <View style={styles.exitItem}>
              <DeleteIcon size={25} />
              <Spacer width={20} />
              <Text style={{ ...styles.exitItemTxt, color: "red" }}>
                Delete
              </Text>
            </View>
            <View style={styles.exitItem}>
              <SaveDraftIcon size={25} />
              <Spacer width={20} />
              <Text style={styles.exitItemTxt}>Save draft</Text>
            </View>
          </View>
          <BottomButton
            isInverted={true}
            onPressBottomButton={onCancelEarlyExit}
          >
            Cancel
          </BottomButton>
        </>
      )}
    </HalfSheet>
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
  earlyExitContainer: {
    justifyContent: "flex-start",
    alignSelf: "stretch",
    marginTop: 30,
    paddingHorizontal: 30,
  },
  exitItem: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 30,
  },
  exitItemTxt: {
    ...bodyFontStyle,
  },
});
