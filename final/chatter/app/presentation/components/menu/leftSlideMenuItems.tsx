import React from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import Avatar from "../avatar";
import { headerFontStyle } from "../../theme/element-styles/textStyles";
import { visibleBorder } from "../../theme/visibleBorder";
import { Profile } from "../icons/headerIcons";
import Spacer from "../spacer";
import { ProfileMenuIcon } from "../icons/profileMenuIcon";
const profilePic = require("../../theme/assets/profile.jpeg");

interface LeftSlideMenuItemsProps {
  fullName: string;
  userName: string;
}

export default function LeftSlideMenuItems({
  fullName,
  userName,
}: LeftSlideMenuItemsProps) {
  return (
    <View style={styles.container}>
      <View style={{ justifyContent: "flex-start" }}>
        <Avatar imgFile={profilePic} size={40} />
      </View>
      <ProfileInfo fullName={fullName} userName={userName} />
      <View style={{ justifyContent: "space-between", height: "60%" }}>
        <MenuItems />
      </View>
    </View>
  );
}

interface ProfileInfoProps {
  fullName: string;
  userName: string;
}

function ProfileInfo({ fullName, userName }: ProfileInfoProps) {
  return (
    <View style={styles.profileInfoContainer}>
      <Text style={{ ...styles.profileTxt, fontWeight: "bold" }}>
        {fullName}
      </Text>
      <Text style={styles.profileTxt}>{`@${userName}`}</Text>
      <View style={styles.followersContainer}>
        <Text>{`30 Following`}</Text>
        <Text>{`987 Followers`}</Text>
      </View>
    </View>
  );
}

function MenuItems() {
  return (
    <View style={styles.menuItemsContainer}>
      <Pressable style={styles.menuItem}>
        <ProfileMenuIcon size={20} />
        <Spacer width={30} />
        <Text style={styles.menuItemTxt}>Profile</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    height: "100%",
    marginTop: 105,
    padding: 15,
  },
  profileInfoContainer: {
    marginTop: 15,
    marginBottom: 20,
    width: "100%",
  },
  profileTxt: {
    ...headerFontStyle,
    marginBottom: 7,
  },
  followersContainer: {
    width: "70%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  menuItemsContainer: {
    justifyContent: "flex-start",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  menuItemTxt: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
