import {
  primaryLight,
  primaryDark,
  secondaryLight,
  secondary,
} from "../colors";

export function primaryButtonStyle(disabled: boolean = false) {
  return {
    backgroundColor: secondaryLight(),
    opacity: !disabled ? 1 : 0.5,
    borderRadius: 20,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 8,
    paddingBottom: 8,
  };
}

export function secondaryButtonStyle(disabled: boolean = false) {
  return {
    opacity: !disabled ? 1 : 0.5,
  };
}

export const txtPrimaryFont = {
  color: primaryDark(),
  fontSize: 14,
};

export const txtSecondaryFont = {
  color: primaryLight(),
  fontSize: 14,
};

export function dropDownButtonStyle() {
  return {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    border: 1,
    borderWidth: 1,
    borderColor: secondary(),
    borderRadius: 20,
    paddingLeft: 15,
    paddingRight: 10,
    paddingTop: 3,
    paddingBottom: 3,
    maxWidth: 90,
  };
}
