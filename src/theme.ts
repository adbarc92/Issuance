// Todo: add media queries;

import { createMuiTheme, ThemeOptions } from '@material-ui/core';

export const ColorPrimary = '#3f51b5';
export const ColorSecondary = '#f48fb1';
export const ColorError = '#d32f2f';

const ColorLink = '#005DFF';
const ColorHighlight = '#B3D6FF';

const ColorDanger = '#f44336';
const ColorSuccess = '#04844B';
const ColorWarningMain = '#ff9800';
const ColorWarningLight = '#ffb74d';
const ColorWarningDark = '#f57c00';
const ColorInfoLight = '#64b5f6';
const ColorInfoMain = '#2196f3';
const ColorInfoDark = '#1976d2';
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

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: ColorPrimary,
    },
    secondary: {
      main: ColorSecondary,
    },
    info: {
      light: ColorInfoLight,
      main: ColorInfoMain,
      dark: ColorInfoDark,
    },
    text: {
      primary: TextPrimary,
      secondary: TextSecondary,
      disabled: TextDisabled,
      hint: TextHint,
    },
    warning: {
      light: ColorWarningLight,
      main: ColorWarningMain,
      dark: ColorWarningDark,
    },
  },
  mixins: {
    toolbar: {
      minHeight: '56',
    },
  },
};

const theme = createMuiTheme(themeOptions);

export default theme;
