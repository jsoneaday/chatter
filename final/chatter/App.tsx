import { Platform, StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./app/presentation/screens/home/home";
import Header from "./app/presentation/components/headers/screenHeader";
import { secondary, tertiary } from "./app/presentation/theme/colors";
import {
  BrowseIcon,
  DirectMessageIcon,
  HomeIcon,
  NotificationIcon,
} from "./app/presentation/components/icons/menuIcons";
import Browse from "./app/presentation/screens/browse";
import Notifications from "./app/presentation/screens/notifications";
import DirectMessage from "./app/presentation/screens/directmessage";
import { useState } from "react";
import PostMessageComponent from "./app/presentation/components/messages/postMessageComponent";
import LeftSlideMenu from "./app/presentation/components/menu/leftSlideMenu";

export type RootTabParamList = {
  Home: undefined;
  Browse: undefined;
  Notification: undefined;
  Dm: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function App() {
  const [showLeftSlideMenu, setLeftSlideMenu] = useState(false);
  const [showPostMessageComponent, setShowPostMessageComponent] =
    useState(false);

  const toggleLeftSlideMenu = () => {
    setLeftSlideMenu(!showLeftSlideMenu);
  };

  const togglePostMessageComponent = () => {
    const currentShowInnerFullSheet = !showPostMessageComponent;
    setShowPostMessageComponent(currentShowInnerFullSheet);
  };

  return (
    <>
      <View style={{ zIndex: 1 }}>
        <NavigationContainer>
          <Tab.Navigator
            sceneContainerStyle={{ backgroundColor: "lightgray" }}
            screenOptions={({ route }) => ({
              headerTitle: (props) => <Header />,
              headerLeft: () => null,
              headerStyle: {
                ...styles.headerStyle,
              },
              tabBarShowLabel: false,
              tabBarActiveTintColor: tertiary(),
              tabBarInactiveTintColor: secondary(),
            })}
          >
            <Tab.Screen
              name="Home"
              children={() => <Home />}
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
      </View>

      <LeftSlideMenu
        show={showLeftSlideMenu}
        toggleShow={toggleLeftSlideMenu}
      />

      <PostMessageComponent
        toggleSelf={togglePostMessageComponent}
        show={showPostMessageComponent}
      />
    </>
  );
}

const styles = StyleSheet.create({
  headerStyle: {
    height: Platform.OS === "ios" ? 108 : 88,
  },
  menuIcon: {
    width: 35,
    height: 35,
  },
});
