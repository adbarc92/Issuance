import React from 'react';

import { styled, Card } from '@material-ui/core';

import { TaskCard } from 'components/TaskCard';
import { Task, TaskStatus } from 'types/task';

import { updateTask } from 'store/actions';

import theme from 'theme';
import { colors } from 'theme';

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
    display: 'flex',
    flexDirection: 'column',
    border: `2px solid ${colors.grey}`,
    width: '33%',
  };
});

const GridRow = styled('div')(() => {
  return {
    display: 'flex',
    flexDirection: 'row',
  };
});

const HeaderContainer = styled(Column)(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
    border: `2px solid ${colors.grey}`,
    width: '33%',
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
  taskData: {
    backlogTasks: Task[];
    activeTasks: Task[];
    completeTasks: Task[];
  };
  setDialogTask: (task: Task) => void;
  setAddingTask: (addingTask: boolean) => void;
  clearTasksCache: () => void;
  reRender: () => void;
}

const TaskTable = (props: TaskTableProps): JSX.Element => {
  const { taskData, setDialogTask, setAddingTask, reRender } = props;

  const { backlogTasks, activeTasks, completeTasks } = taskData;

  const taskLengths = {
    [TaskStatus.BACKLOG]: backlogTasks.length,
    [TaskStatus.ACTIVE]: activeTasks.length,
    [TaskStatus.COMPLETE]: completeTasks.length,
  };

  const [draggedTask, setDraggedTask] = React.useState<Task | null>(null);
  const [dragColumn, setDragColumn] = React.useState<TaskStatus | null>(null);
  const [hoveredTask, setHoveredTask] = React.useState<Task | null>(null);

  // Figure out how many task statuses there are => variable column numbers

  const endDrag = (task: Task) => {
    return async () => {
      let rowIndex = 0;
      if (hoveredTask) {
        rowIndex = hoveredTask.rowIndex;
      } else if (dragColumn) {
        rowIndex = taskLengths[dragColumn];
        if (dragColumn !== task.status) {
          rowIndex++;
        }
      }
      await updateTask(task.id, {
        ...task,
        status: dragColumn as TaskStatus,
        rowIndex,
      });

      setDragColumn(null);
      setDraggedTask(null);
      reRender();
    };
  };

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
      <div>
        <GridRow>
          <HeaderContainer>
            <Header>Backlog</Header>
          </HeaderContainer>
          <HeaderContainer>
            <Header>Active</Header>
          </HeaderContainer>
          <HeaderContainer>
            <Header>Complete</Header>
          </HeaderContainer>
        </GridRow>
        <GridRow>
          <Column
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
        </GridRow>
      </div>
    </>
  );
};

export default TaskTable;
