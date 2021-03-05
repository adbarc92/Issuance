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
  Button,
  styled,
  Menu,
  MenuItem,
} from '@material-ui/core';
import { Person } from 'types/person';

import { Link } from 'react-router-dom';

export interface PersonnelTableProps {
  personnelData: Person[];
  openDialog: () => void;
  setDialogPerson: (person: Person | null) => void;
}

const VertIconWrapper = styled(Button)(() => {
  return {};
});

const PersonnelTable = (props: PersonnelTableProps): JSX.Element => {
  const { personnelData, openDialog, setDialogPerson } = props;

  const columnHeaders = [
    '',
    'User Email',
    'First Name',
    'Last Name',
    'Role',
    'Actions',
  ];

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElement(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElement(null);
  };

  const [anchorElement, setAnchorElement] = React.useState<HTMLElement | null>(
    null
  );

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
            ? personnelData.map((person: Person, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{person.profilePicture}</TableCell>
                    <TableCell>
                      <Link to={`/personnel/${person.id}`}>
                        {person.userEmail}
                      </Link>
                    </TableCell>
                    <TableCell>{person.firstName}</TableCell>
                    <TableCell>{person.lastName}</TableCell>
                    <TableCell>{person.job}</TableCell>
                    <TableCell>
                      <VertIconWrapper onClick={handleClick}>
                        <MoreVert />
                      </VertIconWrapper>
                      <Menu
                        anchorEl={anchorElement}
                        onClose={handleClose}
                        keepMounted
                        open={Boolean(anchorElement)}
                      >
                        <MenuItem key={0}>
                          <Link to={`/personnel/${person.id}`}>View</Link>
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setDialogPerson(person);
                            setTimeout(() => {
                              openDialog();
                            }, 0);
                          }}
                          key={1}
                        >
                          Edit
                        </MenuItem>
                        <MenuItem key={2}>Hide</MenuItem>
                      </Menu>
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
