import React, { useEffect } from 'react';
import Navigation from 'components/Navigation';
import Dashboard from 'components/Dashboard';
import UsersDisplay from 'components/UsersDisplay';
import { getUser, getUsers } from 'hooks/axiosGet';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import { User } from 'components/UsersDisplay';

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
  const [users, setUsers] = React.useState<null | any>(null);
  const [loading, setLoading] = React.useState(true);

  const classes = useStyles();

  useEffect(() => {
    if (!users) {
      getUsers().then((users: User[]) => {
        console.log(users);
        setUsers(users);
        setLoading(false);
      });
    }
  }, [users, setUsers]);

  return (
    <Router>
      <div className={classes.pageContainer}>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Navigation />
          <Switch>
            <Route path="/">
              <main className={classes.content}>
                <div className={classes.toolbar} />
                {/* <Dashboard /> */}
                {loading ? null : <UsersDisplay users={users} />}
              </main>
            </Route>
            <Route path="/users">
              <main className={classes.content}>
                <div className={classes.toolbar} />
                <UsersDisplay users={users} />
              </main>
            </Route>
            <Route></Route>
          </Switch>
        </main>
      </div>
    </Router>
  );
};

export default App;
