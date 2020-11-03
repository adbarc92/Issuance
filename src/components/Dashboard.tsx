import React from 'react';
import { Grid, Paper } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  })
);

// Top: 73px
// Left: 64px

const Dashboard = (): JSX.Element => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={6}>
        <Grid item xs={6}>
          <Paper className={classes.paper}>Project Preview</Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>Ticket Preview</Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>User Preview</Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>Project Preview</Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
