import { createStackNavigator } from "@react-navigation/stack";
import MessageList from "./messageList";
import MessageItemThread, {
  MessageItemThreadProps,
} from "../../components/messages/messageItemThread";
import Header from "../../components/headers/screenHeader";
import { primary } from "../../theme/colors";
import { headerStyle } from "../../theme/element-styles/screenHeaderStyles";
import { screenHeaderFontStyle } from "../../theme/element-styles/textStyles";
import SectionHeader from "../../components/headers/sectionHeader";
import NavigationHeader from "../../components/headers/navigationHeader";

export type RootStackParamList = {
  MessageList: undefined;
  MessageItemThread: MessageItemThreadProps;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function Home() {
  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerStyle: {
          ...headerStyle,
          backgroundColor: primary(true),
        },
      })}
    >
      <Stack.Screen
        name="MessageList"
        component={MessageList}
        options={{
          headerTitle: (props) => <Header />,
        }}
      />
      <Stack.Screen
        name="MessageItemThread"
        component={MessageItemThread}
        options={{
          headerTitle: (props) => (
            <NavigationHeader
              style={{ ...(screenHeaderFontStyle() as object) }}
            >
              Chat
            </NavigationHeader>
          ),
          headerLeft: () => null,
        }}
      />
    </Stack.Navigator>
  );
}
