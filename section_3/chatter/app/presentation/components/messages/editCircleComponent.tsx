import { StyleSheet, View, Text } from "react-native";
import React, { useEffect, useState } from "react";
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
import ProfileNameSelector, {
  ProfileNameDisplayData,
} from "../profiles/profileNameSelector";
import { getFollowers } from "../../../domain/entities/follow";

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
    <ChatterCircle />
  );

  const onSelectedTabChanged = async (selectedTab: string) => {
    if (selectedTab == Tabs[0]) {
      setCurrentView(<ChatterCircle />);
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
          <BottomButton onPressBottomButton={toggleSelf}>Done</BottomButton>
        </View>
      )}
    </FullSheet>
  );
}

function ChatterCircle() {
  return (
    <View style={styles.childContainer}>
      <Disclaimer />
    </View>
  );
}

function Recommended() {
  const [potentialCircleProfiles, setPotentialCircleProfiles] =
    useState<ProfileNameDisplayData[]>();

  useEffect(() => {
    getFollowers(BigInt(2))
      .then((followersResult) => {
        if (followersResult.ok) {
          followersResult.json().then((followers) => {
            setPotentialCircleProfiles(
              followers.map(
                (follower: {
                  id: bigint;
                  createdAt: Date;
                  userName: string;
                  fullName: string;
                  description: string;
                  region?: string;
                  mainUrl?: string;
                  avatar?: Blob;
                }) => {
                  return {
                    fullName: follower.fullName,
                    userName: follower.userName,
                    avatar: follower.avatar,
                  };
                }
              )
            );
          });
        } else {
          console.log(
            "Failed to get followers status:",
            followersResult.status
          );
        }
      })
      .catch((e) => {
        console.log("Failed to get followers", e);
      });
  }, []);

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
          renderItem={(item) => <ProfileNameSelector profile={item.item} />}
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
