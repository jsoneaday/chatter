import React, { useRef, useEffect, useState } from "react";
import { useSlideMenuOpener } from "./app/domain/store/slideMenuOpener/slideMenuOpenerHooks";
import { Animated, useWindowDimensions, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./app/presentation/screens/home/home";
import { primary, secondary, tertiary } from "./app/presentation/theme/colors";
import {
  BrowseIcon,
  DirectMessageIcon,
  HomeIcon,
  NotificationIcon,
} from "./app/presentation/components/icons/menuIcons";
import Browse from "./app/presentation/screens/browse";
import Notifications from "./app/presentation/screens/notifications";
import DirectMessage from "./app/presentation/screens/directmessage";
import { horizontalSlideDuration } from "./app/presentation/common/animationUtils";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PostMessageComponent from "./app/presentation/components/messages/postMessageComponent";
import { headerStyle } from "./app/presentation/theme/element-styles/screenHeaderStyles";

type RootTabParamList = {
  Home: undefined;
  Browse: undefined;
  Notification: undefined;
  Dm: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function AppNav() {
  const [showSliderMenu, setShowSliderMenu] = useSlideMenuOpener();
  const windowDimensions = useWindowDimensions();
  const left = useRef(new Animated.Value(windowDimensions.width)).current;
  const [showPostMessageComponent, setShowPostMessageComponent] =
    useState(false);

  const togglePostMessageComponent = () => {
    const currentShowInnerFullSheet = !showPostMessageComponent;
    setShowPostMessageComponent(currentShowInnerFullSheet);
  };

  useEffect(() => {
    if (showSliderMenu) {
      Animated.timing(left, {
        toValue: windowDimensions.width * 0.85,
        duration: horizontalSlideDuration,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(left, {
        toValue: 0,
        duration: horizontalSlideDuration,
        useNativeDriver: false,
      }).start();
    }
  }, [showSliderMenu]);

  return (
    <Animated.View style={{ ...styles.container, left }}>
      <NavigationContainer>
        <Tab.Navigator
          sceneContainerStyle={{ borderTopWidth: 0 }}
          screenOptions={({ route }) => ({
            headerLeft: () => null,
            headerStyle: {
              ...headerStyle,
              backgroundColor: primary(true),
            },
            headerShadowVisible: false,
            tabBarShowLabel: false,
            tabBarActiveTintColor: tertiary(),
            tabBarInactiveTintColor: secondary(),
            tabBarStyle: { backgroundColor: primary(true) },
          })}
        >
          <Tab.Screen
            name="Home"
            children={() => <Home />}
            options={{
              headerShown: false,
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
        toggleSelf={togglePostMessageComponent}
        show={showPostMessageComponent}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  menuIcon: {
    width: 35,
    height: 35,
  },
});
