import React from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@material-ui/core';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string; // fix this?
  description: string; // remove this
}

interface UserProps {
  users: User[];
}

const UsersDisplay = (props: UserProps): JSX.Element => {
  const { users } = props;
  console.log('Users:', users);
  // return <div />;
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead></TableHead>
        <TableBody>
          {users
            ? users.map((user, index) => {
                const { id, name, email, role, description } = user;
                return (
                  <TableRow key={index}>
                    <TableCell>{id}</TableCell>
                    <TableCell>{name}</TableCell>
                    <TableCell>{email}</TableCell>
                    <TableCell>{role}</TableCell>
                    <TableCell>{description}</TableCell>
                  </TableRow>
                );
              })
            : null}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UsersDisplay;
