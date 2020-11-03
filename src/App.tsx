import React from 'react';
import MyDrawer from 'components/Drawer';
import Dashboard from 'components/Dashboard';

const App = (): JSX.Element => {
  return (
    <div>
      <MyDrawer />
      <Dashboard />
    </div>
  );
};

export default App;
