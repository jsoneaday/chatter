import React, { useState } from "react";
import HalfSheet from "../modals/halfSheet";
import { View, Text, StyleSheet, Pressable } from "react-native";
import SectionHeader from "../headers/sectionHeader";
import MessageAccessiblityTypeIcon, {
  MessageAccessibility,
} from "../icons/messageAccessibilityType";
import Spacer from "../spacer";
import {
  bodyFontStyle,
  labelFontStyle,
} from "../../theme/element-styles/textStyles";
import { RingedButton } from "../buttons/buttons";

interface PostMessageGroupSelectorProps {
  show: boolean;
  toggleSelf: () => void;
  toggleOuterFullSheet: () => void;
  setMessageAccessibility: (accessibility: MessageAccessibility) => void;
}

export default function PostMessageGroupSelector({
  show,
  toggleSelf,
  toggleOuterFullSheet,
  setMessageAccessibility,
}: PostMessageGroupSelectorProps) {
  return (
    <HalfSheet show={show} toggleShow={toggleSelf}>
      <View style={styles.halfSheetContainer}>
        <SectionHeader style={{ marginBottom: 30 }}>
          Choose audience
        </SectionHeader>
        <View>
          <PublicAccessor setMessageAccesibility={setMessageAccessibility} />
          <CircleGroupAccessor
            toggleOuterFullSheet={toggleOuterFullSheet}
            setMessageAccessibility={setMessageAccessibility}
          />
        </View>
      </View>
    </HalfSheet>
  );
}

interface PublicAccessorProps {
  setMessageAccesibility: (accessibility: MessageAccessibility) => void;
}
// controlled component
function PublicAccessor({ setMessageAccesibility }: PublicAccessorProps) {
  const onPressPublicAccessor = () => {
    setMessageAccesibility(MessageAccessibility.Public);
  };

  return (
    <Pressable
      style={{ ...styles.itemContainer, marginBottom: 30 }}
      onPress={onPressPublicAccessor}
    >
      <MessageAccessiblityTypeIcon type={MessageAccessibility.Public} />
      <Spacer width={20} />
      <Text style={labelFontStyle}>{MessageAccessibility.Public}</Text>
      <Spacer width={200} />
    </Pressable>
  );
}

interface CircleGroupAccessorProps {
  toggleOuterFullSheet: () => void;
  setMessageAccessibility: (accessibility: MessageAccessibility) => void;
}

// not controlled component
function CircleGroupAccessor({
  toggleOuterFullSheet,
  setMessageAccessibility,
}: CircleGroupAccessorProps) {
  const [chatterCircleCount, setChatterCircleCount] = useState(0);

  const onPressEditCircleGroup = () => {
    toggleOuterFullSheet();
  };

  const onPressCircleAccessor = () => {
    setMessageAccessibility(MessageAccessibility.Circle);
  };

  return (
    <Pressable style={styles.circleContainer} onPress={onPressCircleAccessor}>
      <View style={styles.itemContainer}>
        <MessageAccessiblityTypeIcon type={MessageAccessibility.Circle} />
        <Spacer width={20} />
        <View
          style={{
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}
        >
          <Text style={labelFontStyle}>{MessageAccessibility.Circle}</Text>
          <Text style={bodyFontStyle}>{`${chatterCircleCount} people`}</Text>
        </View>
      </View>
      <RingedButton
        containerStyle={{
          padding: 6,
        }}
        onPress={onPressEditCircleGroup}
      >
        <Text style={{ ...bodyFontStyle, fontWeight: "bold" }}>Edit</Text>
      </RingedButton>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  halfSheetContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 15,
  },
  itemContainer: {
    width: "60%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  circleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
