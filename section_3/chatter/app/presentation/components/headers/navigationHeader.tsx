import { StyleProp, StyleSheet, Text, TextStyle, View } from "react-native";
import { headerFontStyle } from "../../theme/element-styles/textStyles";
import { ReactNode } from "react";
import { ArrowBack } from "../icons/arrowBack";
import Spacer from "../spacer";

interface NavigationHeaderProps {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
}

export default function NavigationHeader({
  children,
  style = {},
}: NavigationHeaderProps) {
  return (
    <View style={styles.container}>
      <ArrowBack size={30} />
      <Text style={{ ...styles.txtContainer, ...(style as object) }}>
        {children}
      </Text>
      <Spacer width={30} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  txtContainer: {
    ...(headerFontStyle() as object),
    fontWeight: "bold",
  },
});
