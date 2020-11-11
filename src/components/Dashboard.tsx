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
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  })
);

const Dashboard = (): JSX.Element => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={6}>
        {['Project', 'Ticket', 'Users', 'Activity'].map((text, index) => (
          <Grid key={index} item xs={6}>
            <Paper className={classes.paper}>{text} Preview</Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Dashboard;
