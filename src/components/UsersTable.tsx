import React, { useEffect } from 'react';
import { getUser, getUsers } from 'hooks/axiosGet';
import { useGetData } from 'hooks/useDataLoader';
import LoadingSpinner from 'elements/LoadingSpinner';
import { MoreVert, AddOutlined as Add } from '@material-ui/icons';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import BasedDialog from 'components/BasedDialog';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string; // fix this?
}

interface UserProps {
  users: User[];
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    addContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    add: {
      fontSize: '200',
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.secondary.main,
    },
    textAlignCenter: {
      textAlign: 'center',
    },
  })
);

const UsersTable = (): JSX.Element => {
  const classes = useStyles();

  const [addingUser, setAddingUser] = React.useState(false);

  const handleOpen = () => {
    setAddingUser(true);
  };

  const handleClose = () => {
    setAddingUser(false);
  };

  const { loading, data: users, error } = useGetData(getUsers);

  const columnHeaders = ['ID', 'Name', 'Email', 'Role'];

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
            <TableHead>
              <TableRow>
                {columnHeaders.map(header => {
                  return <TableCell key={header}>{header}</TableCell>;
                })}
                <div className={classes.textAlignCenter}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpen}
                  >
                    <Add />
                  </Button>
                </div>
              </TableRow>
            </TableHead>
            <TableBody>
              {users
                ? users.map((user, index) => {
                    const { id, name, email, role } = user;
                    return (
                      <TableRow key={index}>
                        <TableCell>{id}</TableCell>
                        <TableCell>{name}</TableCell>
                        <TableCell>{email}</TableCell>
                        <TableCell>{role}</TableCell>
                        <TableCell className={classes.textAlignCenter}>
                          <MoreVert />
                        </TableCell>
                      </TableRow>
                    );
                  })
                : null}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <BasedDialog
        selectedValue={'none'}
        open={addingUser}
        onClose={handleClose}
      />
    </div>
  );
};

export default UsersTable;
