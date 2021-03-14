import React from 'react';
import { Task } from 'types/task';

import { useGetTask } from 'hooks/axiosHooks';

import TaskDialog from 'components/TaskDialog';

import LoadingSpinner from 'elements/LoadingSpinner';
import PageTitle from 'elements/PageTitle';
import RootWrapper from 'elements/RootWrapper';
import InfoBox from 'elements/InfoBox';
import GridWrapper from 'elements/GridWrapper';

import { Edit } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';

import Comment from 'components/Comment';

export interface TaskPageProps {
  taskId: string;
}

const TaskPage = (props: TaskPageProps): JSX.Element => {
  const { loading, data, error, clearCache: clearTasksCache } = useGetTask(
    props.taskId
  );

  const [editingTask, setEditingTask] = React.useState(false);

  const handleOpenDialog = () => {
    setEditingTask(true);
  };

  const handleCloseDialog = () => {
    setEditingTask(false);
  };

  if (error) {
    return <div>{error}</div>;
  }

  const EditButton = () => {
    return (
      <IconButton
        onClick={() => {
          handleOpenDialog();
        }}
      >
        <Edit />
      </IconButton>
    );
  };

  const task = data as Task;

  return (
    <RootWrapper>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <PageTitle
            title={task.name}
            subtitle={String(task.projectId)}
            headerElem={EditButton()}
          />
          <GridWrapper>
            <InfoBox title="Details" gridarea="details">
              <div>Type: {task.type}</div>
              <div>Priority: {task.priority}</div>
              <div>Status: {task.status}</div>
            </InfoBox>

            <InfoBox title="Description" gridarea="description">
              <div>{task.description}</div>
            </InfoBox>

            <InfoBox title="Dates" gridarea="dates">
              <div>Created On: {task.createdAt}</div>
              <div>Last Updated: {task.updatedAt}</div>
              <div>Deadline: {task.deadline}</div>
            </InfoBox>

            <InfoBox title="People" gridarea="people">
              <div>Assignee ID: {task.assignedTo}</div>
              <div>Reporter ID: {task.reportedBy}</div>
            </InfoBox>

            <InfoBox title="Comments" gridarea="comments">
              {task.comments
                ? task.comments.map((comment, index) => {
                    return <Comment key={index} comment={comment} />;
                  })
                : null}
            </InfoBox>
          </GridWrapper>
        </>
      )}
      {editingTask ? (
        <TaskDialog
          open={editingTask}
          onClose={handleCloseDialog}
          clearTasksCache={clearTasksCache}
          dialogTask={task}
        />
      ) : null}
    </RootWrapper>
  );
};

export default TaskPage;
