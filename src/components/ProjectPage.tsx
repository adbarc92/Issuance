// Todo: Refactor to remove GridInfoBox

import React from 'react';
import { Project } from 'types/project';

import { List, ListItem, IconButton } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import { Link } from 'react-router-dom';

import InfoBox from 'elements/GridInfoBox';
import GridWrapper from 'elements/GridWrapper';
import PageTitle from 'elements/PageTitle';
import RootWrapper from 'elements/RootWrapper';
import LoadingSpinner from 'elements/LoadingSpinner';

import { useGetProjectById } from 'hooks/axiosHooks';

import ProjectDialog from 'components/ProjectDialog';

interface ProjectPageProps {
  projectId: string;
}

const ProjectPage = (props: ProjectPageProps): JSX.Element => {
  const {
    loading,
    data,
    error,
    clearCache: clearProjectCache,
  } = useGetProjectById(props.projectId);

  const [editingProject, setEditingProject] = React.useState(false);

  const handleOpenDialog = () => {
    setEditingProject(true);
  };

  const handleCloseDialog = () => {
    setEditingProject(false);
  };

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

  if (error) {
    return <div>{error}</div>;
  }

  const project = data as Project;

  return (
    <RootWrapper>
      {loading ? (
        <LoadingSpinner />
      ) : project ? (
        <>
          <PageTitle
            title={`Project: ${project?.title}`}
            subtitle={String(project?.id)}
            headerElem={EditButton()}
          />
          <GridWrapper>
            <InfoBox title="Details">
              <div>{project?.description}</div>
              <div>{project?.deadline}</div>
            </InfoBox>
            <InfoBox title="Tasks">
              <List>
                {project?.tasks.map((task, index) => {
                  return (
                    <ListItem key={index}>
                      <Link to={`/tasks/${task.id}`}>{task.name}</Link>
                    </ListItem>
                  );
                })}
              </List>
            </InfoBox>
          </GridWrapper>
        </>
      ) : null}
      {editingProject ? (
        <ProjectDialog
          project={project}
          showingDialog={editingProject}
          hideDialog={handleCloseDialog}
          clearProjectsCache={clearProjectCache}
        />
      ) : null}
    </RootWrapper>
  );
};

export default ProjectPage;
