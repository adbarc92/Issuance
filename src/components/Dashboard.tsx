import React from 'react';
import { Grid } from '@material-ui/core';
import { useGetPersonnel } from 'hooks/axiosHooks';

import LoadingSpinner from 'elements/LoadingSpinner';
import PageTitle from 'elements/PageTitle';
import Root from 'elements/Root';
import Paper from 'elements/Paper';

const Dashboard = (): JSX.Element => {
  const { loading, error } = useGetPersonnel();

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Root>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <PageTitle title={'Dashboard'} />
          <Grid container spacing={6}>
            {['Project', 'Ticket', 'Users', 'Activity'].map((text, index) => (
              <Grid key={index} item xs={6}>
                <Paper>{text} Preview</Paper>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Root>
  );
};

export default Dashboard;
