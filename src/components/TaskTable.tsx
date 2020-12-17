import React from 'react';

import { makeStyles, styled } from '@material-ui/core';

import { TaskCard } from 'components/TaskCard';
import { Task, TaskStatus } from 'types/task';

import { updateTask } from 'store/actions';

import { useForceUpdate } from 'hooks/render';
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
    width: '33%',
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

export interface TaskTableProps {
  taskData: Task[];
  setDialogTask: (task: Task) => void;
  setAddingTask: (addingTask: boolean) => void;
}

const TaskTable = (props: TaskTableProps): JSX.Element => {
  const { taskData, setDialogTask, setAddingTask } = props;

  const classes = useStyles();

  const [draggedTaskId, setDraggedTaskId] = React.useState(0);
  const [dragColumn, setDragColumn] = React.useState<TaskStatus | null>(null);

  const reRender = useForceUpdate();

  // Figure out how many task statuses there are => variable column numbers

  // insert hook to get the tasks
  // feed tasks into task cards

  const startDrag = (task: Task) => {
    return (ev: React.DragEvent<HTMLDivElement>) => {
      setDraggedTaskId(task.id);
    };
  };

  const endDrag = (task: Task) => {
    return async (ev: React.DragEvent<HTMLDivElement>) => {
      const result = await updateTask(task.id, {
        ...task,
        status: dragColumn as TaskStatus,
      });
      // console.log('Result:', result);

      setDragColumn(null);
      reRender();
    };
  };

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
    <>
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
                  setDialogTask={setDialogTask}
                  setAddingTask={setAddingTask}
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
                  setDialogTask={setDialogTask}
                  setAddingTask={setAddingTask}
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
                  setDialogTask={setDialogTask}
                  setAddingTask={setAddingTask}
                />
              );
            })}
          </Column>
        </div>
      </div>
    </>
  );
};

export default TaskTable;
