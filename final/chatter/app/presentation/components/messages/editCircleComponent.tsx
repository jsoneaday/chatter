import { StyleSheet, View, Text } from "react-native";
import React, { useState } from "react";
import {
  bodyFontStyle,
  headerFontStyle,
} from "../../theme/element-styles/textStyles";
import FullSheet from "../modals/fullSheet";
import InScreenTabs from "../tabs/inScreenTabs";
import Spacer from "../spacer";
import { CloseButton } from "../icons/closeIcon";
import BottomButton from "../buttons/bottomButtons";
import SearchButton from "../buttons/searchButton";
import { BrowseIcon } from "../icons/menuIcons";
import { FlashList } from "@shopify/flash-list";
import ProfileNameDisplay, {
  ProfileNameDisplayData,
} from "../profiles/profileNameDisplay";

const Tabs: [string, string] = ["Twitter Circle", "Recommended"];
const potentialCircleProfiles: ProfileNameDisplayData[] = [
  {
    fullName: "Dave Choi",
    userName: "dave",
    avatar: new Blob(),
  },
  {
    fullName: "Jill Bill",
    userName: "jill",
    avatar: new Blob(),
  },
  {
    fullName: "Hey Day",
    userName: "hey",
    avatar: new Blob(),
  },
];

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
      {show && (
        <View style={styles.container}>
          <View style={styles.containerTop}>
            <View style={styles.containerHeader}>
              <CloseButton onPress={toggleSelf} size={20} />
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
      )}
    </FullSheet>
  );
}

function TwitterCircle() {
  return (
    <View style={styles.childContainer}>
      <Disclaimer />
    </View>
  );
}

function Recommended() {
  return (
    <View style={styles.childContainer}>
      <View style={styles.childItem}>
        <SearchButton>
          <BrowseIcon size={18} />
          <Spacer width={4} />
          <Text>Search people</Text>
        </SearchButton>
      </View>
      <View style={styles.childItem}>
        <Disclaimer />
      </View>
      <View style={{ width: "100%", height: "100%" }}>
        <FlashList
          renderItem={(item) => <ProfileNameDisplay profile={item.item} />}
          estimatedItemSize={10}
          data={potentialCircleProfiles}
        />
      </View>
    </View>
  );
}

function Disclaimer() {
  return (
    <Text style={styles.rootText}>
      People won't be notified when you edit your Chatter Circle. Anyone you add
      will be able to see your previous Chatter Circle Chats.
      <Text style={{ fontWeight: "bold" }}> How it works</Text>
    </Text>
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
    justifyContent: "flex-start",
    padding: 10,
    width: "100%",
    height: "100%",
  },
  childItem: { width: "100%", marginBottom: 20 },
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
