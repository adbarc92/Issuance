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

import { getUserToken } from 'store/auth';

// import { useCookies } from 'react-cookie';

import { useGetUserPersonById } from 'hooks/axiosHooks';
import LoadingSpinner from 'elements/LoadingSpinner';

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

const Center = styled('div')(() => {
  return {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    position: 'fixed',
    width: '100%',
    height: '100%',
  };
});

const PageWrapper = (props: any): JSX.Element => {
  const classes = useStyles(props);
  return (
    <div>
      <div className={classes.toolbar} />
      <Navigation person={props.person} />
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
  const userId = getUserToken() ?? '';

  const {
    loading: personLoading,
    data: personData,
    error: personError,
    // clearCache,
  } = useGetUserPersonById(userId);

  const rerender = useForceUpdate();

  render = rerender;

  console.log('Rendering');

  if (personError) {
    return <div>{personError}</div>;
  }

  if (personLoading) {
    return (
      <Center>
        <LoadingSpinner />
      </Center>
    );
  }

  return (
    <Router>
      <PageContainer>
        <Switch>
          <Route exact path="/">
            <PageWrapper person={personData}>
              <Dashboard />
            </PageWrapper>
          </Route>
          <Route exact path="/login">
            <LoginPage />
          </Route>
          <Route exact path="/personnel">
            <PageWrapper person={personData}>
              <PersonnelTablePage />
            </PageWrapper>
          </Route>
          <Route exact path="/projects">
            <PageWrapper person={personData}>
              <ProjectsPage />
            </PageWrapper>
          </Route>
          <Route exact path="/tasks">
            <PageWrapper person={personData}>
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
                <PageWrapper person={personData}>
                  <TaskPage taskId={match.params.taskId} />
                </PageWrapper>
              );
            }}
          />
          <Route
            path="/personnel/:personId"
            render={({ match, location, history }) => {
              return (
                <PageWrapper person={personData}>
                  <PersonPage personId={match.params.personId} />
                </PageWrapper>
              );
            }}
          />
          <Route
            path="/projects/:projectId"
            render={({ match, location, history }) => {
              return (
                <PageWrapper person={personData}>
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
