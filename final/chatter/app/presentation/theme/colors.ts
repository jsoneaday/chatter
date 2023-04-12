import { Appearance } from "react-native";

const colorScheme = Appearance.getColorScheme();

const dark = {
  primary: "white",
  secondary: "white",
  tertiary: "#808080",
  unselected: "gray",
};

const light = {
  primary: "black",
  secondary: "#2D2658",
  tertiary: "#808080",
  unselected: "gray",
};

export function notSelected() {
  return colorScheme === "dark" ? dark.unselected : light.unselected;
}

export function primary(isInverted: Boolean = false) {
  if (isInverted) {
    return colorScheme === "dark" ? light.primary : dark.primary;
  }
  return colorScheme === "dark" ? dark.primary : light.primary;
}

export function secondary(isInverted: Boolean = false) {
  if (isInverted) {
    return colorScheme === "dark" ? light.secondary : dark.secondary;
  }
  return colorScheme === "dark" ? dark.secondary : light.secondary;
}

export function tertiary(isInverted: Boolean = false) {
  if (isInverted) {
    return colorScheme === "dark" ? light.tertiary : dark.tertiary;
  }
  return colorScheme === "dark" ? dark.tertiary : light.tertiary;
}
