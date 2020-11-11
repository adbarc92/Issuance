import React from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';

interface User {
  id: number;
  name: string;
  email: string;
  role: string; // fix this
  description: string;
}

interface UserProps {
  users: User[];
}

const UsersDisplay = (props: UserProps): JSX.Element => {
  const { users } = props;
  return (
    <TableContainer>
      <Table>
        <TableHead></TableHead>
        <TableBody>
          {users.map((user, index) => {
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
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UsersDisplay;
