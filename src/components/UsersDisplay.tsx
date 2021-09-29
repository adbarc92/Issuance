import React from 'react';
import { getUsers } from 'hooks/axiosGet';
import { useGetData } from 'hooks/useDataLoader';
import LoadingSpinner from 'elements/LoadingSpinner';

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
  role: string;
  description: string;
}

interface UserProps {
  users: User[];
}

const UsersDisplay = (): JSX.Element => {
  const { loading, data: users, error } = useGetData(getUsers);

  if (error) {
    return <div>There was an error: {error}</div>;
  }

  return (
    <div>
      {loading ? (
        <LoadingSpinner />
      ) : (
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
      )}
    </div>
  );
};

export default UsersDisplay;
