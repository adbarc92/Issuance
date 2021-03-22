import React from 'react';
import { ClientTask } from 'types/task';
import { ClientComment } from 'types/comment';

import { useGetTask } from 'hooks/axiosHooks';

import TaskDialog from 'components/TaskDialog';
import InputComment from 'components/InputComment';

import LoadingSpinner from 'elements/LoadingSpinner';
import PageTitle from 'elements/PageTitle';
import RootWrapper from 'elements/RootWrapper';
import PageWrapper from 'elements/PageWrapper';
import SectionWrapper from 'elements/SectionWrapper';
import InfoBox from 'elements/InfoBox';

import { Edit } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';

import Comments from 'components/Comment';

export interface TaskPageProps {
  taskId: string;
  personId: string;
}

const TaskPage = (props: TaskPageProps): JSX.Element => {
  const { personId } = props;

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

  const task = data as ClientTask;

  console.log('task:', task);

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
          <PageWrapper>
            <SectionWrapper>
              <InfoBox title="Details">
                <div>Type: {task.type}</div>
                <div>Priority: {task.priority}</div>
                <div>Status: {task.status}</div>
              </InfoBox>
              <InfoBox title="People">
                <div>Assignee ID: {task.assignedTo}</div>
                <div>Reporter ID: {task.reportedBy}</div>
              </InfoBox>
            </SectionWrapper>
            <SectionWrapper>
              <InfoBox title="Description">{task.description}</InfoBox>
              <InfoBox title="Dates">
                <div>Created On: {task.createdAt}</div>
                <div>Last Updated: {task.updatedAt}</div>
                <div>Deadline: {task.deadline}</div>
              </InfoBox>
            </SectionWrapper>
            <SectionWrapper>
              <InfoBox title="Comments">
                {data?.comments ? (
                  <Comments comments={data.comments as ClientComment[]} />
                ) : null}
                <InputComment
                  headerCommentId={null}
                  taskId={task.id}
                  personId={personId}
                />
              </InfoBox>
            </SectionWrapper>
          </PageWrapper>
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
