import React from 'react';
import Navigation from 'components/Navigation';
import Dashboard from 'components/Dashboard';
import PersonnelPage from 'components/PersonnelPage';
import TaskTablePage from 'components/TaskTablePage';
import RegisterUserPage from 'components/RegisterUserPage';
import LoginPage from 'components/LoginPage';
import TaskPage from 'components/TaskPage';

import { useForceUpdate } from 'hooks/render';

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

let render: any = null;

export const reRenderApp = (): void => {
  render();
};

const App = (): JSX.Element => {
  const classes = useStyles();

  const rerender = useForceUpdate();

  render = rerender;

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
          <Route
            path="/tasks/:taskId"
            render={({ match, location, history }) => {
              return (
                <PageWrapper>
                  <TaskPage taskId={match.params.taskId} />
                </PageWrapper>
              );
            }}
          ></Route>
          <Route path="/tasks">
            <PageWrapper>
              <TaskTablePage />
            </PageWrapper>
          </Route>
          <Route path="/register">
            <RegisterUserPage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
