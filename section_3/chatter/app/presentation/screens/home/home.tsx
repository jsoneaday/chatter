import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { containerStyle } from "../../theme/element-styles/screenStyles";
import InScreenTabs from "../../components/tabs/inScreenTabs";
import { FlashList } from "@shopify/flash-list";
import MessageItem from "../../components/messages/messageItem";
import MessageModel from "../../common/models/message";
import "react-native-get-random-values";
/// @ts-ignore
import { v4 as uuidv4 } from "uuid";
import { parseISO } from "date-fns";
import { getProfile } from "../../../domain/entities/profile";
import { useProfile } from "../../../domain/store/profile/profileHooks";
import { getMessagesByFollower } from "../../../domain/entities/message";

export default function Home() {
  const [messageItems, setMessageItems] = useState<MessageModel[]>([]);
  const [profile, setProfile] = useProfile();
  const [selectedChanged, setSelectedChanged] = useState(uuidv4());

  useEffect(() => {
    console.log("useEffect");
    getProfile("jon")
      .then((profileResult) => {
        if (profileResult.ok) {
          profileResult.json().then((profileData) => {
            console.log("profileData", profileData); // json must always be parsed before sending a log
            setProfile(profileData);
          });
        }
      })
      .catch((e) => {
        console.log("failed to get user profile", e);
      });
  }, []);

  useEffect(() => {
    console.log("selectedChanged", selectedChanged, profile);
    if (profile) {
      getMessagesByFollower(profile.id, "2023-07-30T14:30:30Z", 10)
        .then((messages) => {
          console.log("messages", messages.status);
          if (messages.ok) {
            messages.json().then((messageObjects) => {
              console.log("messageObjects", messageObjects);
              setMessageItems(messageObjects);
            });
          }
        })
        .catch((e) => {
          console.log("error getting messages", e);
        });
    }
  }, [selectedChanged, profile]);

  const onSelectedHomeTabChanged = async (selectedTab: string) => {
    console.log("onSelectedHomeTabChanged", profile);
    setSelectedChanged(uuidv4());
  };

  return (
    <View style={{ ...(containerStyle as object) }}>
      <InScreenTabs
        availableTabs={["For you", "Following"]}
        onSelectedTabChanged={onSelectedHomeTabChanged}
      >
        <View style={styles.messagesContainer}>
          <FlashList
            renderItem={(item) => <MessageItem messageModel={item} />}
            estimatedItemSize={10}
            data={messageItems}
          />
        </View>
      </InScreenTabs>
    </View>
  );
}

const styles = StyleSheet.create({
  messagesContainer: {
    padding: 10,
    width: "100%",
    height: "100%",
  },
});
