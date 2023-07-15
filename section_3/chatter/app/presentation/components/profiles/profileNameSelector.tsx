import { View, StyleSheet, Text } from "react-native";
import Avatar from "../avatar";
import { PrimaryButton } from "../buttons/buttons";
import { primary } from "../../theme/colors";
import {
  bodyFontStyle,
  subHeaderFontStyle,
} from "../../theme/element-styles/textStyles";
import {
  addCircleMember,
  removeCircleMember,
} from "../../../domain/entities/circle";
const profilePic = require("../../theme/assets/profile.png");

export type ProfileNameDisplayData = {
  id: bigint;
  fullName: string;
  userName: string;
  avatar?: Blob;
};

interface ProfileNameDisplayProps {
  isAdding: boolean;
  refreshList: () => Promise<void>;
  circleGroupId: bigint;
  ownerId: bigint;
  /// the profile that is following this user
  member: ProfileNameDisplayData;
}

export default function ProfileNameSelector({
  isAdding,
  refreshList,
  circleGroupId,
  ownerId,
  member,
}: ProfileNameDisplayProps) {
  const onPressProfileToCircle = async () => {
    if (isAdding) {
      await addCircleMember(ownerId, member.id);
    } else {
      await removeCircleMember(circleGroupId, member.id);
    }
    await refreshList();
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileInfoContainer}>
        <Avatar imgFile={profilePic} size={50} />
        <View
          style={{
            marginLeft: 12,
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}
        >
          <Text style={{ ...subHeaderFontStyle() }}>{member.fullName}</Text>
          <Text style={{ ...bodyFontStyle }}>{`@${member.userName}`}</Text>
        </View>
      </View>
      <PrimaryButton
        containerStyle={styles.primaryBtnContainer}
        txtStyle={styles.primaryBtnTxt}
        onPress={onPressProfileToCircle}
      >
        {isAdding ? "Add" : "Remove"}
      </PrimaryButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  profileInfoContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  primaryBtnContainer: {
    width: 115,
    paddingBottom: 15,
    paddingTop: 15,
    paddingRight: 25,
    paddingLeft: 25,
    borderRadius: 30,
    backgroundColor: primary(),
  },
  primaryBtnTxt: {
    ...subHeaderFontStyle(true),
  },
});
