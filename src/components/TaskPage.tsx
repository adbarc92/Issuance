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

const InfoBoxWrapper = styled('div')(() => {
  return {
    border: `2px solid ${colors.grey}`,
    borderRadius: '4px',
    padding: '0.5rem',
  };
});

const InfoBox = (props: InfoBoxProps): JSX.Element => {
  return (
    <InfoBoxWrapper>
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

const TaskPage = (props: TaskPageProps): JSX.Element => {
  const { loading, data, error, clearCache } = useGetTask(props.taskId);

  const task = data as Task;

  console.log('data:', data);

  return (
    <RootWrapper>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Title task={task} />

          <InfoBox title="Details">
            <div>type:{task.type}</div>
            <div>priority:{task.priority}</div>
            <div>status:{task.status}</div>
          </InfoBox>

          <InfoBox title="Description">
            <div>description:{task.description}</div>
          </InfoBox>

          <InfoBox title="Dates">
            <div>createdOn:{task.createdOn}</div>
            <div>deadline:{task.deadline}</div>
          </InfoBox>

          <InfoBox title="People">
            <div>assignedTo:{task.assignedTo}</div>
            <div>reportedBy:{task.reportedBy}</div>
          </InfoBox>
        </>
      )}
    </RootWrapper>
  );
};

export default TaskPage;
