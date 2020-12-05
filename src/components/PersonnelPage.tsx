import React from 'react';

import { Add } from '@material-ui/icons';
import { styled, Button } from '@material-ui/core';
import { useGetUsers } from 'store/axiosHooks';
import LoadingSpinner from 'elements/LoadingSpinner';
import PersonnelDialog from 'components/PersonnelDialog';
import { Personnel } from 'types/personnel';

import PersonnelTable from 'components/PersonnelTable';

const RootWrapper = styled('div')(() => {
  return {
    width: '100%',
  };
});

const HeaderWrapper = styled('div')(() => {
  return {
    fontSize: '3rem',
    margin: '0',
  };
});

const SubHeaderWrapper = styled('div')(() => {
  return {
    display: 'flex',
    justifyContent: 'flex-end',
    marginRight: '1%',
    marginBottom: '0.5rem',
  };
});

const PersonnelPage = (): JSX.Element => {
  const {
    loading,
    data: personnelData,
    error,
    clearCache: clearUsersCache,
  } = useGetUsers();

  const [addingUser, setAddingUser] = React.useState(false);

  const handleOpen = () => {
    setAddingUser(true);
  };

  const closeDialog = () => {
    setAddingUser(false);
  };

  if (error) {
    return <div>There was an error: {error}</div>;
  }

  return (
    <RootWrapper>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <HeaderWrapper>Personnel</HeaderWrapper>
          <SubHeaderWrapper>
            <Button variant="contained" color="primary" onClick={handleOpen}>
              Add Personnel
              <Add />
            </Button>
          </SubHeaderWrapper>
          <PersonnelTable personnelData={personnelData as Personnel[]} />
          <PersonnelDialog
            selectedValue={'none'}
            open={addingUser}
            onClose={closeDialog}
            clearUsersCache={clearUsersCache}
          />
        </>
      )}
    </RootWrapper>
  );
};

export default PersonnelPage;
