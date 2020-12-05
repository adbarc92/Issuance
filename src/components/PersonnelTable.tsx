import React from 'react';

import { MoreVert } from '@material-ui/icons';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Personnel } from 'types/personnel';

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

export interface PersonnelTableProps {
  personnelData: Personnel[];
}

const PersonnelTable = (props: PersonnelTableProps): JSX.Element => {
  const { personnelData } = props;
  const classes = useStyles();

  const columnHeaders = ['ID', 'Name', 'Email', 'Role'];

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columnHeaders.map(header => {
              return <TableCell key={header}>{header}</TableCell>;
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {personnelData
            ? personnelData.map((person, index) => {
                const { id, name, email, role } = person;
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
  );
};

export default PersonnelTable;
