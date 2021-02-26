import React from 'react';
import { Task } from 'types/task';

import { useGetTask } from 'hooks/axiosHooks';

import LoadingSpinner from 'elements/LoadingSpinner';
import PageTitle from 'elements/PageTitle';
import RootWrapper from 'elements/RootWrapper';
import InfoBox from 'elements/InfoBox';
import GridWrapper from 'elements/GridWrapper';

export interface TaskPageProps {
  taskId: string;
}

const TaskPage = (props: TaskPageProps): JSX.Element => {
  const { loading, data, error } = useGetTask(props.taskId);

  if (error) {
    return <div>{error}</div>;
  }

  const task = data as Task;

  return (
    <RootWrapper>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <PageTitle title={task.name} subtitle={String(task.projectId)} />
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
