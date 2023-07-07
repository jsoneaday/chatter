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
import { getProfile } from "../../../domain/entities/profile";
import { useProfile } from "../../../domain/store/profile/profileHooks";
import { getMessagesByFollower } from "../../../domain/entities/message";
import { bottomBorder } from "../../theme/element-styles/dividerStyles";

export default function Home() {
  const [messageItems, setMessageItems] = useState<MessageModel[]>([]);
  const [profile, setProfile] = useProfile();
  const [selectedChanged, setSelectedChanged] = useState(uuidv4());
  const [refreshing, setRefreshing] = useState(false);

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
    refreshMessagesByFollower();
  }, [selectedChanged, profile]);

  const refreshMessagesByFollower = async () => {
    if (profile) {
      await getMessagesByFollower(profile.id, new Date().toISOString(), 10)
        .then((messages) => {
          setMessageItems(messages);
          setRefreshing(false);
        })
        .catch((e) => {
          console.log("error getting messages", e);
          setRefreshing(false);
        });
    }
  };

  const onSelectedHomeTabChanged = async (selectedTab: string) => {
    setSelectedChanged(uuidv4());
  };

  const onRefreshList = async () => {
    setRefreshing(true);
    await refreshMessagesByFollower();
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
              <View style={styles.messageItemContainer as object}>
                <MessageItem messageModel={item} />
              </View>
            )}
            estimatedItemSize={10}
            data={messageItems}
            refreshing={refreshing}
            onRefresh={onRefreshList}
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
  messageItemContainer: {
    ...bottomBorder,
    paddingTop: 10,
  },
});
