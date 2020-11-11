import React, { useEffect } from 'react';
import MyDrawer from 'components/Drawer';
import Dashboard from 'components/Dashboard';
import UsersDisplay from 'components/UsersDisplay';
import { getUser, getUsers } from 'hooks/axiosGet';
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

enum AppMode {
  DASHBOARD,
  USERS,
}

const App = (): JSX.Element => {
  const [users, setUsers] = React.useState<null | any>(null);
  const [loading, setLoading] = React.useState(true);
  const [appMode, setAppMode] = React.useState<AppMode>(AppMode.DASHBOARD);
  const classes = useStyles();

  useEffect(() => {
    if (!users) {
      const usersG = getUsers();
      setUsers(usersG);
      console.log(users);
      setLoading(false);
    }
  }, [users, setUsers]);

  let page = <div>An empty div</div>;

  if (!loading) {
    switch (appMode) {
      case AppMode.DASHBOARD:
        page = <Dashboard />;
        break;
      case AppMode.USERS:
        page = <UsersDisplay users={users} />;
        break;
      default:
        page = <Dashboard />;
    }
  }

  return (
    <div>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <MyDrawer />
        <div className={classes.pageContainer}>{page}</div>
      </main>
    </div>
  );
};

export default App;
