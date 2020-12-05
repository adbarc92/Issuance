import React from 'react';
import Navigation from 'components/Navigation';
import Dashboard from 'components/Dashboard';
import PersonnelPage from 'components/PersonnelPage';
import TaskPage from 'components/TaskPage';
import LoginPage from 'components/LoginPage';

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

const ChildrenWrapper = styled('div')(() => {
  return {
    maxWidth: '1440px',
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  };
});

const PageWrapper = (props: any): JSX.Element => {
  const classes = useStyles();
  return (
    <div>
      <div className={classes.toolbar} />
      <Navigation />
      <main className={classes.content}>
        <ChildrenWrapper>{props.children}</ChildrenWrapper>
      </main>
    </div>
  );
};

const App = (): JSX.Element => {
  const classes = useStyles();

  console.log('Rendering');

  return (
    <Router>
      <div className={classes.pageContainer}>
        <Switch>
          <Route path="/login">
            <LoginPage />
          </Route>
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
      </div>
    </Router>
  );
};

export default App;
