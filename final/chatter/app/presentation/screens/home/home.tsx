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

interface HomeProps {
  setHalfSheetContent: (element: JSX.Element) => void;
  toggleOuterFullSheet: () => void;
}

export default function Home({
  setHalfSheetContent,
  toggleOuterFullSheet,
}: HomeProps) {
  const [messageItems, setMessageItems] = useState<MessageModel[]>([]);
  const [chatterCircleCount, setChatterCircleCount] = useState(0);

  const onPressEditCircleGroup = () => {
    toggleOuterFullSheet();
  };

  useEffect(() => {
    setHalfSheetContent(
      <View style={styles.halfSheetContainer}>
        <SectionHeader style={{ marginBottom: 30 }}>
          Choose audience
        </SectionHeader>
        <View>
          <View style={{ ...styles.itemContainer, marginBottom: 30 }}>
            <MessageAccessiblityType type={Accessor.Public} />
            <Spacer width={20} />
            <Text style={labelFontStyle}>{ChatterGroups.Public}</Text>
            <Spacer width={200} />
          </View>
          <View style={styles.circleContainer}>
            <View style={styles.itemContainer}>
              <MessageAccessiblityType type={Accessor.Circle} />
              <Spacer width={20} />
              <View
                style={{
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                }}
              >
                <Text style={labelFontStyle}>
                  {ChatterGroups.ChatterCircle}
                </Text>
                <Text
                  style={bodyFontStyle}
                >{`${chatterCircleCount} people`}</Text>
              </View>
            </View>
            <RingedButton
              containerStyle={{
                padding: 6,
              }}
              onPress={onPressEditCircleGroup}
            >
              <Text style={{ ...bodyFontStyle, fontWeight: "bold" }}>Edit</Text>
            </RingedButton>
          </View>
        </View>
      </View>
    );
  }, []);

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
  halfSheetContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 15,
  },
  itemContainer: {
    width: "60%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  circleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  messagesContainer: {
    padding: 10,
    width: "100%",
    height: "100%",
  },
});
