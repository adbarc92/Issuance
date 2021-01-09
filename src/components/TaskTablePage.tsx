import React from 'react';
import TaskDialog from 'components/TaskDialog';
import { Add } from '@material-ui/icons';
import { styled, Button } from '@material-ui/core';

import { Task, TaskStatus } from 'types/task';
import TaskTable from 'components/TaskTable';
import LoadingSpinner from 'elements/LoadingSpinner';
import { useGetTasks } from 'hooks/axiosHooks';

import { useForceUpdate } from 'hooks/render';

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

export const getRowSize = (
  taskStatus: TaskStatus,
  columnSizeState: {
    backlogTasksCount: number;
    activeTasksCount: number;
    completeTasksCount: number;
  }
): number => {
  switch (taskStatus) {
    case 'Backlog':
      return columnSizeState.backlogTasksCount;
    case 'Active':
      return columnSizeState.activeTasksCount;
    case 'Complete':
      return columnSizeState.completeTasksCount;
    default:
      return 0;
  }
};

const TaskTablePage = (): JSX.Element => {
  const [addingTask, setAddingTask] = React.useState(false);
  const [dialogTask, setDialogTask] = React.useState<Task | null>(null);

  const [columnSizeState, columnSizeDispatch] = React.useReducer(
    (
      state: {
        backlogTasksCount: number;
        activeTasksCount: number;
        completeTasksCount: number;
      },
      action: {
        key: string;
        payload:
          | number
          | {
              backlogTasksCount: number;
              activeTasksCount: number;
              completeTasksCount: number;
            };
      }
    ) => {
      const newState = { ...state };
      switch (action.key) {
        case 'updateBacklogSize':
          newState.backlogTasksCount = action.payload as number;
          break;
        case 'updateActiveSize':
          newState.activeTasksCount = action.payload as number;
          break;
        case 'updateCompleteSize':
          newState.completeTasksCount = action.payload as number;
          break;
        case 'updateAll':
          const {
            backlogTasksCount,
            activeTasksCount,
            completeTasksCount,
          } = action.payload as {
            backlogTasksCount: number;
            activeTasksCount: number;
            completeTasksCount: number;
          };
          newState.backlogTasksCount = backlogTasksCount;
          newState.activeTasksCount = activeTasksCount;
          newState.completeTasksCount = completeTasksCount;
          break;
      }
      return newState;
    },
    {
      backlogTasksCount: 0,
      activeTasksCount: 0,
      completeTasksCount: 0,
    }
  );

  const {
    loading,
    data: taskData,
    error,
    clearCache: clearTasksCache,
  } = useGetTasks();

  const reRender = useForceUpdate();

  console.log('taskData:', taskData);

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
            columnSizeState={columnSizeState}
            reRender={reRender}
          />
          {addingTask ? (
            <TaskDialog
              open={addingTask}
              onClose={handleCloseDialog}
              clearTasksCache={clearTasksCache}
              dialogTask={dialogTask}
              columnSizeState={columnSizeState}
              columnSizeDispatch={columnSizeDispatch}
            />
          ) : null}
        </>
      )}
    </RootWrapper>
  );
};

export default TaskTablePage;
