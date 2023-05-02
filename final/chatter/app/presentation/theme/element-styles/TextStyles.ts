import { primary, secondary } from "../colors";

export const headerFontStyle = (isInverted: boolean = false) => ({
  color: primary(isInverted),
  fontSize: 18,
  fontWeight: "bold",
});

export const subHeaderFontStyle = {
  color: primary(),
  fontSize: 16,
  fontWeight: "bold",
} as const;

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
