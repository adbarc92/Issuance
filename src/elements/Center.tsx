import { styled } from '@material-ui/core';

const Center = styled('div')(() => {
  return {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    position: 'fixed',
    width: '100%',
    height: '100%',
  };
});

export default Center;
