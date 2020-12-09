import React, { DragEvent } from 'react';
import { Task } from 'types/task';
import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  makeStyles,
} from '@material-ui/core';

import SimpleMenu from 'elements/SimpleMenu';

import { MoreVert } from '@material-ui/icons';

import { TaskDialogState } from 'components/TaskDialog';

const useStyles = makeStyles({
  title: {
    fontSize: 14,
  },
});

export interface TaskCardProps {
  task: Task;
  startDrag: (ev: React.DragEvent<HTMLDivElement>) => void;
  endDrag: (ev: React.DragEvent<HTMLDivElement>) => void;
  setDialogTask: (task: TaskDialogState) => void;
  setAddingTask: (addingTask: boolean) => void;
}

const taskToDialogState = (task: Task): TaskDialogState => {
  const {
    name,
    summary,
    description,
    type: taskType,
    status: taskStatus,
    priority: taskPriority,
    deadline,
  } = task;
  return {
    name,
    summary,
    description,
    taskType,
    taskStatus,
    taskPriority,
    deadline,
  };
};

export const TaskCard = (props: TaskCardProps): JSX.Element => {
  const { task, startDrag, endDrag, setDialogTask, setAddingTask } = props;
  const { name, summary, status } = task;
  const [anchorElement, setAnchorElement] = React.useState<HTMLElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElement(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElement(null);
  };

  const menuItems = [
    {
      key: 'Edit',
      onClick: () => {
        // console.log('Should edit task');
        const dialogTask = taskToDialogState(task);
        setDialogTask(dialogTask);
        setAddingTask(true);
        handleClose();
      },
    },
    {
      key: 'Delete',
      onClick: () => {
        console.log('Should delete task');
        handleClose();
      },
    },
  ];

  const classes = useStyles();

  return (
    <Card
      variant="outlined"
      onDragStart={startDrag}
      onDragEnd={endDrag}
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
      <Button onClick={handleClick}>
        <MoreVert />
      </Button>
      <SimpleMenu
        menuItems={menuItems}
        anchorElement={anchorElement}
        handleClose={handleClose}
      />
    </Card>
  );
};
