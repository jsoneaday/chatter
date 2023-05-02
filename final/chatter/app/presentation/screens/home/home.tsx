import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { containerStyle } from "../../theme/element-styles/screenStyles";
import SectionHeader from "../../components/headers/sectionHeader";
import MessageAccessiblityType, {
  Accessor,
} from "../../components/icons/messageAccessibilityType";
import {
  bodyFontStyle,
  labelFontStyle,
} from "../../theme/element-styles/textStyles";
import Spacer from "../../components/spacer";
import { RingedButton } from "../../components/buttons/buttons";
import InScreenTabs from "../../components/tabs/inScreenTabs";
import { FlashList } from "@shopify/flash-list";
import MessageItem from "../../components/messages/messageItem";
import MessageModel from "../../common/models/message";
import { MSGS_URL } from "../../../domain/utils/api";
import { ChatterGroups } from "../../components/messages/chatterGroups";
import PostMessageComponent from "../../components/messages/postMessageComponent";
import EditCircleComponent from "../../components/messages/editCircleComponent";

export default function Home() {
  const [messageItems, setMessageItems] = useState<MessageModel[]>([]);

  const onSelectedHomeTabChanged = async (selectedTab: string) => {
    const messages = await fetch(
      `${MSGS_URL}?followerId=233&lastUpdatedAt=2023-04-30T14:30:30Z`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (messages.ok) {
      const messagesJson = await messages.json();
      setMessageItems(messagesJson);
    }
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
