import React, { useEffect } from 'react';
import MyDrawer from 'components/Drawer';
import Dashboard from 'components/Dashboard';
import { getUser, getUsers } from 'hooks/axiosGet';

const App = (): JSX.Element => {
  const [users, setUsers] = React.useState<null | any>(null);
  const [loading, setLoading] = React.useState(true);

  // const cache = {};

  useEffect(() => {
    if (!users) {
      const usersG = JSON.stringify(getUsers());
      setUsers(usersG);
    }
  }, [users, setUsers]);

  if (users) setLoading(false);

  return (
    <div>
      <MyDrawer />
      <Dashboard />
    </div>
  );
};

export default App;
