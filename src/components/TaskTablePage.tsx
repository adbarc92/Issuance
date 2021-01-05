import React from 'react';
import TaskDialog from 'components/TaskDialog';
import { Add } from '@material-ui/icons';
import { styled, Button } from '@material-ui/core';

import { Task, TaskStatus } from 'types/task';
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

export const getRowIndex = (
  taskStatus: TaskStatus,
  columnSizeState: {
    backlogTasks: number;
    activeTasks: number;
    completeTasks: number;
  }
): number => {
  switch (taskStatus) {
    case 'Backlog':
      return columnSizeState.backlogTasks;
    case 'Active':
      return columnSizeState.activeTasks;
    case 'Complete':
      return columnSizeState.completeTasks;
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
        backlogTasks: number;
        activeTasks: number;
        completeTasks: number;
      },
      action: {
        key: string;
        payload:
          | number
          | {
              backlogTasks: number;
              activeTasks: number;
              completeTasks: number;
            };
      }
    ) => {
      const newState = { ...state };
      switch (action.key) {
        case 'updateBacklogSize':
          newState.backlogTasks = action.payload as number;
          break;
        case 'updateActiveSize':
          newState.activeTasks = action.payload as number;
          break;
        case 'updateCompleteSize':
          newState.completeTasks = action.payload as number;
          break;
        case 'updateAll':
          const {
            backlogTasks,
            activeTasks,
            completeTasks,
          } = action.payload as {
            backlogTasks: number;
            activeTasks: number;
            completeTasks: number;
          };
          newState.backlogTasks = backlogTasks;
          newState.activeTasks = activeTasks;
          newState.completeTasks = completeTasks;
          break;
      }
      console.log('newState:', newState);
      return newState;
    },
    {
      backlogTasks: 0,
      activeTasks: 0,
      completeTasks: 0,
    }
  );

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

  let backlogTasks, activeTasks, completeTasks;

  if (taskData) {
    (backlogTasks as Task[]) = taskData.filter(task => {
      return task.status === TaskStatus.BACKLOG;
    });
    (activeTasks as Task[]) = taskData.filter(task => {
      return task.status === TaskStatus.ACTIVE;
    });
    (completeTasks as Task[]) = taskData.filter(task => {
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
