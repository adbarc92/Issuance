import { styled } from '@material-ui/core';

const GridWrapper = styled('div')(() => {
  return {
    display: 'grid',
    gridTemplateColumns: 'auto auto auto',
    gridTemplateRows: 'auto auto',
    gridTemplateAreas: "'details description comments' 'people dates comments'",
  };
});

export default GridWrapper;
