import React from 'react';
import { Grid } from '@material-ui/core';

import PageTitle from 'elements/PageTitle';
import Root from 'elements/Root';
import Paper from 'elements/Paper';

const Dashboard = (): JSX.Element => {
  return (
    <Root>
      <PageTitle title={'Dashboard'} />
      <Grid container spacing={6}>
        {['Project', 'Ticket', 'Users', 'Activity'].map((text, index) => (
          <Grid key={index} item xs={6}>
            <Paper>{text} Preview</Paper>
          </Grid>
        ))}
      </Grid>
    </Root>
  );
};

export default Dashboard;
