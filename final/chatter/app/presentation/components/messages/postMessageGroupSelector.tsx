import React, { ReactNode, useState } from "react";
import HalfSheet from "../modals/halfSheet";
import { View, Text, StyleSheet } from "react-native";
import SectionHeader from "../headers/sectionHeader";
import MessageAccessiblityType, {
  Accessor,
} from "../icons/messageAccessibilityType";
import Spacer from "../spacer";
import { ChatterGroups } from "./chatterGroups";
import {
  bodyFontStyle,
  labelFontStyle,
} from "../../theme/element-styles/textStyles";
import { RingedButton } from "../buttons/buttons";

interface PostMessageGroupSelectorProps {
  show: boolean;
  toggleSelf: () => void;
  toggleOuterFullSheet: () => void;
}

export default function PostMessageGroupSelector({
  show,
  toggleSelf,
  toggleOuterFullSheet,
}: PostMessageGroupSelectorProps) {
  const [chatterCircleCount, setChatterCircleCount] = useState(0);
  const onPressEditCircleGroup = () => {
    toggleOuterFullSheet();
  };

  return (
    <HalfSheet show={show} toggleShow={toggleSelf}>
      <View style={styles.halfSheetContainer}>
        <SectionHeader style={{ marginBottom: 30 }}>
          Choose audience
        </SectionHeader>
        <View>
          <View style={{ ...styles.itemContainer, marginBottom: 30 }}>
            <MessageAccessiblityType type={Accessor.Public} />
            <Spacer width={20} />
            <Text style={labelFontStyle}>{ChatterGroups.Public}</Text>
            <Spacer width={200} />
          </View>
          <View style={styles.circleContainer}>
            <View style={styles.itemContainer}>
              <MessageAccessiblityType type={Accessor.Circle} />
              <Spacer width={20} />
              <View
                style={{
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                }}
              >
                <Text style={labelFontStyle}>
                  {ChatterGroups.ChatterCircle}
                </Text>
                <Text
                  style={bodyFontStyle}
                >{`${chatterCircleCount} people`}</Text>
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
          </View>
        </View>
      </View>
    </HalfSheet>
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
