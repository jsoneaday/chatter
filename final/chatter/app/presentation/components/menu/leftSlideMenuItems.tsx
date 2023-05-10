import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Avatar from "../avatar";
import { headerFontStyle } from "../../theme/element-styles/textStyles";
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
        <Avatar imgFile={profilePic} size={50} />
      </View>
      <ProfileInfo fullName={fullName} userName={userName} />
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

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    height: "100%",
    marginTop: 80,
    padding: 35,
  },
  profileInfoContainer: {
    marginTop: 15,
    width: "100%",
  },
  profileTxt: {
    ...headerFontStyle,
    marginBottom: 7,
  },
  followersContainer: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
