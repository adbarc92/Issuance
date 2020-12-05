import React from 'react';
import { Add } from '@material-ui/icons';
import { makeStyles, styled, Button } from '@material-ui/core';

import TaskTable from 'components/TasksTable';

const TaskPage = () => {
  return (
    <div>
      <h1>Tasks</h1>
      <Button variant="contained" color="primary" onClick={}>
        Create Task
        <Add />
      </Button>
      <TaskTable />
    </div>
  );
};
