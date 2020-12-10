export const ColorPrimary = '#90caf9';
export const ColorSecondary = '#f48fb1';
export const ColorError = '#d32f2f';

const ColorLink = '#005DFF';
const ColorHighlight = '#B3D6FF';

const ColorDanger = '#f44336';
const ColorSuccess = '#04844B';
const ColorWarning = '#ff9800';
const ColorNeutral = '#f4f6f9';
const ColorInfo = '#4393f0';

export const colors = {
  white: '#fff',
  red: '#ef5350',
  grey: '#eee',
  black: '#000',
};

export default {
  palette: {
    primary: {
      main: ColorPrimary,
    },
    secondary: {
      main: ColorSecondary,
    },
    status: {
      danger: ColorDanger,
      success: ColorSuccess,
      warning: ColorWarning,
      neutral: ColorNeutral,
      info: ColorInfo,
    },
    typography: {
      link: ColorLink,
      highlight: ColorHighlight,
    } as any,
    background: {
      highlighted: ColorHighlight,
      normal: colors.white,
    },
  },
};
