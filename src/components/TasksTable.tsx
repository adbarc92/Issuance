import React from 'react';

import { makeStyles, styled } from '@material-ui/core';
import { TaskCard } from 'components/TaskCard';
import LoadingSpinner from 'elements/LoadingSpinner';
import { Task, TaskPriority, TaskType, TaskStatus } from 'types/task';
import { useGetTasks } from 'hooks/axiosHooks';
import { useGetData } from 'hooks/useGetData';

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
const Header = styled('div')((props: { colored?: boolean }) => {
  return {
    fontSize: '24px',
    textAlign: 'center',
    color: props.colored ? 'red' : 'black',
  };
});

const TasksTable = (): JSX.Element => {
  const classes = useStyles();
  const [draggedTaskId, setDraggedTaskId] = React.useState(0);
  const [newTaskStatus, setNewTaskStatus] = React.useState('');
  // Figure out how many task statuses there are => variable column numbers

  // insert hook to get the tasks
  // feed tasks into task cards

  // const printNewTaskStatus = (status: string): void => {
  //   console.log('Task status is changing to', status);
  //   setNewTaskStatus(status);
  // };

  const { loading, data: taskData, error } = useGetTasks();

  if (error) {
    return <div>There was an error: {error}</div>;
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
              <Header colored={true}>Active</Header>
            </div>
            <div className={classes.columnContainer}>
              <Header>Complete</Header>
            </div>
          </div>
          <div className={classes.gridRow}>
            <div
              className={classes.columnContainer}
              onMouseEnter={() => {
                setNewTaskStatus('Backlog');
              }}
              onMouseLeave={() => {
                setNewTaskStatus('');
              }}
            >
              {taskData?.map((datum, index) => {
                const {
                  taskId,
                  name,
                  summary,
                  status,
                  priority,
                  type,
                  projectId,
                } = datum;
                // Self-Note: Streamline this
                const task = {
                  taskId,
                  name,
                  summary,
                  type,
                  priority,
                  status,
                  projectId,
                };
                return (
                  <TaskCard
                    key={index}
                    newTaskStatus={newTaskStatus}
                    Task={task}
                    setDraggedTaskId={setDraggedTaskId}
                  />
                );
              })}
            </div>
            <div
              className={classes.columnContainer}
              onMouseEnter={() => {
                setNewTaskStatus('Active');
              }}
              onMouseLeave={() => {
                setNewTaskStatus('');
              }}
            >
              Second Column
            </div>
            <div
              className={classes.columnContainer}
              onMouseEnter={() => {
                setNewTaskStatus('Complete');
              }}
              onMouseLeave={() => {
                setNewTaskStatus('');
              }}
            >
              Third Column
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksTable;
