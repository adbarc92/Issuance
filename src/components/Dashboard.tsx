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
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
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
    <main className={classes.content}>
      <div className={classes.toolbar} />
      <div className={classes.root}>
        <Grid container spacing={6}>
          {['Project', 'Ticket', 'Users', 'Activity'].map((text, index) => (
            <Grid key={index} item xs={6}>
              <Paper className={classes.paper}>{text} Preview</Paper>
            </Grid>
          ))}
        </Grid>
      </div>
    </main>
  );
};

export default Dashboard;
