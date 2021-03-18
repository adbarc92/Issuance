// Todo: Refactor to remove GridInfoBox

import React from 'react';

import PersonnelDialog from 'components/PersonnelDialog';

import { useGetPersonById } from 'hooks/axiosHooks';

import RootWrapper from 'elements/RootWrapper';
import LoadingSpinner from 'elements/LoadingSpinner';
import PageTitle from 'elements/PageTitle';
import InfoBox from 'elements/GridInfoBox';
import GridWrapper from 'elements/GridWrapper';
import AddButton from 'elements/AddButton';

import { Person } from 'types/person';

interface PersonPageProps {
  personId: string;
}

const PersonPage = (props: PersonPageProps): JSX.Element => {
  const {
    loading,
    data: personData,
    error,
    clearCache: clearPersonnelCache, // Might be broken
  } = useGetPersonById(props.personId);

  console.log('personData:', personData);

  const [addingUser, setAddingUser] = React.useState(false);

  const handleOpen = () => {
    setAddingUser(true);
  };

  const closeDialog = () => {
    setAddingUser(false);
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <RootWrapper>
      {loading || !personData ? (
        <LoadingSpinner />
      ) : (
        <>
          <PageTitle
            title={`User: ${(personData as Person).userEmail}`}
            subtitle={`UserId: ${(personData as Person).id}`}
            headerElem={
              <AddButton title={'Edit Person'} handleClick={handleOpen} />
            }
          />
          <GridWrapper>
            <InfoBox title="Profile Picture">
              <div>
                Profile Picture: {(personData as Person).profilePicture}
              </div>
            </InfoBox>
            <InfoBox title="Details">
              <div>User Name: {(personData as Person).userEmail}</div>
              <div>First Name:{(personData as Person).firstName}</div>
              <div>Last Name: {(personData as Person).lastName}</div>
              <div>Job: {(personData as Person).job}</div>
            </InfoBox>
          </GridWrapper>
          <PersonnelDialog
            person={personData as Person}
            selectedValue={'none'}
            open={addingUser}
            onClose={closeDialog}
            clearPersonnelCache={clearPersonnelCache}
          />
        </>
      )}
    </RootWrapper>
  );
};

export default PersonPage;
