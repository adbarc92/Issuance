import React from 'react';
import TaskDialog, { TaskDialogState } from 'components/TaskDialog';
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

const taskToDialogState = (task: Task): TaskDialogState => {
  const {
    name,
    summary,
    description,
    type: taskType,
    status: taskStatus,
    priority: taskPriority,
    deadline,
  } = task;
  return {
    name,
    summary,
    description,
    taskType,
    taskStatus,
    taskPriority,
    deadline,
  };
};

const TaskPage = (): JSX.Element => {
  const [addingTask, setAddingTask] = React.useState(false);
  const [dialogTask, setDialogTask] = React.useState<Task | null>(null);

  const {
    loading,
    data: taskData,
    error,
    clearCache: clearTasksCache,
  } = useGetTasks();

  const handleAddingTask = () => {
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
          <TaskTable taskData={taskData as Task[]} />
          <TaskDialog
            open={addingTask}
            onClose={handleCloseDialog}
            clearTasksCache={clearTasksCache}
          />
        </>
      )}
    </RootWrapper>
  );
};

export default TaskPage;
