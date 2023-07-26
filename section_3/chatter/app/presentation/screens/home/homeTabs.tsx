import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { containerStyle } from "../../theme/element-styles/screenStyles";
import InScreenTabs from "../../components/tabs/inScreenTabs";
import "react-native-get-random-values";
/// @ts-ignore
import { v4 as uuidv4 } from "uuid";

import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "./home";
import MessageList from "../../components/messages/messageList/messageList";
import MessageModel from "../../common/models/message";
import { useProfile } from "../../../domain/store/profile/profileHooks";
import { getMessagesByFollower } from "../../../domain/entities/message";

interface HomeTabsProps {
  navigation: StackNavigationProp<
    RootStackParamList,
    keyof RootStackParamList,
    undefined
  >;
}

export default function HomeTabs({ navigation }: HomeTabsProps) {
  const [selectedChanged, setSelectedChanged] = useState(uuidv4());
  const [messageItems, setMessageItems] = useState<MessageModel[]>([]);
  const [profile] = useProfile();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    refreshMessagesByFollower();
  }, [selectedChanged, profile]);

  const refreshMessagesByFollower = async () => {
    if (profile) {
      setIsRefreshing(true);
      await getMessagesByFollower(profile.id, new Date().toISOString(), 10)
        .then((messages) => {
          console.log("refreshed messages");
          setMessageItems(messages);
          setIsRefreshing(false);
        })
        .catch((e) => {
          console.log("error getting messages", e);
          setMessageItems([]);
          setIsRefreshing(false);
        });
    }
  };

  const onRefreshList = async () => {
    await refreshMessagesByFollower();
  };

  const onSelectedHomeTabChanged = async (selectedTab: string) => {
    setSelectedChanged(uuidv4());
  };

  return (
    <View style={{ ...(containerStyle as object) }}>
      <InScreenTabs
        availableTabs={["For you", "Following"]}
        onSelectedTabChanged={onSelectedHomeTabChanged}
      >
        <MessageList
          navigation={navigation}
          messageItems={messageItems}
          onRefreshList={onRefreshList}
          isRefreshing={isRefreshing}
        />
      </InScreenTabs>
    </View>
  );
}
