import { primaryLight, primaryDark, secondaryLight } from "../colors";

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
