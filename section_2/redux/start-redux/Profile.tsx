import { Pressable, StyleSheet, View, Text } from "react-native";
import { useProfile } from "./redux/ProfileHooks";

export function Profile() {
  const [profile, setProfile] = useProfile();

  const onPress = () => {
    setProfile({ id: 1, userName: "Tim", fullName: "John Don" });
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={onPress}>
        <Text style={{ fontSize: 40 }}>Get Profile</Text>
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
