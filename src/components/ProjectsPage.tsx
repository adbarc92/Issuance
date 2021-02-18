import React from 'react';
import PageTitle from 'elements/PageTitle';
import { useGetProjects } from 'hooks/axiosHooks';
import RootWrapper from 'elements/RootWrapper';
import LoadingSpinner from 'elements/LoadingSpinner';
import ProjectDialog from 'components/ProjectDialog';
// import { Project } from 'types/project';
import ProjectCard from 'components/ProjectCard';

// import { useForceUpdate } from 'hooks/render';

import AddButton from 'elements/AddButton';

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

  console.log('Project data:', projectsData);

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
            <div>
              {projectsData.map((project, index) => (
                <ProjectCard project={project} key={index} />
              ))}
            </div>
          ) : (
            <div>No data found! Get to projectin'!</div>
          )}
          <ProjectDialog
            showingDialog={showingDialog}
            hideDialog={hideDialog}
            clearProjectsCache={clearProjectsCache}
          />
        </>
      )}
    </RootWrapper>
  );
};

export default ProjectsPage;
