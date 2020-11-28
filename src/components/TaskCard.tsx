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
  projectId: number;
  taskId: number;
  name: string;
  summary: string;
  priority: TaskPriority;
  type: TaskType;
  status: TaskStatus;
  // description: string;
}

export const TaskCard = (props: TaskProps): JSX.Element => {
  const { taskId, name, summary, status } = props;

  const classes = useStyles();

  // let startDrag = (event: DragEvent, taskId: number) => {};

  // let endDrag = (event: DragEvent, taskId: number) => {};

  return (
    <Card
      variant="outlined"
      // onDragStart={event => {
      //   startDrag(event, taskId);
      // }}
      // onDragEnd={event => {

      // }}
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
