import { styled } from '@material-ui/core';

const CenteredForm = styled('div')(() => {
  return {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    position: 'fixed',
    paddingTop: '10rem',
  };
});

export default CenteredForm;
