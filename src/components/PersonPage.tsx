// Todo: Modify Styling to be less terrible; add useNotificationSnackbar

import React from 'react';

import PersonnelDialog from 'components/PersonnelDialog';

import { useGetPersonById } from 'hooks/axiosHooks';
import { setProfilePicture, getProfilePicture } from 'store/actions';

import RootWrapper from 'elements/RootWrapper';
import LoadingSpinner from 'elements/LoadingSpinner';
import PageTitle from 'elements/PageTitle';
import InfoBox from 'elements/InfoBox';
import AddButton from 'elements/AddButton';
import SectionWrapper from 'elements/SectionWrapper';

import { Person } from 'types/person';

import { Button } from '@material-ui/core';

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

  const [addingUser, setAddingUser] = React.useState(false);
  const [fileName, setFileName] = React.useState('');
  const [file, setFile] = React.useState<File | null>(null);

  const handleOpen = () => {
    setAddingUser(true);
  };

  const closeDialog = () => {
    setAddingUser(false);
  };

  const handleChooseFile = event => {
    setFile(event.target.files[0]);
    setFileName(event.target.files[0].name);
    console.log('file:', file);
  };

  const handleFileSubmit = () => {
    console.log('file:', file);
    console.log('typeof file:', typeof file);
    const res = setProfilePicture(file as File, fileName, props.personId);
    console.log('imageRes:', res);
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
          <SectionWrapper direction={'row'}>
            <InfoBox title="Profile Picture">
              <div>
                {(personData as Person).profilePicture ? (
                  <img
                    src={`${(personData as Person).profilePicture}`}
                    alt={`${personData.firstName} ${personData.lastName} `}
                  />
                ) : (
                  <>
                    <input type="file" onChange={e => handleChooseFile(e)} />
                    <Button onClick={handleFileSubmit}>Submit</Button>
                  </>
                )}
              </div>
            </InfoBox>
            <InfoBox title="Details">
              <div>User Name: {(personData as Person).userEmail}</div>
              <div>First Name:{(personData as Person).firstName}</div>
              <div>Last Name: {(personData as Person).lastName}</div>
              <div>Job: {(personData as Person).job}</div>
            </InfoBox>
          </SectionWrapper>
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
