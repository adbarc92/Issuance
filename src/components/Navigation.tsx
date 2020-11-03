import React from 'react';
import { NavLink } from 'react-router-dom';

const Navigation = (): JSX.Element => {
  return (
    <nav>
      <NavLink exact activeClassName="active" to="/">
        Home
      </NavLink>
      <NavLink exact activeClassName="active" to="/search">
        Search
      </NavLink>
      <NavLink exact activeClassName="active" to="/users">
        Users
      </NavLink>
      <NavLink exact activeClassName="active" to="/settings">
        Settings
      </NavLink>
      <NavLink exact activeClassName="active" to="/notifications">
        Notifications
      </NavLink>
    </nav>
  );
};

export default Navigation;
