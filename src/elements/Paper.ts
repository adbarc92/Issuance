import { styled, Paper as MuiPaper } from '@material-ui/core';
import theme from 'theme';

const Paper = styled(MuiPaper)(() => {
  return {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  };
});

export default Paper;
