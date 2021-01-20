import { styled } from '@material-ui/core';
import theme from 'theme';

const PageContent = styled('main')(() => {
  return {
    flexGrow: 1,
    padding: theme.spacing(3),
    justifyContent: 'center',
    display: 'flex',
  };
});

export default PageContent;
