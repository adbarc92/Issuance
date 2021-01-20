import React from 'react';
import { CircularProgress, styled } from '@material-ui/core';

const LoadingContainer = styled('div')(() => {
  return {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };
});

const LoadingSpinner = (): JSX.Element => {
  return (
    <LoadingContainer>
      <CircularProgress />
    </LoadingContainer>
  );
};

export default LoadingSpinner;
