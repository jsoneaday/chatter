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
import HomeTab, { HomeTabType } from "./homeTab";
import { FlashList } from "@shopify/flash-list";
import MessageItem from "../../components/messages/messageItem";
import MessageModel from "../../common/models/message";
import { CHATTER_ROOT_URL, MSGS_URL, MSG_URL } from "../../../domain/utils/api";

interface HomeProps {
  setHalfSheetContent: (element: JSX.Element) => void;
}

export default function Home({ setHalfSheetContent }: HomeProps) {
  const [messageItems, setMessageItems] = useState<MessageModel[]>([]);

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
            <Text style={labelFontStyle}>Public</Text>
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
                <Text style={labelFontStyle}>Chatter Circle</Text>
                <Text style={bodyFontStyle}>0 people</Text>
              </View>
            </View>
            <RingedButton
              containerStyle={{
                padding: 6,
              }}
            >
              <Text style={{ ...bodyFontStyle, fontWeight: "bold" }}>Edit</Text>
            </RingedButton>
          </View>
        </View>
      </View>
    );
  }, []);

  const onSelectedHomeTabChanged = async (newHomeTab: HomeTabType) => {
    const messages = await fetch(CHATTER_ROOT_URL + MSGS_URL, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("messages status ok?", messages.ok);
    if (messages.ok) {
      const messagesJson = await messages.json();
      console.log("messagesJson", messagesJson);
      setMessageItems(JSON.parse(messagesJson));
    }
  };

  return (
    <>
      <View style={{ ...(containerStyle as object) }}>
        <HomeTab onSelectedHomeTabChanged={onSelectedHomeTabChanged}>
          <View style={styles.messagesContainer}>
            <FlashList
              renderItem={(item) => <MessageItem item={item} />}
              estimatedItemSize={10}
              data={messageItems}
            />
          </View>
        </HomeTab>
      </View>
    </>
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
  },
});
