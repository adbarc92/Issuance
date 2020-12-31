import React from 'react';
import TaskDialog from 'components/TaskDialog';
import { Add } from '@material-ui/icons';
import { styled, Button } from '@material-ui/core';

import { Task } from 'types/task';
import TaskTable from 'components/TaskTable';
import LoadingSpinner from 'elements/LoadingSpinner';
import { useGetTasks } from 'hooks/axiosHooks';

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

const TaskTablePage = (): JSX.Element => {
  const [addingTask, setAddingTask] = React.useState(false);
  const [dialogTask, setDialogTask] = React.useState<Task | null>(null);

  const {
    loading,
    data: taskData,
    error,
    clearCache: clearTasksCache,
  } = useGetTasks();

  // console.log('Task Data:', taskData);
  // console.log('Request Cache:', requestCache);

  const handleAddingTask = () => {
    setDialogTask(null);
    setAddingTask(true);
  };

  const handleCloseDialog = () => {
    setAddingTask(false);
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
          <HeaderWrapper>Tasks</HeaderWrapper>
          <SubHeaderWrapper>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddingTask}
            >
              Create Task
              <Add />
            </Button>
          </SubHeaderWrapper>
          <TaskTable
            taskData={taskData as Task[]}
            setDialogTask={setDialogTask}
            setAddingTask={setAddingTask}
            clearTasksCache={clearTasksCache}
          />
          {addingTask ? (
            <TaskDialog
              open={addingTask}
              onClose={handleCloseDialog}
              clearTasksCache={clearTasksCache}
              dialogTask={dialogTask}
            />
          ) : null}
        </>
      )}
    </RootWrapper>
  );
};

export default TaskTablePage;
