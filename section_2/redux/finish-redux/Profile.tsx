import { Pressable, StyleSheet, Text, View } from "react-native";
import { useProfile } from "./redux/ProfileHooks";

export function Profile() {
  const [profile, setProfile] = useProfile();

  const onPress = () => {
    setProfile({ id: 1, userName: "jon", fullName: "John Don" });
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={onPress}>
        <Text style={{ fontSize: 40 }}>Get User</Text>
      </Pressable>
      <Text style={{ fontSize: 40 }}>{profile?.userName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "center",
  },
});
