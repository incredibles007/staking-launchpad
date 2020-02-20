export const colors = {
  white: "#ffffff",
  gray5: "#fdfcfe",
  gray10: "#F0ECF5",
  gray20: "#E6E6E6",
  gray35: "#B6B6B6",
  gray: "#B6B6B6",
  gray50: "#8E8E8E",
  gray60: "#9B9B9B",
  gray70: "#475166",
  gray85: "#4A4A4A",
  black: "#333333",
  brand: "#0F2A43", // navy dark blue
  secondary: "#007FB0", // ligter, royal blue
  lightBrand: "#b0e2f5", // lightest blue
  transparent: "transparent",
  success: "#26AB83",
  successLight: "#66d6ae",
  error: "#912d2c",
  errorLight: "#FF9B9A",
  warning: "#D45C06",
  info: "#FFF9F2",
};

export const details = {
  borderRadius: "3px"
};

export const screenSizes = {
  smaller: "420px",
  small: "576px",
  medium: "768px",
  large: "992px",
  larger: "1200px",
  largest: "1440px",
  huge: "1820px"
};

export const styledComponentsTheme = {
  ...colors,
  ...screenSizes,
  ...details
};
