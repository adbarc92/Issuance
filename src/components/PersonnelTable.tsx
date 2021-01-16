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
} from '@material-ui/core';
import { Person } from 'types/person';

import SimpleMenu from 'elements/SimpleMenu';

export interface PersonnelTableProps {
  personnelData: Person[];
}

const VertIconWrapper = styled(Button)(() => {
  return {};
});

const PersonnelTable = (props: PersonnelTableProps): JSX.Element => {
  const { personnelData } = props;

  const columnHeaders = [
    '',
    'User Email',
    'First Name',
    'Last Name',
    'Role',
    'Actions',
  ];

  const menuItems = [
    {
      key: 'View Page',
      onClick: () => {
        console.log('View Page');
      },
    },
    {
      key: 'Edit',
      onClick: () => {
        console.log('Edit');
      },
    },
    {
      key: 'Hide',
      onClick: () => {
        console.log('Edit');
      },
    },
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
                    <TableCell>{person.userEmail}</TableCell>
                    <TableCell>{person.firstName}</TableCell>
                    <TableCell>{person.lastName}</TableCell>
                    <TableCell>{person.job}</TableCell>
                    <TableCell>
                      <VertIconWrapper onClick={handleClick}>
                        <MoreVert />
                      </VertIconWrapper>
                      <SimpleMenu
                        menuItems={menuItems}
                        anchorElement={anchorElement}
                        handleClose={handleClose}
                      />
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
