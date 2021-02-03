import React from 'react';
import PageTitle from 'elements/PageTitle';
import { useGetProjects } from 'hooks/axiosHooks';
import RootWrapper from 'elements/RootWrapper';
import LoadingSpinner from 'elements/LoadingSpinner';
import ProjectDialog from 'components/ProjectDialog';

import AddButton from 'elements/AddButton';

const ProjectsPage = (): JSX.Element => {
  const { loading, data: projectData, error } = useGetProjects();

  const [showingDialog, setShowingDialog] = React.useState(false);

  if (error) {
    return <div>{error}</div>;
  }

  const displayDialog = () => {
    // console.log('Anddddd open!');
    setShowingDialog(true);
  };

  const hideDialog = () => {
    setShowingDialog(false);
  };

  return (
    <RootWrapper>
      {loading ? (
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
          {projectData ? (
            <div>ProjectData: {projectData}</div>
          ) : (
            <div>No data found! Get to projectin'!</div>
          )}
          {showingDialog ? (
            <ProjectDialog
              showingDialog={showingDialog}
              hideDialog={hideDialog}
            />
          ) : null}
        </>
      )}
    </RootWrapper>
  );
};

export default ProjectsPage;
