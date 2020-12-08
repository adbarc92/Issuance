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

const useStyles = makeStyles({
  title: {
    fontSize: 14,
  },
});

export interface TaskCardProps {
  task: Task;
  startDrag: (ev: React.DragEvent<HTMLDivElement>) => void;
  endDrag: (ev: React.DragEvent<HTMLDivElement>) => void;
}

export const TaskCard = (props: TaskCardProps): JSX.Element => {
  // const { taskId, name, summary, status } = props;
  const { task, startDrag, endDrag } = props;
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
        console.log('Should delete task');
      },
    },
    {
      key: 'Delete',
      onClick: () => {
        console.log('Should delete task');
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
