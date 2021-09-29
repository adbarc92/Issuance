import React, { DragEvent } from 'react';
import { ClientTask } from 'types/task';
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
import theme, { colors } from 'theme';

const CARD_DESCRIPTION_LENGTH = 140;
const CARD_NAME_LENGTH = 50;

export interface TaskCardProps {
  task: ClientTask;
  startDrag: (ev: React.DragEvent<HTMLDivElement>) => void;
  endDrag: (ev: React.DragEvent<HTMLDivElement>) => void;
  setDialogTask: (task: ClientTask) => void;
  setHoveredTask: (task: ClientTask | null) => void;
  setAddingTask: (addingTask: boolean) => void;
  clearTasksCache: () => void;
  draggedTask: ClientTask | null;
  hoveredTask: ClientTask | null;
}

const CardTitle = styled(Typography)(() => {
  return {
    marginTop: '0.3rem',
  };
});

const CardDescription = styled(Typography)(() => {
  return {
    marginTop: '0.5rem',
    borderBottom: '1px solid rgba(0,0,0,0.2)',
    paddingBottom: '0.5rem',
  };
});

const CardType = styled(Typography)(() => {
  return {
    marginTop: '0.5rem',
  };
});

const CardContainer = styled('div')((props: any) => {
  return {
    display: 'flex',
    backgroundColor: props.highlighted ? theme.palette.info.light : 'unset',
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

const HighlightCard = styled(Card)(
  (props: { highlighted: 'true' | 'false' | '' }) => {
    return {
      backgroundColor:
        props.highlighted === 'true' ? colors.grey : colors.white,
    };
  }
);

const NullPtrEventWrapper = styled('div')((props: any) => {
  return {
    pointerEvents: props.enabled === 'true' ? 'none' : 'unset',
  };
});

const TaskPlaceholder = styled('div')((props: any) => {
  return {
    height: '8px',
    backgroundColor: props.black ? colors.black : colors.white,
  };
});

const fixStringSize = (text: string, maxSize: number): string => {
  if (text.length <= maxSize) {
    return text;
  } else {
    return text.slice(0, maxSize) + '...';
  }
};

export const TaskCard = (props: TaskCardProps): JSX.Element => {
  const {
    task,
    endDrag,
    setDialogTask,
    setAddingTask,
    clearTasksCache,
    startDrag,
    setHoveredTask,
    hoveredTask,
  } = props;
  const { name, description, type, priority, id, assignedTo } = task;
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
    <>
      {props.draggedTask ? (
        <TaskPlaceholder
          black={hoveredTask?.id === task.id ? 'true' : ''}
          key={task.id}
          onDragEnter={() => {
            if (hoveredTask?.id !== task.id) {
              setHoveredTask(task);
            }
          }}
        />
      ) : null}
      <HighlightCard
        variant="outlined"
        draggable
        onDragStart={startDrag}
        onDragEnd={(ev: React.DragEvent<HTMLDivElement>) => {
          endDrag(ev);
          setHoveredTask(null);
        }}
        onDragEnter={() => {
          setHoveredTask(task);
        }}
        highlighted={
          props.draggedTask?.id !== task.id && hoveredTask?.id === task.id
            ? 'true'
            : ''
        }
      >
        <NullPtrEventWrapper enabled={String(props.draggedTask !== null)}>
          <CardContent>
            <CardContainer>
              <CardInfo>
                <Link to={`/tasks/${id}`}>
                  <CardTitle variant="h5">
                    {fixStringSize(name, CARD_NAME_LENGTH)}
                  </CardTitle>
                </Link>
                <CardDescription variant="body1">
                  {fixStringSize(description, CARD_DESCRIPTION_LENGTH)}
                </CardDescription>
                <CardType variant="subtitle1">{type}</CardType>
                <Typography variant="caption">{priority}</Typography>
              </CardInfo>
              <CardMenu>
                <Avatar title={assignedTo} />
                <Button onClick={handleClick}>
                  <MoreVert />
                </Button>
                <SimpleMenu
                  menuItems={menuItems}
                  anchorElement={anchorElement}
                  handleClose={handleClose}
                />
              </CardMenu>
            </CardContainer>
          </CardContent>
        </NullPtrEventWrapper>
      </HighlightCard>
    </>
  );
};
