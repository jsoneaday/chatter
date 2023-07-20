import { useRef, useState } from "react";
import { Animated, Pressable, Text } from "react-native";

export function AnimateBox() {
  const dimensions = useRef(new Animated.ValueXY({ x: 200, y: 100 })).current;
  const [expand, setExpand] = useState(true);

  const expandMe = () => {
    if (expand) {
      Animated.timing(dimensions, {
        toValue: { x: 400, y: 200 },
        duration: 300,
        useNativeDriver: false,
      }).start();
      setExpand(false);
    } else {
      Animated.timing(dimensions, {
        toValue: { x: 200, y: 100 },
        duration: 300,
        useNativeDriver: false,
      }).start();
      setExpand(true);
    }
  };

  return (
    <Animated.View
      style={{
        marginTop: 50,
        borderColor: "blue",
        borderWidth: 15,
        width: dimensions.x,
        height: dimensions.y,
      }}
    >
      <Pressable onPress={expandMe}>
        <Text style={{ fontSize: 40 }}>Expand</Text>
      </Pressable>
    </Animated.View>
  );
}
