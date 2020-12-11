import React, { DragEvent } from 'react';
import { Task } from 'types/task';
import {
  Card,
  CardContent,
  Button,
  Typography,
  styled,
  Avatar,
} from '@material-ui/core';
import { Link } from 'react-router-dom';

import { deleteTask } from 'store/actions';

import SimpleMenu from 'elements/SimpleMenu';

import { MoreVert } from '@material-ui/icons';

export interface TaskCardProps {
  task: Task;
  startDrag: (ev: React.DragEvent<HTMLDivElement>) => void;
  endDrag: (ev: React.DragEvent<HTMLDivElement>) => void;
  setDialogTask: (task: Task) => void;
  setAddingTask: (addingTask: boolean) => void;
  clearTasksCache: () => void;
}

const MenuButton = styled(Button)(() => {
  return {
    // position: 'absolute',
    // right: '0.5rem',
    // bottom: '0.5rem',
  };
});

const AvatarShell = styled(Avatar)(() => {
  return {
    // position: 'absolute',
    // top: '0.8rem',
    // right: '0.8rem',
  };
});

const CardContainer = styled('div')(() => {
  return {
    // position: 'relative',
    display: 'flex',
  };
});

const CardInfo = styled('div')(() => {
  return {
    width: 'calc(100% - 2.5rem)',
    overflow: 'hidden',
  };
});

const CardMenu = styled('div')(() => {
  return {
    width: '2rem',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    display: 'flex',
  };
});

export const TaskCard = (props: TaskCardProps): JSX.Element => {
  const {
    task,
    startDrag,
    endDrag,
    setDialogTask,
    setAddingTask,
    clearTasksCache,
  } = props;
  const { name, description, type, priority, id } = task;
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
        const dialogTask = task;
        setDialogTask(dialogTask);
        setAddingTask(true);
        handleClose();
      },
    },
    {
      key: 'Delete',
      onClick: async () => {
        await deleteTask(task.id);
        handleClose();
        clearTasksCache();
      },
    },
  ];

  return (
    <Card
      variant="outlined"
      onDragStart={startDrag}
      onDragEnd={endDrag}
      draggable
    >
      <CardContent>
        <CardContainer>
          <CardInfo>
            <Link to={`/tasks/${id}`}>
              <Typography variant="h5" component="h5">
                {name}
              </Typography>
            </Link>
            <Typography variant="body1" component="p">
              {description}
            </Typography>
            <Typography variant="subtitle1" component="p">
              {type}
            </Typography>
            <Typography variant="caption" component="p">
              {priority}
            </Typography>
          </CardInfo>
          <CardMenu>
            <AvatarShell />
            <MenuButton onClick={handleClick}>
              <MoreVert />
            </MenuButton>
            <SimpleMenu
              menuItems={menuItems}
              anchorElement={anchorElement}
              handleClose={handleClose}
            />
          </CardMenu>
        </CardContainer>
      </CardContent>
    </Card>
  );
};
