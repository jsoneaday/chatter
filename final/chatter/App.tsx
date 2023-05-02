import { Platform, StyleSheet, View, useWindowDimensions } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./app/presentation/screens/home/home";
import Header from "./app/presentation/components/headers/header";
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
import EditCircleComponent from "./app/presentation/components/messages/editCircleComponent";
import PostMessageGroupSelector from "./app/presentation/components/messages/postMessageGroupSelector";

export type RootTabParamList = {
  Home: undefined;
  Browse: undefined;
  Notification: undefined;
  Dm: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function App() {
  const [showPostMsgGroupSelector, setShowPostMsgGroupSelector] =
    useState(false);
  const [showPostMessageComponent, setShowPostMessageComponent] =
    useState(false);
  const [showEditCircle, setShowEditCircle] = useState(false);

  const togglePostMsgGroupSelector = () => {
    setShowPostMsgGroupSelector(!showPostMsgGroupSelector);
  };

  const togglePostMessageComponent = () => {
    console.log("start showInnerFullSheet", showPostMessageComponent);
    const currentShowInnerFullSheet = !showPostMessageComponent;
    setShowPostMessageComponent(currentShowInnerFullSheet);
    console.log("end showInnerFullSheet", currentShowInnerFullSheet);
  };

  const toggleShowEditCircle = () => {
    setShowEditCircle(!showEditCircle);
    console.log("showOuterFullSheet", !showEditCircle);
  };

  return (
    <>
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

      <PostMessageComponent
        togglePostMsgGroupSelector={togglePostMsgGroupSelector}
        toggleSelf={togglePostMessageComponent}
        show={showPostMessageComponent}
      />

      <PostMessageGroupSelector
        show={showPostMsgGroupSelector}
        toggleSelf={togglePostMsgGroupSelector}
        toggleOuterFullSheet={toggleShowEditCircle}
      />

      <EditCircleComponent
        show={showEditCircle}
        toggleSelf={toggleShowEditCircle}
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
