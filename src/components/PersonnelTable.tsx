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
  Menu as MuiMenu,
  MenuItem,
} from '@material-ui/core';
import { Person } from 'types/person';

import { Link } from 'react-router-dom';
import ProfilePicture from './ProfilePicture';

export interface PersonnelTableProps {
  personnelData: Person[];
  openDialog: () => void;
  setDialogPerson: (person: Person | null) => void;
}

const VertIconWrapper = styled(Button)(() => {
  return {};
});

export interface ActionMenuProps {
  anchorElement: HTMLElement | null;
  handleClose: () => void;
  index: number;
  person: Person;
  setDialogPerson: (person: Person | null) => void;
  openDialog: () => void;
}

const ActionMenu = (props: ActionMenuProps) => {
  const {
    anchorElement,
    handleClose,
    index,
    person,
    setDialogPerson,
    openDialog,
  } = props;

  return (
    <MuiMenu
      anchorEl={anchorElement}
      onClose={handleClose}
      keepMounted
      open={Boolean(anchorElement)}
    >
      <MenuItem key={`menu-item-${index}`}>
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
    </MuiMenu>
  );
};

export interface PersonnelTableRowProps {
  index: number;
  person: Person;
  setDialogPerson: (person: Person | null) => void;
  openDialog: () => void;
}

const PersonnelTableRow = (props: PersonnelTableRowProps): JSX.Element => {
  const { index, person, setDialogPerson, openDialog } = props;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElement(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElement(null);
    setDialogPerson(null);
  };

  const [anchorElement, setAnchorElement] = React.useState<HTMLElement | null>(
    null
  );

  return (
    <TableRow key={index}>
      <TableCell>
        <ProfilePicture
          imgSrc={person.profilePicture}
          firstName={person.firstName}
          lastName={person.lastName}
          username={person.userEmail}
        />
      </TableCell>
      <TableCell>
        <Link to={`/personnel/${person.id}`}>{person.userEmail}</Link>
      </TableCell>
      <TableCell>{person.firstName}</TableCell>
      <TableCell>{person.lastName}</TableCell>
      <TableCell>{person.job}</TableCell>
      <TableCell>
        <VertIconWrapper onClick={handleClick}>
          <MoreVert />
        </VertIconWrapper>
        <ActionMenu
          anchorElement={anchorElement}
          handleClose={handleClose}
          index={index}
          person={person}
          setDialogPerson={setDialogPerson}
          openDialog={openDialog}
        />
      </TableCell>
    </TableRow>
  );
};

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
                  <PersonnelTableRow
                    key={index}
                    index={index}
                    person={person}
                    setDialogPerson={setDialogPerson}
                    openDialog={openDialog}
                  />
                );
              })
            : null}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PersonnelTable;
