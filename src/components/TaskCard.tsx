import React, { DragEvent } from 'react';
import { TaskPriority, TaskType, TaskStatus } from 'types/task';
import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles({
  title: {
    fontSize: 14,
  },
});

export interface TaskProps {
  taskId: number;
  name: string;
  summary: string;
  // description: string;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  projectId: number;
}

export interface TaskCardProps {
  Task: TaskProps;
  setDraggedTaskId: (id: number) => void;
  newTaskStatus: string;
}

export const TaskCard = (props: TaskCardProps): JSX.Element => {
  // const { taskId, name, summary, status } = props;
  const { Task, setDraggedTaskId, newTaskStatus } = props;
  const { taskId, name, summary, status } = Task;

  const classes = useStyles();

  const startDrag = (event: DragEvent) => {
    setDraggedTaskId(taskId);
  };

  const endDrag = (event: DragEvent) => {
    console.log('Change status of task', name, 'to', newTaskStatus);
  };

  return (
    <Card
      variant="outlined"
      onDragStart={event => {
        startDrag(event);
      }}
      onDragEnd={event => {
        endDrag(event);
      }}
      draggable
    >
      <CardContent>
        <Typography variant="h5" component="h2" className={classes.title}>
          {name}
        </Typography>
        <Typography variant="body2" component="p">
          {summary}
        </Typography>
        <Typography variant="body1" component="p">
          {status}
        </Typography>
      </CardContent>
    </Card>
  );
};
