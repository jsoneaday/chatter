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
    getProfile("jon")
      .then((profileResult) => {
        if (profileResult.ok) {
          profileResult.json().then((profileData) => {
            // json must always be parsed before sending a log
            setProfile(profileData);
          });
        }
      })
      .catch((e) => {
        console.log("failed to get user profile", e);
      });
  }, []);

  useEffect(() => {
    if (profile) {
      getMessagesByFollower(profile.id, new Date().toISOString(), 10)
        .then((messages) => {
          if (messages.ok) {
            messages.json().then((messageObjects) => {
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
            renderItem={(item) => (
              <View style={{ paddingTop: 20 }}>
                <MessageItem messageModel={item} />
              </View>
            )}
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
