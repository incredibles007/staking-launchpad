export const colors = {
  transparent: 'transparent',
  white: '#ffffff',
  gray: {
    lightest: '#fdfcfe',
    light: '#F0F4F8',
    medium: '#B6B6B6',
    dark: '#4A4A4A',
  },
  black: '#333333',
  blue: {
    lightest: '#D4D7E7',
    light: '#b0e2f5',
    medium: '#007FB0',
    dark: '#0F2A43',
  },
  green: {
    light: '#F8FAF9',
    medium: '#D0E1D5',
    dark: '#26AB83',
  },
  red: {
    light: '#FF9B9A',
    medium: '#912d2c',
  },
  orange: '#FFF9F2',
  purple: {
    light: '#F0F2FB',
    medium: '#E3E5F2',
  },
};

export const details = {
  borderRadius: '3px',
};

export const rainbowColors = [
  '#fdccd3', // pink
  '#fca09a', // red
  '#ffcc9e', // yellow
  '#98ddad', // green
  '#81d7ec', // blue
  '#a0aaed', // purple
];

export const rainbowLightColors = [
  '#fef2f4', // pink
  '#fee7e5', // red
  '#fff2e6', // yellow
  '#e5f6ea', // green
  '#dff5fa', // blue
  '#e7e9fa', // purple
];

export const rainbow = rainbowColors.join(', ');
export const rainbowLight = rainbowLightColors.join(', ');

export const screenSizes = {
  smaller: '420px',
  small: '576px',
  medium: '768px',
  large: '992px',
  larger: '1200px',
  largest: '1440px',
  huge: '1820px',
};

export const styledComponentsTheme = {
  ...colors,
  screenSizes,
  ...details,
  rainbow,
  rainbowLight,
  rainbowLightColors,
};
