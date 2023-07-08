import { createStackNavigator } from "@react-navigation/stack";
import MessageList from "./messageList";
import MessageItemThread, {
  MessageItemThreadProps,
} from "../../components/messages/messageItemThread";

export type RootStackParamList = {
  MessageList: undefined;
  MessageItemThread: MessageItemThreadProps;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function Home() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MessageList"
        component={MessageList}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="MessageItemThread" component={MessageItemThread} />
    </Stack.Navigator>
  );
}
