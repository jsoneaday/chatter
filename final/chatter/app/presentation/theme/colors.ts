import { Appearance } from "react-native";

const colorScheme = Appearance.getColorScheme();

const white = "white";
const black = "black";
const skyBlue = "#87CEEB";
const navyBlue = "#000080";
export const modalBackgroundColor = "lightgray";

function gray(opacity: number = 1.0): string {
  return `rgba(169,169,169, ${opacity})`;
}

const dark = {
  primary: white,
  secondary: skyBlue,
  tertiary: gray,
} as const;

const light = {
  primary: black,
  secondary: navyBlue,
  tertiary: gray,
} as const;

export function notSelected() {
  return colorScheme === "dark" ? dark.tertiary : light.tertiary;
}

export function primary(isInverted: Boolean = false) {
  if (isInverted) {
    return colorScheme === "dark" ? light.primary : dark.primary;
  }
  return colorScheme === "dark" ? dark.primary : light.primary;
}

export function primaryDark() {
  return dark.primary;
}

export function primaryLight() {
  return light.primary;
}

export function secondaryLight() {
  return light.secondary;
}

export function secondary(isInverted: Boolean = false) {
  if (isInverted) {
    return colorScheme === "dark" ? light.secondary : dark.secondary;
  }
  return colorScheme === "dark" ? dark.secondary : light.secondary;
}

export function tertiary(isInverted: Boolean = false, opacity: number = 1.0) {
  if (isInverted) {
    return colorScheme === "dark"
      ? light.tertiary(opacity)
      : dark.tertiary(opacity);
  }
  return colorScheme === "dark"
    ? dark.tertiary(opacity)
    : light.tertiary(opacity);
}
