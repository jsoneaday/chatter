import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Pressable,
  Keyboard,
  ViewStyle,
  StyleProp,
  Image,
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
import FullSheet from "../modals/fullSheet";
import { MessageAccessibility } from "../icons/messageAccessibilityType";
import PostMessageGroupSelector from "./postMessageGroupSelector";
import HalfSheet from "../modals/halfSheet";
import { DeleteIcon, SaveDraftIcon } from "../icons/messageEarlyExitIcons";
import Spacer from "../spacer";
import BottomButton from "../buttons/bottomButtons";
import { asyncStorage } from "../../../domain/local/asyncStorage";
import {
  ApiMessageGroupType,
  createMessage,
  createMessageResponse,
  getMessage,
} from "../../../domain/entities/message";
import { useProfile } from "../../../domain/store/profile/profileHooks";
import { usePostMessageSheetOpener } from "../../../domain/store/postMessageSheetOpener/postMessageSheetOpenerHooks";
import { TypeOfPost } from "../../../domain/store/postMessageSheetOpener/postMessageSheetOpenerSlice";
import ResentItem from "./messageList/resentItem";
import MessageModel from "../../common/models/message";

const LAST_POSTED_MESSAGE_KEY = "LAST_POSTED_MESSAGE_KEY";

export default function PostMessageComponent() {
  const [showPostMessageSheet, setShowPostMessageSheet] =
    usePostMessageSheetOpener();
  const [keyboardBarStyle, setKeyboardBarStyle] = useState<
    StyleProp<ViewStyle>
  >({ width: "100%", zIndex: 100 });
  const [showKeyboardTabBar, setShowKeyboardTabBar] = useState(false);
  const [messageValue, setMessageValue] = useState("");
  const [selectedImageUri, setSelectedImageUri] = useState<string>();
  const [showPostMsgGroupSelector, setShowPostMsgGroupSelector] =
    useState(false);
  const [currentMessageAccessibility, setCurrentMessageAccessibility] =
    useState<MessageAccessibility>(MessageAccessibility.Public);
  const [showEarlyExitSheet, setEarlyExitSheet] = useState(false);
  const [profile] = useProfile();
  const [showResendOrQuote, setShowResendOrQuote] = useState(false);
  const [messageToResend, setMessageToResend] = useState<
    MessageModel | undefined
  >();

  useEffect(() => {
    const keyboardShow = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardBarStyle({
        width: "100%",
        position: "absolute",
        paddingHorizontal: 10,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderColor: tertiary(),
        top: e.endCoordinates.height + 80,
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

  useEffect(() => {
    if (showPostMessageSheet.typeOfPost == TypeOfPost.Resend) {
      setShowResendOrQuote(true);
    }
  }, [showPostMessageSheet.typeOfPost]);

  useEffect(() => {
    if (showPostMessageSheet.show) {
      asyncStorage.getItem(LAST_POSTED_MESSAGE_KEY).then((text) => {
        if (text) {
          setMessageValue(text);
        }
      });
    }
  }, [showPostMessageSheet.show]);

  useEffect(() => {
    if (showPostMessageSheet.broadcastingMsgOrOriginalMsgId) {
      getMessage(showPostMessageSheet.broadcastingMsgOrOriginalMsgId)
        .then((message) => {
          setMessageToResend(message);
        })
        .catch((e) => {
          setMessageToResend(undefined);
        });
    } else {
      setMessageToResend(undefined);
    }
  }, [showPostMessageSheet.broadcastingMsgOrOriginalMsgId]);

  const resetShowPostMessageSheet = () => {
    setShowPostMessageSheet({
      show: false,
      typeOfPost: undefined,
      broadcastingMsgOrOriginalMsgId: undefined,
    });
  };

  const getImageFile = async (uri: string) => {
    const blobResult = await fetch(uri);
    if (blobResult.ok) {
      setSelectedImageUri(uri);
    } else {
      setSelectedImageUri("");
    }
  };

  const emptySelectedImage = () => {
    setSelectedImageUri("");
  };

  const toggleEarlyExitSheet = () => {
    setEarlyExitSheet(!showEarlyExitSheet);
  };

  const toggleResendOrQuoteSheet = () => {
    resetShowPostMessageSheet();
    setShowResendOrQuote(!showResendOrQuote);
  };

  const togglePostMsgGroupSelector = () => {
    setShowPostMsgGroupSelector(!showPostMsgGroupSelector);
  };

  const onChangeText = async (text: string) => {
    setMessageValue(text);
    if (!text || text.length === 0) {
      await asyncStorage.deleteItem(LAST_POSTED_MESSAGE_KEY);
    }
  };

  const onPressCancelMessage = () => {
    if (!messageValue) {
      toggleShowPostMessageSheet();
    } else {
      toggleEarlyExitSheet();
    }
  };

  const onPressSubmitMessage = async () => {
    try {
      if (
        showPostMessageSheet.typeOfPost === TypeOfPost.NewPost ||
        showPostMessageSheet.typeOfPost === TypeOfPost.Resend
      ) {
        console.log("start createMessage");
        const result = await createMessage(
          profile!.id,
          currentMessageAccessibility == MessageAccessibility.Public
            ? ApiMessageGroupType.Public
            : ApiMessageGroupType.Circle,
          messageValue,
          undefined,
          selectedImageUri
        );

        if (result.ok) {
          console.log("created message: ", await result.json());
          setMessageValue("");
          toggleShowPostMessageSheet();
          setSelectedImageUri("");
        } else {
          console.log("error creating message: ", result.status);
        }
      } else if (showPostMessageSheet.typeOfPost == TypeOfPost.Response) {
        console.log("start createMessageResponse");
        if (!showPostMessageSheet.broadcastingMsgOrOriginalMsgId) {
          throw new Error(
            "Failed to create response message. Original message id is missing."
          );
        }

        const result = await createMessageResponse(
          profile!.id,
          messageValue,
          currentMessageAccessibility == MessageAccessibility.Public
            ? ApiMessageGroupType.Public
            : ApiMessageGroupType.Circle,
          showPostMessageSheet.broadcastingMsgOrOriginalMsgId,
          selectedImageUri
        );

        if (result.ok) {
          console.log("created response message: ", await result.json());
          setMessageValue("");
          toggleShowPostMessageSheet();
          setSelectedImageUri("");
        } else {
          console.log("error creating response message: ", result.status);
        }
      } else {
        throw new Error("Not implemented");
      }
    } catch (e) {
      console.log(
        `error type of message post ${showPostMessageSheet.typeOfPost} not implemented:`,
        e
      );
    }
  };

  const onPressShowPostMessageDialog = () => {
    toggleShowPostMessageSheet();
  };

  const toggleShowPostMessageSheet = () => {
    const newShowPostMessageSheet = {
      show: !showPostMessageSheet.show,
      typeOfPost: showPostMessageSheet.typeOfPost,
      broadcastingMsgOrOriginalMsgId:
        showPostMessageSheet.broadcastingMsgOrOriginalMsgId,
    };
    console.log("toggleShowPostMessageSheet", newShowPostMessageSheet);
    setShowPostMessageSheet(newShowPostMessageSheet);
  };

  const closePostMsgSheet = () => {
    resetShowPostMessageSheet();
    clearTextInput();
    emptySelectedImage();
  };

  const onPressDropDown = () => {
    togglePostMsgGroupSelector();
  };

  const clearTextInput = () => {
    setMessageValue("");
  };

  return (
    <>
      <FullSheet show={showPostMessageSheet.show}>
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
                style={styles.txtInput}
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
              {selectedImageUri ? (
                <Image
                  source={{ uri: selectedImageUri }}
                  style={styles.selectedImageStyle}
                />
              ) : null}
              {showPostMessageSheet.typeOfPost === TypeOfPost.Resend &&
              messageToResend ? (
                <ResentItem messageModel={messageToResend} />
              ) : null}
            </View>
            <KeyboardToolBar
              show={showKeyboardTabBar}
              style={keyboardBarStyle}
              getImageFile={getImageFile}
            />
          </View>
        </>
      </FullSheet>

      <EarlyExitDeleteOrSave
        show={showEarlyExitSheet}
        toggleSelf={toggleEarlyExitSheet}
        currentTxtValue={messageValue}
        closePostMsgSheet={closePostMsgSheet}
      />

      <ResendOrQuoteResend
        show={showResendOrQuote}
        toggleSelf={toggleResendOrQuoteSheet}
        profileId={profile ? profile.id : BigInt(0)}
        broadcastingMsgId={showPostMessageSheet.broadcastingMsgOrOriginalMsgId!}
        currentTxtValue={messageValue}
        currentMessageAccessibility={currentMessageAccessibility}
        closePostMsgSheet={closePostMsgSheet}
        toggleShowPostMessageSheet={toggleShowPostMessageSheet}
        clearTextInput={clearTextInput}
        emptySelectedImage={emptySelectedImage}
      />

      {!showPostMessageSheet.show && (
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

interface SecondarySheetProps {
  show: boolean;
  toggleSelf: () => void;
  currentTxtValue: string;
  closePostMsgSheet: () => void;
}

function EarlyExitDeleteOrSave({
  show,
  toggleSelf,
  currentTxtValue,
  closePostMsgSheet,
}: SecondarySheetProps) {
  const onCancelEarlyExit = () => {
    toggleSelf();
  };

  const onPressDelete = async () => {
    await asyncStorage.deleteItem(LAST_POSTED_MESSAGE_KEY);

    toggleSelf();
    closePostMsgSheet();
  };

  const onPressSaveDraft = async () => {
    await asyncStorage.setItem(LAST_POSTED_MESSAGE_KEY, currentTxtValue);

    toggleSelf();
    closePostMsgSheet();
  };

  return (
    <HalfSheet show={show} toggleShow={toggleSelf} sheetHeightDenom={5}>
      {show && (
        <>
          <View style={styles.secondaryContainer}>
            <Pressable onPress={onPressDelete} style={styles.secondaryItem}>
              <DeleteIcon size={25} />
              <Spacer width={20} />
              <Text style={{ ...styles.secondaryItemTxt, color: "red" }}>
                Delete
              </Text>
            </Pressable>
            <Pressable onPress={onPressSaveDraft} style={styles.secondaryItem}>
              <SaveDraftIcon size={25} />
              <Spacer width={20} />
              <Text style={styles.secondaryItemTxt}>Save draft</Text>
            </Pressable>
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

function ResendOrQuoteResend({
  show,
  toggleSelf,
  profileId,
  currentMessageAccessibility,
  broadcastingMsgId,
  closePostMsgSheet,
  toggleShowPostMessageSheet,
  clearTextInput,
  emptySelectedImage,
}: SecondarySheetProps & {
  profileId: bigint;
  broadcastingMsgId: bigint;
  currentMessageAccessibility: MessageAccessibility;
  toggleShowPostMessageSheet: () => void;
  clearTextInput: () => void;
  emptySelectedImage: () => void;
}) {
  const onCancel = () => {
    toggleSelf();
  };

  const onPressResend = async () => {
    try {
      const result = await createMessage(
        profileId,
        currentMessageAccessibility == MessageAccessibility.Public
          ? ApiMessageGroupType.Public
          : ApiMessageGroupType.Circle,
        undefined,
        broadcastingMsgId
      );

      if (result.ok) {
        console.log("created message: ", await result.json());
      } else {
        console.log("error creating message: ", result.status);
      }

      toggleSelf();
      closePostMsgSheet();
    } catch (e) {
      console.log("failed to resend message", e);
    }
  };

  const onPressQuoteResend = async () => {
    toggleSelf();
    toggleShowPostMessageSheet();
    clearTextInput();
    emptySelectedImage();
  };

  return (
    <HalfSheet show={show} toggleShow={toggleSelf} sheetHeightDenom={6}>
      {show && (
        <>
          <View style={styles.secondaryContainer}>
            <Pressable onPress={onPressResend} style={styles.secondaryItem}>
              <DeleteIcon size={25} />
              <Spacer width={20} />
              <Text style={styles.secondaryItemTxt}>Resend</Text>
            </Pressable>
            <Pressable
              onPress={onPressQuoteResend}
              style={styles.secondaryItem}
            >
              <SaveDraftIcon size={25} />
              <Spacer width={20} />
              <Text style={styles.secondaryItemTxt}>Quote and Resend</Text>
            </Pressable>
          </View>
          <BottomButton isInverted={true} onPressBottomButton={onCancel}>
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
    justifyContent: "center",
    borderRadius: 50,
    width: 50,
    height: 50,
    position: "absolute",
    right: 30,
    bottom: 100,
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
  selectedImageStyle: {
    marginTop: 20,
    marginLeft: 60,
    marginRight: 10,
    width: 340,
    height: 340,
  },
  secondaryContainer: {
    justifyContent: "flex-start",
    alignSelf: "stretch",
    marginTop: 30,
    paddingHorizontal: 30,
  },
  secondaryItem: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 30,
  },
  secondaryItemTxt: {
    ...bodyFontStyle,
  },
});
