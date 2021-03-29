// Todo: Refactor ReactCookies and PageWrapper.person into React.Context? Implement React-Cookie?

import React, { useEffect } from 'react';
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

import { getUserToken, setUserToken } from 'store/auth';

import { useGetUserPersonById } from 'hooks/axiosHooks';
import LoadingSpinner from 'elements/LoadingSpinner';

import { Person } from 'types/person';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: theme.spacing(0, 1),
      ...theme.mixins.toolbar, // * Necessary for content to be below app bar
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
  } = useGetUserPersonById(userId);

  const rerender = useForceUpdate();

  render = rerender;

  // Todo: renders should be counted here
  console.log('Rendering!');

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
          <Route
            exact
            path="/logout"
            render={({ match, location, history }) => {
              setUserToken(null);
              return <LoginPage />;
            }}
          />
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
            render={({ match, history }) => {
              return (
                <PageWrapper person={personData}>
                  <TaskPage
                    personId={(personData as Person).id}
                    taskId={match.params.taskId}
                  />
                </PageWrapper>
              );
            }}
          />
          <Route
            path="/personnel/:personId"
            render={({ match, history }) => {
              return (
                <PageWrapper person={personData}>
                  <PersonPage personId={match.params.personId} />
                </PageWrapper>
              );
            }}
          />
          <Route
            path="/projects/:projectId"
            render={({ match, history }) => {
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
