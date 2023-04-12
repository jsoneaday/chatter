import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./app/presentation/screens/home";
import Header from "./app/presentation/components/header";
import { secondary, tertiary } from "./app/presentation/theme/colors";
import {
  BrowseIcon,
  DirectMessageIcon,
  HomeIcon,
  NotificationIcon,
} from "./app/presentation/theme/icons/menuIcons";
import Browse from "./app/presentation/screens/browse";
import Notifications from "./app/presentation/screens/notifications";
import DirectMessage from "./app/presentation/screens/directmessage";

export type RootTabParamList = {
  Home: undefined;
  Browse: undefined;
  Notification: undefined;
  Dm: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerTitle: (props) => <Header />,
          headerLeft: () => null,
          headerStyle: styles.headerStyle,
          tabBarShowLabel: false,
          tabBarActiveTintColor: tertiary(),
          tabBarInactiveTintColor: secondary(),
        })}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <HomeIcon isSelected={focused} size={25} />
            ),
          }}
        />
        <Tab.Screen
          name="Browse"
          component={Browse}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <BrowseIcon isSelected={focused} size={28} />
            ),
          }}
        />
        <Tab.Screen
          name="Notification"
          component={Notifications}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <NotificationIcon isSelected={focused} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="Dm"
          component={DirectMessage}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <DirectMessageIcon isSelected={focused} size={25} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerStyle: {
    height: Platform.OS === "ios" ? 105 : 85,
  },
  menuIcon: {
    width: 35,
    height: 35,
  },
});
