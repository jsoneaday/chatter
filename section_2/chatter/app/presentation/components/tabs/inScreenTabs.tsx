import React, { ReactNode, useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { secondary, tertiary } from "../../theme/colors";
import { subHeaderFontStyle } from "../../theme/element-styles/textStyles";

type SelectedHeaderContainerStyle = {
  height: number;
  borderBottomColor?: string;
  borderBottomWidth?: number;
};

interface HomeTabProps {
  availableTabs: [left: string, right: string];
  onSelectedTabChanged: (selectedTab: string) => void;
  children: ReactNode;
}

export default function InScreenTabs({
  availableTabs,
  onSelectedTabChanged,
  children,
}: HomeTabProps) {
  const [selectedTab, setSelectedTab] = useState(availableTabs[0]);
  const [leftSelectedStyle, setLeftSelectedStyle] =
    useState<SelectedHeaderContainerStyle>(styles.unselectedHeaderContainer);
  const [rightSelectedStyle, setRightSelectedStyle] =
    useState<SelectedHeaderContainerStyle>(styles.selectedHeaderContainer);

  useEffect(() => {
    if (selectedTab === availableTabs[0]) {
      setLeftSelectedStyle(styles.selectedHeaderContainer);
      setRightSelectedStyle(styles.unselectedHeaderContainer);
    } else {
      setLeftSelectedStyle(styles.unselectedHeaderContainer);
      setRightSelectedStyle(styles.selectedHeaderContainer);
    }
    onSelectedTabChanged(selectedTab);
  }, [selectedTab]);

  const onPressLeftTab = () => {
    setSelectedTab(availableTabs[0]);
  };

  const onPressRightTab = () => {
    setSelectedTab(availableTabs[1]);
  };

  return (
    <>
      <View style={styles.header}>
        <Pressable style={leftSelectedStyle} onPress={onPressLeftTab}>
          <Text style={styles.headerText}>{availableTabs[0]}</Text>
        </Pressable>
        <Pressable style={rightSelectedStyle} onPress={onPressRightTab}>
          <Text style={styles.headerText}>{availableTabs[1]}</Text>
        </Pressable>
      </View>
      {children}
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 0,
    paddingHorizontal: 60,
    borderBottomWidth: 1,
    borderBottomColor: tertiary(false, 0.5),
  },
  headerText: {
    ...(subHeaderFontStyle() as object),
  },
  selectedHeaderContainer: {
    height: 31,
    borderBottomColor: secondary(),
    borderBottomWidth: 3,
  },
  unselectedHeaderContainer: {
    height: 31,
  },
});
