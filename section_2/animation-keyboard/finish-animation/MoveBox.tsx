import { useRef, useState } from "react";
import { Animated, Pressable, Text, useWindowDimensions } from "react-native";

export function MoveBox() {
  const topCoordinate = useRef(new Animated.Value(100)).current;
  const [isTop, setIsTop] = useState(true);
  const winDimensions = useWindowDimensions();

  const moveMe = () => {
    if (isTop) {
      Animated.timing(topCoordinate, {
        toValue: winDimensions.height - 100,
        duration: 400,
        useNativeDriver: false,
      }).start();
      setIsTop(false);
    } else {
      Animated.timing(topCoordinate, {
        toValue: 100,
        duration: 400,
        useNativeDriver: false,
      }).start();
      setIsTop(true);
    }
  };

  return (
    <Animated.View
      style={{
        top: topCoordinate,
        borderWidth: 5,
        borderColor: "blue",
        padding: 50,
      }}
    >
      <Pressable onPress={moveMe}>
        <Text>Move me</Text>
      </Pressable>
    </Animated.View>
  );
}
