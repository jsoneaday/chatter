import { primary, secondary } from "../colors";

export const screenHeaderFontStyle = (isInverted: boolean = false) => ({
  color: primary(isInverted),
  fontSize: 22,
  fontWeight: "bold",
});

export const headerFontStyle = (isInverted: boolean = false) => ({
  color: primary(isInverted),
  fontSize: 18,
  fontWeight: "bold",
});

export const subHeaderFontStyle = (isInverted: boolean = false) =>
  ({
    color: primary(isInverted),
    fontSize: 16,
    fontWeight: "bold",
  } as const);

export const bodyFontStyle = {
  color: primary(),
  fontSize: 18,
};

export const errorFontStyle = {
  color: "red",
  fontSize: 16,
};

export const labelFontStyle = {
  color: primary(),
  fontSize: 18,
};
