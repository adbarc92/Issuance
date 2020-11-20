import React from 'react';
import { CircularProgress } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => {
  return {
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  };
});

const LoadingSpinner = (): JSX.Element => {
  const classes = useStyles();

  return (
    <div className={classes.loadingContainer}>
      <CircularProgress />
    </div>
  );
};

export default LoadingSpinner;
