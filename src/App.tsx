import React from 'react';
import Navigation from 'components/Navigation';
import Dashboard from 'components/Dashboard';
import PersonnelPage from 'components/PersonnelPage';
import TaskPage from 'components/TaskPage';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { styled } from '@material-ui/core';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';

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
      justifyContent: 'center',
      display: 'flex',
    },
    pageContainer: {
      padding: '0rem 4rem',
    },
  })
);

const PageWrapper = styled('div')(() => {
  return {
    maxWidth: '1440px',
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  };
});

const App = (): JSX.Element => {
  const classes = useStyles();

  console.log('Rendering');

  return (
    <Router>
      <div className={classes.pageContainer}>
        <div className={classes.toolbar} />
        <Navigation />
        <main className={classes.content}>
          <Switch>
            <Route path="/personnel">
              <PageWrapper>
                <PersonnelPage />
              </PageWrapper>
            </Route>
            <Route exact path="/">
              <PageWrapper>
                <Dashboard />
              </PageWrapper>
            </Route>
            <Route path="/tasks">
              <PageWrapper>
                <TaskPage />
              </PageWrapper>
            </Route>
          </Switch>
        </main>
      </div>
    </Router>
  );
};

export default App;
