import React from 'react';
import Navigation from 'components/Navigation';
import Dashboard from 'components/Dashboard';
import PersonnelTablePage from 'components/PersonnelTablePage';
import TaskTablePage from 'components/TaskTablePage';
import RegisterUserPage from 'components/RegisterUserPage';
import LoginPage from 'components/LoginPage';
import TaskPage from 'components/TaskPage';
import ProjectsPage from 'components/ProjectsPage';
import PersonPage from 'components/PersonPage';
import ProjectPage from 'components/ProjectPage';

import { useForceUpdate } from 'hooks/render';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { styled } from '@material-ui/core';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';

import PageContent from 'elements/PageContent';
import PageContainer from 'elements/PageContainer';

import './io';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
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
  const classes = useStyles(props);
  return (
    <div>
      <div className={classes.toolbar} />
      <Navigation />
      <PageContent>
        <ChildrenWrapper>{props.children}</ChildrenWrapper>
      </PageContent>
    </div>
  );
};

let render: any = null;

export const reRenderApp = (): void => {
  render();
};

const App = (): JSX.Element => {
  // const classes = useStyles({} as any);

  const rerender = useForceUpdate();

  render = rerender;

  console.log('Rendering');

  return (
    <Router>
      <PageContainer>
        <Switch>
          <Route exact path="/">
            <PageWrapper>
              <Dashboard />
            </PageWrapper>
          </Route>
          <Route exact path="/login">
            <LoginPage />
          </Route>
          <Route exact path="/personnel">
            <PageWrapper>
              <PersonnelTablePage />
            </PageWrapper>
          </Route>
          <Route exact path="/projects">
            <PageWrapper>
              <ProjectsPage />
            </PageWrapper>
          </Route>
          <Route exact path="/tasks">
            <PageWrapper>
              <TaskTablePage />
            </PageWrapper>
          </Route>
          <Route exact path="/register">
            <RegisterUserPage />
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
          />
          <Route
            path="/personnel/:personId"
            render={({ match, location, history }) => {
              return (
                <PageWrapper>
                  <PersonPage personId={match.params.personId} />
                </PageWrapper>
              );
            }}
          />
          <Route
            path="/projects/:projectId"
            render={({ match, location, history }) => {
              return (
                <PageWrapper>
                  <ProjectPage projectId={match.params.projectId} />
                </PageWrapper>
              );
            }}
          />
        </Switch>
      </PageContainer>
    </Router>
  );
};

export default App;
