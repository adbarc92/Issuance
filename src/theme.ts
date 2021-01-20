export const ColorPrimary = '#3f51b5';
export const ColorSecondary = '#f48fb1';
export const ColorError = '#d32f2f';

const ColorLink = '#005DFF';
const ColorHighlight = '#B3D6FF';

const ColorDanger = '#f44336';
const ColorSuccess = '#04844B';
const ColorWarning = '#ff9800';
const ColorNeutral = '#f4f6f9';
const ColorInfo = '#4393f0';

const TextPrimary = 'rgba(0,0,0,0.87)';
const TextSecondary = 'rgba(0,0,0,0.54)';
const TextDisabled = 'rgba(0,0,0,0.38)';
const TextHint = 'rgba(0,0,0,0.12)';

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
    text: {
      primary: TextPrimary,
      secondary: TextSecondary,
      disabled: TextDisabled,
      hint: TextHint,
    },
  },
  mixins: {
    toolbar: {
      minHeight: '56',
      // @media'(minWidth: '0px') and (orientation: landscape)': {
      // 	minHeight: '48',
      // },
      // '@media(min-width: 600px)': {
      // 	minHeight: '64',
      // },
    },
  },
  spacing: function (multiplier: number): string {
    return String(multiplier * 8) + 'px';
  },
};
