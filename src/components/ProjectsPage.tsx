import React from 'react';
import PageTitle from 'elements/PageTitle';
import { useGetProjects } from 'hooks/axiosHooks';
import RootWrapper from 'elements/RootWrapper';
import LoadingSpinner from 'elements/LoadingSpinner';
import ProjectDialog from 'components/ProjectDialog';
import ProjectCard from 'components/ProjectCard';
import { styled } from '@material-ui/core';

import AddButton from 'elements/AddButton';

const GridContainer = styled('div')(() => {
  return {
    display: 'flex',
    flexWrap: 'wrap',
  };
});

const ProjectsPage = (): JSX.Element => {
  const {
    loading: projectsLoading,
    data: projectsData,
    error: projectsError,
    clearCache: clearProjectsCache,
  } = useGetProjects();

  const [showingDialog, setShowingDialog] = React.useState(false);

  if (projectsError) {
    return <div>{projectsError}</div>;
  }

  const displayDialog = () => {
    setShowingDialog(true);
  };

  const hideDialog = () => {
    setShowingDialog(false);
  };

  return (
    <RootWrapper>
      {projectsLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <PageTitle
            title={'Projects'}
            headerElem={
              <AddButton
                title={'Create New Project'}
                handleClick={displayDialog}
              />
            }
          />
          {projectsData && projectsData.length ? (
            <GridContainer>
              {projectsData.map((project, index) => (
                <ProjectCard project={project} key={index} />
              ))}
            </GridContainer>
          ) : (
            <div>No data found! Get to projectin'!</div>
          )}
          {showingDialog ? (
            <ProjectDialog
              project={null}
              showingDialog={showingDialog}
              hideDialog={hideDialog}
              clearProjectsCache={clearProjectsCache}
            />
          ) : null}
        </>
      )}
    </RootWrapper>
  );
};

export default ProjectsPage;
