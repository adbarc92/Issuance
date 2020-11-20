import React from 'react';

import { makeStyles } from '@material-ui/core';
import { TaskCard } from 'components/TaskCard';
import LoadingSpinner from 'elements/LoadingSpinner';
import { Task, TaskPriority, TaskType, TaskStatus } from 'types/task';
import { getTasks } from 'hooks/axiosHooks';
import { useGetData } from 'hooks/useGetData';

const useStyles = makeStyles({
  root: {},
  gridContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  columnContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
});

const TasksTable = (): JSX.Element => {
  const classes = useStyles();
  // Figure out how many task statuses there are => variable column numbers

  // insert hook to get the tasks
  // feed tasks into task cards

  const { loading, data: taskData, error } = useGetData(getTasks);

  if (error) {
    return <div>There was an error: {error}</div>;
  }

  return (
    <div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className={classes.gridContainer}>
          <div className={classes.columnContainer}>
            {taskData?.map((datum, index) => {
              const { name, summary, status, priority, type, project } = datum;
              return (
                <TaskCard
                  key={index}
                  projectId={project}
                  name={name}
                  summary={summary}
                  status={status}
                  priority={priority}
                  type={type}
                />
              );
            })}
          </div>
          <div className={classes.columnContainer}>Second Column</div>
          <div className={classes.columnContainer}>Third Column</div>
        </div>
      )}
    </div>
  );
};

export default TasksTable;
