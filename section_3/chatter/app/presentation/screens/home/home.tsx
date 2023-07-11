import { createStackNavigator } from "@react-navigation/stack";
import HomeTabs from "./homeTabs";
import MessageItemThread, {
  MessageItemThreadProps,
} from "../../components/messages/messageItemThread";
import Header from "../../components/headers/screenHeader";
import { primary } from "../../theme/colors";
import { headerStyle } from "../../theme/element-styles/screenHeaderStyles";
import { screenHeaderFontStyle } from "../../theme/element-styles/textStyles";
import NavigationHeader from "../../components/headers/navigationHeader";
import { useEffect } from "react";
import { getProfile } from "../../../domain/entities/profile";
import { useProfile } from "../../../domain/store/profile/profileHooks";

export type RootStackParamList = {
  HomeTabs: undefined;
  MessageItemThread: MessageItemThreadProps;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function Home() {
  const [_, setProfile] = useProfile();

  useEffect(() => {
    getProfile("jon")
      .then((profileResult) => {
        if (profileResult.ok) {
          profileResult.json().then((profileData) => {
            // json must always be parsed before sending a log
            setProfile(profileData);
            console.log("profile is set", profileData);
          });
        }
      })
      .catch((e) => {
        console.log("failed to get user profile", e);
      });
  }, []);

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
        name="HomeTabs"
        component={HomeTabs}
        options={{
          headerTitle: (props) => <Header />,
        }}
      />
      <Stack.Screen
        name="MessageItemThread"
        component={MessageItemThread}
        options={{
          headerTitle: () => (
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
