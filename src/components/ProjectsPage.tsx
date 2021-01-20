import React from 'react';
import PageTitle from 'elements/PageTitle';
import { useGetProjects } from 'hooks/axiosHooks';
import RootWrapper from 'elements/RootWrapper';
import LoadingSpinner from 'elements/LoadingSpinner';

const ProjectsPage = (): JSX.Element => {
  const { loading, data: projectData, error } = useGetProjects();

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <RootWrapper>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <PageTitle title={'Projects'} />
          {projectData ? (
            <div>ProjectData: {projectData}</div>
          ) : (
            <div>No data found! Get to projectin'!</div>
          )}
        </>
      )}
    </RootWrapper>
  );
};

export default ProjectsPage;
