import React, { useRef, useEffect } from "react";
import { useSlideMenuOpener } from "./app/domain/store/slideMenuOpener/slideMenuOpenerHooks";
import {
  Animated,
  useWindowDimensions,
  StyleSheet,
  Platform,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
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
import { horizontalSlideDuration } from "./app/presentation/common/animationUtils";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

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

  useEffect(() => {
    if (showSliderMenu) {
      console.log("Navigator maxWidth show", windowDimensions.width);
      Animated.timing(left, {
        toValue: windowDimensions.width * 0.85,
        duration: horizontalSlideDuration,
        useNativeDriver: false,
      }).start();
    } else {
      console.log("Navigator maxWidth no show", windowDimensions.width);
      Animated.timing(left, {
        toValue: 0,
        duration: horizontalSlideDuration,
        useNativeDriver: false,
      }).start();
    }
  }, [showSliderMenu]);

  return (
    <Animated.View
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        left,
      }}
    >
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
    </Animated.View>
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
