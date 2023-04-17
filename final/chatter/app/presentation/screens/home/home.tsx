import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { containerStyle } from "../../theme/element-styles/screenStyles";
import SectionHeader from "../../components/sectionHeader";
import MessageAccessiblityType, {
  Accessor,
} from "../../components/icons/messageAccessibilityType";
import {
  bodyFontStyle,
  labelFontStyle,
} from "../../theme/element-styles/textStyles";
import Spacer from "../../components/spacer";
import { RingedButton, SecondaryButton } from "../../components/buttons";

interface HomeProps {
  setHalfSheetContent: (element: JSX.Element) => void;
}

export default function Home({ setHalfSheetContent }: HomeProps) {
  useEffect(() => {
    setHalfSheetContent(
      <View style={styles.halfSheetContainer}>
        <SectionHeader style={{ marginBottom: 30 }}>
          Choose audience
        </SectionHeader>
        <View>
          <View style={{ ...styles.itemContainer, marginBottom: 30 }}>
            <MessageAccessiblityType type={Accessor.Public} />
            <Spacer width={20} />
            <Text style={{ ...labelFontStyle }}>Public</Text>
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
                <Text style={{ ...labelFontStyle }}>Chatter Circle</Text>
                <Text style={{ ...bodyFontStyle }}>0 people</Text>
              </View>
            </View>
            <RingedButton
              containerStyle={{
                paddingRight: 15,
                paddingLeft: 15,
                paddingTop: 8,
                paddingBottom: 8,
              }}
            >
              <Text style={{ ...bodyFontStyle, fontWeight: "bold" }}>Edit</Text>
            </RingedButton>
          </View>
        </View>
      </View>
    );
  }, []);

  return (
    <>
      <View style={{ ...(containerStyle as object) }}>
        <Text>Home</Text>
      </View>
    </>
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
