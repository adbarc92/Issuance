import React, { useEffect } from 'react';
import Navigation from 'components/Navigation';
import Dashboard from 'components/Dashboard';
import UsersDisplay from 'components/UsersDisplay';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  Switch,
  Route,
  BrowserRouter as Router,
  useLocation,
  Link,
} from 'react-router-dom';

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
    pageContainer: {
      padding: '0rem 4rem',
    },
  })
);

const App = (): JSX.Element => {
  // const location = useLocation();
  // console.log('Location:', location);

  const classes = useStyles();

  console.log('Rendering');

  return (
    <Router forcedRefresh={true}>
      <div className={classes.pageContainer}>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Navigation />
          <Switch>
            <Route path="/users">
              {/* <main className={classes.content}> */}
              {/* <div className={classes.toolbar} /> */}
              <UsersDisplay />
              {/* </main> */}
            </Route>
            <Route exact path="/" component={Dashboard}>
              {/* <main className={classes.content}>
                <div className={classes.toolbar} />
                <Dashboard />
              </main> */}
            </Route>
          </Switch>
        </main>
      </div>
    </Router>
  );
};

export default App;
