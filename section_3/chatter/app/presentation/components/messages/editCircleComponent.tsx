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
import { Follower, getFollowers } from "../../../domain/entities/follow";
import { useProfile } from "../../../domain/store/profile/profileHooks";
import {
  getCircleGroupByOwner,
  getCircleMembers,
} from "../../../domain/entities/circle";

const Tabs: [string, string] = ["Chatter Circle", "Recommended"];

interface EditCircleComponentProps {
  show: boolean;
  toggleSelf: () => void;
}

export default function EditCircleComponent({
  show,
  toggleSelf,
}: EditCircleComponentProps) {
  const [circleGroupId, setCircleGroupId] = useState(BigInt(0));
  const [currentView, setCurrentView] = useState<JSX.Element>();
  const [profile, setProfile] = useProfile();

  useEffect(() => {
    console.log("EditCircleComponent profile", profile);
    if (profile) {
      getCircleGroupByOwner(profile!.id).then((circleGroupId) => {
        setCircleGroupId(circleGroupId || BigInt(0));
      });
    }
  }, [profile]);

  const onSelectedTabChanged = async (selectedTab: string) => {
    if (selectedTab == Tabs[0]) {
      setCurrentView(<ChatterCircle circleGroupId={circleGroupId} />);
    } else {
      setCurrentView(<Recommended circleGroupId={circleGroupId} />);
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

interface TabProps {
  circleGroupId: bigint;
}

function ChatterCircle({ circleGroupId }: TabProps) {
  const [circleMembers, setCircleMembers] =
    useState<ProfileNameDisplayData[]>();
  const [profile] = useProfile();

  useEffect(() => {
    refreshMembers();
  }, [profile]);

  const refreshMembers = async () => {
    console.log("getting circle members...", circleGroupId);
    const members = await getCircleMembers(circleGroupId);
    const foundCircleMembers = members?.map((member) => {
      return {
        id: member.memberId,
        userName: member.userName,
        fullName: member.fullName,
        avatar: member.avatar,
      };
    });
    setCircleMembers(foundCircleMembers);
  };

  return (
    <View style={styles.childContainer}>
      <View style={styles.childItem}>
        <Disclaimer />
      </View>
      <View style={{ width: "100%", height: "100%" }}>
        <FlashList
          renderItem={(item) => (
            <ProfileNameSelector
              isAdding={false}
              refreshList={refreshMembers}
              circleGroupId={circleGroupId}
              ownerId={profile?.id || BigInt(0)}
              member={item.item}
            />
          )}
          estimatedItemSize={10}
          data={circleMembers}
        />
      </View>
    </View>
  );
}

function Recommended({ circleGroupId }: TabProps) {
  const [potentialCircleProfiles, setPotentialCircleProfiles] =
    useState<ProfileNameDisplayData[]>();
  const [profile] = useProfile();

  useEffect(() => {
    refreshCircleProfiles();
  }, [profile]);

  const refreshCircleProfiles = async () => {
    console.log("getting recommended followers");
    const members = await getCircleMembers(circleGroupId);
    const followers = await getFollowers(profile!.id);

    const followersList = followers
      .filter((follower) => {
        if (members) {
          return members.find((member) => member.memberId === follower.id)
            ? false
            : true;
        }
        return true;
      })
      .map((follower) => {
        return {
          id: follower.id,
          fullName: follower.fullName,
          userName: follower.userName,
          avatar: follower.avatar,
        };
      });
    console.log("filtered followers list", followersList);
    setPotentialCircleProfiles(followersList);
  };

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
          renderItem={(item) => (
            <ProfileNameSelector
              isAdding={true}
              refreshList={refreshCircleProfiles}
              circleGroupId={circleGroupId}
              ownerId={profile?.id || BigInt(0)}
              member={item.item}
            />
          )}
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
