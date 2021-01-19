import React, { useEffect } from 'react';
import TaskDialog from 'components/TaskDialog';
import { Add } from '@material-ui/icons';
import { styled, Button } from '@material-ui/core';

import { Task, TaskStatus } from 'types/task';
import TaskTable from 'components/TaskTable';
import LoadingSpinner from 'elements/LoadingSpinner';
import { useGetTasks } from 'hooks/axiosHooks';

import { useForceUpdate } from 'hooks/render';

import { socket } from 'io';
import { handleUpdateTask } from 'store/actions';
import { UpdateTaskResponse } from 'types/task';
import { getUserToken } from 'store/auth';

import { clearCacheWithoutRender, CacheKey } from 'hooks/getData';
import { reRenderApp } from 'App';
import { SocketMessages } from 'types/socket';
import RootWrapper from 'elements/RootWrapper';

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

  const reRender = useForceUpdate();

  const {
    loading,
    data: taskData,
    error,
    clearCache: clearTasksCache,
  } = useGetTasks();

  useEffect(() => {
    // On page load, register task register;
    socket.on(SocketMessages.TASKS, (taskPayload: UpdateTaskResponse) => {
      if (taskPayload.userId !== getUserToken()) {
        handleUpdateTask(taskPayload);
        reRenderApp();
      }
    });
    return () => {
      clearCacheWithoutRender(CacheKey.TASKS);
      socket.off('tasks');
    };
  }, []);

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

  let backlogTasks: Task[] = [],
    activeTasks: Task[] = [],
    completeTasks: Task[] = [];

  if (taskData) {
    backlogTasks = taskData.filter(task => {
      return task.status === TaskStatus.BACKLOG;
    });

    activeTasks = taskData.filter(task => {
      return task.status === TaskStatus.ACTIVE;
    });

    completeTasks = taskData.filter(task => {
      return task.status === TaskStatus.COMPLETE;
    });
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
            taskData={{ backlogTasks, activeTasks, completeTasks }}
            setDialogTask={setDialogTask}
            setAddingTask={setAddingTask}
            clearTasksCache={clearTasksCache}
            reRender={reRender}
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
