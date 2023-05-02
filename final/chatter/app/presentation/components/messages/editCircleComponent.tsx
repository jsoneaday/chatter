import { StyleSheet, View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { primary } from "../../theme/colors";
import {
  bodyFontStyle,
  headerFontStyle,
} from "../../theme/element-styles/textStyles";
import FullSheet from "../modals/fullSheet";
import InScreenTabs from "../tabs/inScreenTabs";
import Spacer from "../spacer";
import { visibleBorder } from "../../theme/visibleBorder";
import { CloseButton } from "../icons/closeIcon";
import BottomButton from "../buttons/bottomButtons";

const Tabs: [string, string] = ["Twitter Circle", "Recommended"];

interface EditCircleComponentProps {
  show: boolean;
  toggleSelf: () => void;
}

export default function EditCircleComponent({
  show,
  toggleSelf,
}: EditCircleComponentProps) {
  const [currentView, setCurrentView] = useState<JSX.Element>(
    <TwitterCircle />
  );

  const onSelectedTabChanged = async (selectedTab: string) => {
    if (selectedTab == Tabs[0]) {
      setCurrentView(<TwitterCircle />);
    } else {
      setCurrentView(<Recommended />);
    }
  };

  return (
    <FullSheet show={show}>
      <View style={styles.container}>
        <View style={styles.containerTop}>
          <View style={styles.containerHeader}>
            <CloseButton size={20} />
            <Text style={{ ...(headerFontStyle() as object) }}>
              Edit your Chatter Circle
            </Text>
            <Spacer width={18} />
          </View>
          <InScreenTabs
            availableTabs={Tabs}
            onSelectedTabChanged={onSelectedTabChanged}
          >
            {currentView}
          </InScreenTabs>
        </View>
        <BottomButton>Done</BottomButton>
      </View>
    </FullSheet>
  );
}

function TwitterCircle() {
  return (
    <View style={styles.childContainer}>
      <Text style={styles.rootText}>
        People won't be notified when you edit your Chatter Circle. Anyone you
        add will be able to see your previous Chatter Circle Chats.
        <Text style={{ fontWeight: "bold" }}> How it works</Text>
      </Text>
    </View>
  );
}

function Recommended() {
  return (
    <View style={styles.childContainer}>
      <Text>Recommended</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "space-between",
  },
  containerTop: {
    flex: 1,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "space-between",
  },
  childContainer: {
    alignItems: "center",
    padding: 10,
    width: "100%",
    height: "100%",
  },
  rootText: {
    ...bodyFontStyle,
    textAlign: "center",
  },
  containerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
});
