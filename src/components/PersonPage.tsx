import React from 'react';

import { useGetPersonById } from 'hooks/axiosHooks';

import RootWrapper from 'elements/RootWrapper';
import LoadingSpinner from 'elements/LoadingSpinner';
import PageTitle from 'elements/PageTitle';
import InfoBox from 'elements/InfoBox';
import GridWrapper from 'elements/GridWrapper';

import { Person } from 'types/person';

interface PersonPageProps {
  personId: string;
}

const PersonPage = (props: PersonPageProps): JSX.Element => {
  const { loading, data: personData, error, clearCache } = useGetPersonById(
    props.personId
  );

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <RootWrapper>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <PageTitle
            title={`User: ${(personData as Person).userEmail}`}
            subtitle={`UserId: ${(personData as Person).id}`}
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
        </>
      )}
    </RootWrapper>
  );
};

export default PersonPage;
