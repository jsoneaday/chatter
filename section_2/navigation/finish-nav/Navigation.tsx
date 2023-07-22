import { NavigationContainer, useNavigation } from "@react-navigation/native";
import {
  StackNavigationProp,
  StackScreenProps,
  createStackNavigator,
} from "@react-navigation/stack";
import { View, StyleSheet, Pressable, Text } from "react-native";

type RootStackParamList = {
  ScreenA: undefined;
  ScreenB: { color: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export function Root() {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="ScreenA" component={ScreenA} />
          <Stack.Screen
            name="ScreenB"
            children={(props) => <ScreenB {...props} />}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

export function ScreenA() {
  const navigation =
    useNavigation<
      StackNavigationProp<
        RootStackParamList,
        keyof RootStackParamList,
        undefined
      >
    >();

  const onPressNavigation = () => {
    navigation.navigate("ScreenB", { color: "red" });
  };

  return (
    <View style={styles.screen}>
      <Pressable onPress={onPressNavigation}>
        <Text style={{ fontSize: 40 }}>Goto ScreenB</Text>
      </Pressable>
    </View>
  );
}

type ScreenBProps = StackScreenProps<RootStackParamList, "ScreenB">;

export function ScreenB({ route }: ScreenBProps) {
  const color = route.params.color;
  return <View style={{ ...styles.screen, backgroundColor: color }}></View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "center",
    borderWidth: 5,
    borderColor: "blue",
  },
  screen: {
    flex: 1,
  },
});
