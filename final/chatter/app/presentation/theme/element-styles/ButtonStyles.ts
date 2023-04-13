import { primary, primaryDark, secondaryLight } from "../colors";

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
