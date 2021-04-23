// Todo: Refactor ReactCookies and PageWrapper.person into React.Context? Implement React-Cookie?
// Todo: better separate of concerns between Login and the Application, itself

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
import NotificationPage from 'components/NotificationPage';

import { useForceUpdate } from 'hooks/render';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { styled } from '@material-ui/core';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';

import PageContent from 'elements/PageContent';
import PageContainer from 'elements/PageContainer';

import './io';

import { getUserToken, setUserToken } from 'store/auth';

import { Person } from 'types/person';
import { ClientUser } from 'types/user';
import { socket } from './io';
import { useSocketEvents, SocketEvent } from 'hooks/socketEvents';
import { ClientSubscription, SocketEventType } from 'types/subscription';
import { ClientNotification } from 'types/notification';

import { createSocketEventName } from 'utils';

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

const PageWrapper = (props: any): JSX.Element => {
  const classes = useStyles(props);
  return (
    <div>
      <div className={classes.toolbar} />
      <Navigation person={props.person} user={props.user} />
      <PageContent>
        <ChildrenWrapper>{props.children}</ChildrenWrapper>
      </PageContent>
    </div>
  );
};

let render: any = null;

export const reRenderApp = (): void => {
  console.log('Rerendering app');
  render();
};

export interface AppProps {
  person?: Person;
  subscriptions?: ClientSubscription[];
  user?: ClientUser;
}

const App = (props: AppProps): JSX.Element => {
  const userId = getUserToken() ?? '';

  const { person, subscriptions, user } = props;

  console.log('user:', user);

  const rerender = useForceUpdate();

  render = rerender;

  useEffect(() => {
    if (window.location.pathname !== '/login') {
      const socketEventName = createSocketEventName(
        SocketEventType.SUBSCRIPTION,
        userId
      );
      socket.on(socketEventName, subscription => {
        console.log('A NEW SUBSCRIPTION HAS ARRIVED:', subscription);
      });
    }
  });

  // Todo: prepend socket

  const socketEvents: SocketEvent<ClientNotification>[] | [] =
    window.location.pathname !== '/login'
      ? (subscriptions as ClientSubscription[]).map(subscription => {
          const callback = function (notification: ClientNotification) {
            console.log('notification:', notification);
          };
          const eventName = createSocketEventName(
            SocketEventType.NOTIFICATION,
            subscription.subscribedItemId
          );
          return { eventName, callback };
        })
      : [];

  useSocketEvents(socketEvents);

  // Todo: renders should be counted here
  // console.log('Rendering!');

  return (
    <Router>
      <PageContainer>
        <Switch>
          <Route exact path="/">
            <PageWrapper user={user} person={person}>
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
            <PageWrapper user={user} person={person}>
              <PersonnelTablePage />
            </PageWrapper>
          </Route>
          <Route exact path="/projects">
            <PageWrapper user={user} person={person}>
              <ProjectsPage />
            </PageWrapper>
          </Route>
          <Route exact path="/tasks">
            <PageWrapper user={user} person={person}>
              <TaskTablePage />
            </PageWrapper>
          </Route>
          <Route exact path="/notifications">
            <PageWrapper user={user} person={person}>
              <NotificationPage />
            </PageWrapper>
          </Route>
          <Route exact path="/register">
            <RegisterUserPage />
          </Route>
          <Route
            path="/tasks/:taskId"
            render={({ match, history }) => {
              return (
                <PageWrapper user={user} person={person}>
                  <TaskPage
                    personId={(person as Person).id}
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
                <PageWrapper user={user} person={person}>
                  <PersonPage personId={match.params.personId} />
                </PageWrapper>
              );
            }}
          />
          <Route
            path="/projects/:projectId"
            render={({ match, history }) => {
              return (
                <PageWrapper user={user} person={person}>
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
