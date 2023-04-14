import {
  Animated,
  StyleSheet,
  View,
  TextInput,
  Text,
  SafeAreaView,
  Dimensions,
  Pressable,
} from "react-native";
import React, { useRef, useState } from "react";
import { primary, secondary } from "../theme/colors";
import { AntDesign } from "@expo/vector-icons";
import { DropDownButton, PrimaryButton, SecondaryButton } from "./buttons";
import { Ionicons, Entypo } from "@expo/vector-icons";

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
            <View style={styles.sheetBody}>
              <View style={styles.sheetBodyHeader}>
                <Ionicons
                  name="person-circle-outline"
                  size={38}
                  color={primary()}
                />
                <DropDownButton containerStyle={{ marginLeft: 8 }}>
                  <Text style={{ color: secondary() }}>Public</Text>
                  <Entypo
                    name="chevron-small-down"
                    size={20}
                    color={secondary()}
                  />
                </DropDownButton>
              </View>
              <TextInput
                style={{ paddingLeft: 35 }}
                placeholder="What's happening"
                placeholderTextColor={primary()}
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
  submitBtnContainer: {
    backgroundColor: primary(true),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingRight: 15,
    paddingBottom: 15,
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
