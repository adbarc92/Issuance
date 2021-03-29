import { styled } from '@material-ui/core';
// import theme from 'theme';
import { Theme } from '@material-ui/core/styles';

const Toolbar = styled('div')((props: { theme: Theme }) => {
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0px 8px', // theme.spacing(0, 1)
    // necessary for content to be below app bar
    ...props.theme.mixins.toolbar,
  };
});

export default Toolbar;
