import React from 'react';
import { styled } from '@material-ui/core';
import { Task } from 'types/task';
import LoadingSpinner from 'elements/LoadingSpinner';

import { useGetTask } from 'hooks/axiosHooks';

import theme, { colors } from 'theme';

const RootWrapper = styled('div')(() => {
  return {
    width: '100%',
  };
});

export interface TaskPageProps {
  taskId: number;
}

interface InfoBoxProps {
  title: string;
  children?: any;
  gridArea?: string;
}

const InfoBoxHeader = styled('div')(() => {
  return {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    padding: '0.25rem 0',
    margin: '0.25rem 0',
    borderBottom: `2px solid ${theme.palette.primary.main}`,
    // backgroundColor: colors.grey,
  };
});

interface InfoBoxWrapperProps {
  gridArea?: string;
}

const InfoBoxWrapper = styled('div')((props: InfoBoxWrapperProps) => {
  return {
    gridArea: props.gridArea,
    border: `2px solid ${colors.grey}`,
    borderRadius: '4px',
    padding: '0.5rem',
  };
});

const InfoBox = (props: InfoBoxProps): JSX.Element => {
  return (
    <InfoBoxWrapper gridArea={props.gridArea}>
      <InfoBoxHeader>{props.title}</InfoBoxHeader>
      {props.children}
    </InfoBoxWrapper>
  );
};

interface TitleProps {
  task: Task;
}

const TitleWrapper = styled('div')(() => {
  return {
    padding: '0.5rem',
  };
});

const ProjectLabel = styled('div')(() => {
  return {
    paddingBottom: '0.25rem',
    fontSize: '1rem',
  };
});

const TitleHeader = styled('div')(() => {
  return {
    fontSize: '2rem',
  };
});

const Title = (props: TitleProps): JSX.Element => {
  return (
    <TitleWrapper>
      <ProjectLabel>Project ID: {props.task.projectId}</ProjectLabel>
      <TitleHeader>{props.task.name}</TitleHeader>
    </TitleWrapper>
  );
};

const GridWrapper = styled('div')(() => {
  return {
    display: 'grid',
    gridTemplateColumns: 'auto auto auto',
    gridTemplateRows: 'auto auto',
    gridTemplateAreas: "'details description comments' 'people dates comments'",
  };
});

const TaskPage = (props: TaskPageProps): JSX.Element => {
  const { loading, data, error } = useGetTask(props.taskId);

  const task = data as Task;

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <RootWrapper>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Title task={task} />
          <GridWrapper>
            <InfoBox title="Details" gridArea="details">
              <div>Type: {task.type}</div>
              <div>Priority: {task.priority}</div>
              <div>Status: {task.status}</div>
            </InfoBox>

            <InfoBox title="Description" gridArea="description">
              <div>{task.description}</div>
            </InfoBox>

            <InfoBox title="Dates" gridArea="dates">
              <div>Created On: {task.createdOn}</div>
              <div>Deadline: {task.deadline}</div>
            </InfoBox>

            <InfoBox title="People" gridArea="people">
              <div>Assignee ID: {task.assignedTo}</div>
              <div>Reporter ID: {task.reportedBy}</div>
            </InfoBox>
          </GridWrapper>
        </>
      )}
    </RootWrapper>
  );
};

export default TaskPage;
