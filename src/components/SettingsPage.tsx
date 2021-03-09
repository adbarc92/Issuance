import React from 'react';

import LoadingSpinner from 'elements/LoadingSpinner';
import PageTitle from 'elements/PageTitle';
import RootWrapper from 'elements/RootWrapper';
import InfoBox from 'elements/InfoBox';
import GridWrapper from 'elements/GridWrapper';

const SettingsPage = (): JSX.Element => {
  const [loading, setLoading] = React.useState(false);

  return (
    <RootWrapper>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <PageTitle title={'User Settings'} />
          <GridWrapper>
            <InfoBox title={'Primary Settings'}></InfoBox>
          </GridWrapper>
        </>
      )}
    </RootWrapper>
  );
};

export default SettingsPage;
