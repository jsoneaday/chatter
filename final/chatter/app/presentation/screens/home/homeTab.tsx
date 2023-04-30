import React, { ReactNode, useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { secondary, tertiary } from "../../theme/colors";
import {
  headerFontStyle,
  subHeaderFontStyle,
} from "../../theme/element-styles/textStyles";

export enum HomeTabType {
  ForYou = "For you",
  Following = "Following",
}

type SelectedHeaderContainerStyle = {
  height: number;
  borderBottomColor?: string;
  borderBottomWidth?: number;
};

interface HomeTabProps {
  onSelectedHomeTabChanged: (newHomeTab: HomeTabType) => void;
  children: ReactNode;
}

export default function HomeTab({
  onSelectedHomeTabChanged,
  children,
}: HomeTabProps) {
  const [selectedHomeTab, setSelectedHomeTab] = useState(HomeTabType.ForYou);
  const [foryouSelectedStyle, setForyouSelectedStyle] =
    useState<SelectedHeaderContainerStyle>(styles.unselectedHeaderContainer);
  const [followingSelectedStyle, setFollowingSelectedStyle] =
    useState<SelectedHeaderContainerStyle>(styles.selectedHeaderContainer);

  useEffect(() => {
    if (selectedHomeTab === HomeTabType.ForYou) {
      setForyouSelectedStyle(styles.selectedHeaderContainer);
      setFollowingSelectedStyle(styles.unselectedHeaderContainer);
    } else {
      setForyouSelectedStyle(styles.unselectedHeaderContainer);
      setFollowingSelectedStyle(styles.selectedHeaderContainer);
    }
    onSelectedHomeTabChanged(selectedHomeTab);
  }, [selectedHomeTab]);

  const onPressForyou = () => {
    setSelectedHomeTab(HomeTabType.ForYou);
    console.log("set for you");
  };

  const onPressFollowing = () => {
    setSelectedHomeTab(HomeTabType.Following);
    console.log("set following");
  };

  return (
    <>
      <View style={styles.header}>
        <Pressable style={foryouSelectedStyle} onPress={onPressForyou}>
          <Text style={styles.headerText}>For you</Text>
        </Pressable>
        <Pressable style={followingSelectedStyle} onPress={onPressFollowing}>
          <Text style={styles.headerText}>Following</Text>
        </Pressable>
      </View>
      {children}
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    marginHorizontal: 140,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 0,
    paddingHorizontal: 60,
    borderBottomWidth: 1,
    borderBottomColor: tertiary(false, 0.5),
  },
  headerText: {
    ...subHeaderFontStyle,
    fontWeight: "bold",
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
