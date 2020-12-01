import React from 'react';

import { makeStyles, styled } from '@material-ui/core';
import { TaskCard } from 'components/TaskCard';
import LoadingSpinner from 'elements/LoadingSpinner';
import { Task, TaskStatus } from 'types/task';
import { updateTask } from 'store/actions';
import { useGetTasks } from 'store/axiosHooks';
import { useForceUpdate } from 'store/hooks';
import theme from 'theme';

const useStyles = makeStyles({
  root: {},
  gridContainer: {},
  gridRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  columnContainer: {
    display: 'flex',
    flexDirection: 'column',
    border: '2px solid black',
    width: '30%',
  },
});

// This is a higher-order component
const Header = styled('div')((props: any) => {
  return {
    fontSize: '24px',
    textAlign: 'center',
    color: props.colored ? 'red' : 'black',
  };
});

const Column = styled('div')((props: any) => {
  return {
    backgroundColor: props.highlighted
      ? theme.palette.background.highlighted
      : 'unset',
    padding: '0.25rem',
  };
});

const TasksTable = (): JSX.Element => {
  const classes = useStyles();
  const [draggedTaskId, setDraggedTaskId] = React.useState(0);
  const [dragColumn, setDragColumn] = React.useState<TaskStatus | null>(null);
  // const [taskData, setTaskData] = React.useState<Task[] | null>(null);

  const { loading, data: taskData, error } = useGetTasks();
  const reRender = useForceUpdate();

  // console.log('Data:', taskData);

  // Figure out how many task statuses there are => variable column numbers

  // insert hook to get the tasks
  // feed tasks into task cards

  const startDrag = (task: Task) => {
    return (ev: React.DragEvent<HTMLDivElement>) => {
      // console.log('Dragged Task Id:', taskId);
      setDraggedTaskId(task.id);
    };
  };

  const endDrag = (task: Task) => {
    return async (ev: React.DragEvent<HTMLDivElement>) => {
      // console.log('end drag');
      const result = await updateTask(task.id, {
        ...task,
        status: dragColumn as TaskStatus,
      });

      console.log('result:', result);
      setDragColumn(null);
      reRender();
    };
  };

  if (error) {
    return <div>There was an error: {error}</div>;
  }

  let backlogTasks, activeTasks, completeTasks;

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
    <div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className={classes.gridContainer}>
          <div className={classes.gridRow}>
            <div className={classes.columnContainer}>
              <Header>Backlog</Header>
            </div>
            <div className={classes.columnContainer}>
              <Header>Active</Header>
            </div>
            <div className={classes.columnContainer}>
              <Header>Complete</Header>
            </div>
          </div>
          <div className={classes.gridRow}>
            <Column
              className={classes.columnContainer}
              highlighted={dragColumn === TaskStatus.BACKLOG ? 'true' : ''}
              onDragEnter={e => {
                e.preventDefault();
                setDragColumn(TaskStatus.BACKLOG);
              }}
              onDragOver={e => {
                e.preventDefault();
              }}
            >
              {backlogTasks?.map((task: Task, index) => {
                return (
                  <TaskCard
                    key={index}
                    task={task}
                    startDrag={startDrag(task)}
                    endDrag={endDrag(task)}
                  />
                );
              })}
            </Column>
            <Column
              className={classes.columnContainer}
              highlighted={dragColumn === TaskStatus.ACTIVE ? 'true' : ''}
              onDragEnter={e => {
                e.preventDefault();
                setDragColumn(TaskStatus.ACTIVE);
              }}
              onDragOver={e => {
                e.preventDefault();
              }}
            >
              {activeTasks?.map((task: Task, index) => {
                return (
                  <TaskCard
                    key={index}
                    task={task}
                    startDrag={startDrag(task)}
                    endDrag={endDrag(task)}
                  />
                );
              })}
            </Column>
            <Column
              className={classes.columnContainer}
              highlighted={dragColumn === TaskStatus.COMPLETE ? 'true' : ''}
              onDragEnter={e => {
                e.preventDefault();
                setDragColumn(TaskStatus.COMPLETE);
              }}
              onDragOver={e => {
                e.preventDefault();
              }}
            >
              {completeTasks?.map((task: Task, index) => {
                return (
                  <TaskCard
                    key={index}
                    task={task}
                    startDrag={startDrag(task)}
                    endDrag={endDrag(task)}
                  />
                );
              })}
            </Column>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksTable;
