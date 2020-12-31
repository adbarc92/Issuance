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
import { Person } from 'types/person';

export interface PersonnelTableProps {
  personnelData: Person[];
}

const PersonnelTable = (props: PersonnelTableProps): JSX.Element => {
  const { personnelData } = props;

  const columnHeaders = [
    '',
    'Username',
    'First Name',
    'Last Name',
    'Email',
    'Role',
    'Actions',
  ];

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
                const {
                  profilePicture,
                  username,
                  firstName,
                  lastName,
                  contactEmail,
                  role,
                } = person;
                return (
                  <TableRow key={index}>
                    <TableCell>{profilePicture}</TableCell>
                    <TableCell>{username}</TableCell>
                    <TableCell>{firstName}</TableCell>
                    <TableCell>{lastName}</TableCell>
                    <TableCell>{contactEmail}</TableCell>
                    <TableCell>{role}</TableCell>
                    <TableCell>
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
