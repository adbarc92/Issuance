import React, { useEffect } from 'react';
import TaskDialog from 'components/TaskDialog';

import { ClientTask, TaskStatus } from 'types/task';
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
import AddButton from 'elements/AddButton';
import PageTitle from 'elements/PageTitle';

const TaskTablePage = (): JSX.Element => {
  const [addingTask, setAddingTask] = React.useState(false);
  const [dialogTask, setDialogTask] = React.useState<ClientTask | null>(null);

  const reRender = useForceUpdate();

  const {
    loading,
    data: taskData,
    error,
    clearCache: clearTasksCache,
  } = useGetTasks();

  // * useSocketEvents will replace this
  useEffect(() => {
    socket.on(SocketMessages.TASKS, (taskPayload: UpdateTaskResponse) => {
      if (taskPayload.userId !== getUserToken()) {
        handleUpdateTask(taskPayload);
        reRenderApp();
      }
    });
    return () => {
      clearCacheWithoutRender(CacheKey.TASKS);
      socket.off(SocketMessages.TASKS);
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

  let backlogTasks: ClientTask[] = [],
    activeTasks: ClientTask[] = [],
    completeTasks: ClientTask[] = [];

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
          <PageTitle
            title={'Tasks'}
            headerElem={
              <AddButton title={'Create Task'} handleClick={handleAddingTask} />
            }
          />
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
