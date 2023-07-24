import { FlashList } from "@shopify/flash-list";
import { View, StyleSheet } from "react-native";
import MessageListItem from "./messageListItem";
import MessageModel from "../../../common/models/message";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../screens/home/home";
import { bottomBorder } from "../../../theme/element-styles/dividerStyles";

export interface MessageListProps {
  navigation: StackNavigationProp<
    RootStackParamList,
    keyof RootStackParamList,
    undefined
  >;
  messageItems: MessageModel[];
  onRefreshList: () => void;
  isRefreshing: boolean;
  scrollEnabled?: boolean;
}

export default function MessageList({
  navigation,
  messageItems,
  onRefreshList,
  isRefreshing,
  scrollEnabled = true,
}: MessageListProps) {
  return (
    <View style={styles.messagesContainer}>
      <FlashList
        renderItem={(item) => (
          <View style={styles.messageItemContainer as object}>
            <MessageListItem messageModel={item} navigation={navigation} />
          </View>
        )}
        estimatedItemSize={10}
        data={messageItems}
        refreshing={isRefreshing}
        onRefresh={onRefreshList}
        scrollEnabled={scrollEnabled}
      />
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
