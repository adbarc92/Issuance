import React from 'react';
import Navigation from 'components/Navigation';
import Dashboard from 'components/Dashboard';
import UsersTable from 'components/UsersTable';
import TasksTable from 'components/TasksTable';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
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
    },
    pageContainer: {
      padding: '0rem 4rem',
    },
  })
);

const App = (): JSX.Element => {
  const classes = useStyles();

  console.log('Rendering');

  return (
    <Router>
      <div className={classes.pageContainer}>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Navigation />
          <Switch>
            <Route path="/users">
              {/* <main className={classes.content}> */}
              {/* <div className={classes.toolbar} /> */}
              <UsersTable />
              {/* </main> */}
            </Route>
            <Route exact path="/">
              {/* <main className={classes.content}>
                <div className={classes.toolbar} /> */}
              <Dashboard />
              {/* </main> */}
            </Route>
            <Route>
              <TasksTable />
            </Route>
          </Switch>
        </main>
      </div>
    </Router>
  );
};

export default App;
