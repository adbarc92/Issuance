import React, { Fragment } from 'react';

import { makeStyles, styled, Card } from '@material-ui/core';

import { TaskCard } from 'components/TaskCard';
import { Task, TaskStatus } from 'types/task';

import { updateTask } from 'store/actions';

import { useForceUpdate } from 'hooks/render';
import theme from 'theme';
import { colors } from 'theme';

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
    border: `2px solid ${colors.grey}`,
    width: '33%',
  },
});

// This is a higher-order component
const Header = styled('div')((props: any) => {
  return {
    fontSize: '24px',
    textAlign: 'center',
    color: props.colored ? colors.red : colors.black,
    backgroundColor: colors.white,
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

const PlusCard = styled(Card)(
  (props: { highlighted: 'true' | 'false' | '' }) => {
    return {
      border: `2px dashed ${
        props.highlighted === 'true' ? colors.black : colors.grey
      }`,
      minHeight: '64px',
      backgroundColor:
        props.highlighted === 'true' ? colors.grey : colors.white,
    };
  }
);

export interface TaskTableProps {
  taskData: Task[];
  setDialogTask: (task: Task) => void;
  setAddingTask: (addingTask: boolean) => void;
  clearTasksCache: () => void;
}

const TaskTable = (props: TaskTableProps): JSX.Element => {
  const { taskData, setDialogTask, setAddingTask } = props;

  const classes = useStyles();

  const [draggedTask, setDraggedTask] = React.useState<Task | null>(null);
  const [dragColumn, setDragColumn] = React.useState<TaskStatus | null>(null);
  const [hoveredTask, setHoveredTask] = React.useState<Task | null>(null);

  const reRender = useForceUpdate();

  // Figure out how many task statuses there are => variable column numbers

  // insert hook to get the tasks
  // feed tasks into task cards

  const endDrag = (task: Task) => {
    return async (ev: React.DragEvent<HTMLDivElement>) => {
      await updateTask(task.id, {
        ...task,
        status: dragColumn as TaskStatus,
      });
      // console.log('Result:', result);

      setDragColumn(null);
      setDraggedTask(null);
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

  const renderTask = (task: Task, index: number) => {
    return (
      <TaskCard
        key={index}
        task={task}
        endDrag={endDrag(task)}
        startDrag={() => {
          setDraggedTask(task);
        }}
        hoveredTask={hoveredTask}
        draggedTask={draggedTask}
        setHoveredTask={setHoveredTask}
        setDialogTask={setDialogTask}
        setAddingTask={setAddingTask}
        clearTasksCache={props.clearTasksCache}
      />
    );
  };

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
            onDragEnter={(e: React.DragEvent<HTMLDivElement>) => {
              e.preventDefault();
              setDragColumn(TaskStatus.BACKLOG);
            }}
            onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
              e.preventDefault();
            }}
          >
            {backlogTasks?.map(renderTask)}
            {draggedTask ? (
              <PlusCard
                onDragEnter={(ev: React.DragEvent<HTMLDivElement>) => {
                  setHoveredTask(null);
                }}
                highlighted={
                  hoveredTask === null && dragColumn === TaskStatus.BACKLOG
                    ? 'true'
                    : 'false'
                }
              />
            ) : null}
          </Column>
          <Column
            className={classes.columnContainer}
            highlighted={dragColumn === TaskStatus.ACTIVE ? 'true' : ''}
            onDragEnter={(e: React.DragEvent<HTMLDivElement>) => {
              e.preventDefault();
              setDragColumn(TaskStatus.ACTIVE);
            }}
            onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
              e.preventDefault();
            }}
          >
            {activeTasks?.map(renderTask)}
            {draggedTask ? (
              <PlusCard
                onDragEnter={(ev: React.DragEvent<HTMLDivElement>) => {
                  setHoveredTask(null);
                }}
                highlighted={
                  hoveredTask === null && dragColumn === TaskStatus.ACTIVE
                    ? 'true'
                    : 'false'
                }
              />
            ) : null}
          </Column>
          <Column
            className={classes.columnContainer}
            highlighted={dragColumn === TaskStatus.COMPLETE ? 'true' : ''}
            onDragEnter={(e: React.DragEvent<HTMLDivElement>) => {
              e.preventDefault();
              setDragColumn(TaskStatus.COMPLETE);
            }}
            onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
              e.preventDefault();
            }}
          >
            {completeTasks?.map(renderTask)}
            {draggedTask ? (
              <PlusCard
                onDragEnter={(ev: React.DragEvent<HTMLDivElement>) => {
                  setHoveredTask(null);
                }}
                highlighted={
                  hoveredTask === null && dragColumn === TaskStatus.COMPLETE
                    ? 'true'
                    : 'false'
                }
              />
            ) : null}
          </Column>
        </div>
      </div>
    </>
  );
};

export default TaskTable;
