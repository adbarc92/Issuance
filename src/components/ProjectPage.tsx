import React from 'react';
import { Project } from 'types/project';

import { List, ListItem } from '@material-ui/core';
import { Link } from 'react-router-dom';

import InfoBox from 'elements/InfoBox';
import GridWrapper from 'elements/GridWrapper';
import PageTitle from 'elements/PageTitle';
import RootWrapper from 'elements/RootWrapper';
import LoadingSpinner from 'elements/LoadingSpinner';

import { useGetProjectById } from 'hooks/axiosHooks';

interface ProjectPageProps {
  projectId: string;
}

const ProjectPage = (props: ProjectPageProps): JSX.Element => {
  const { loading, data, error } = useGetProjectById(props.projectId);

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
          />
          <GridWrapper>
            <InfoBox title="Details">
              <div>{project?.description}</div>
              <div>{project?.deadline}</div>
            </InfoBox>
            {/* <InfoBox title="Personnel">
              <List>
                {project?.personnel?.map((person, index) => {
                  return (
                    <ListItem key={index}>
                      <Link to={`/personnel/${person.id}`}>
                        {person.userEmail}
                      </Link>
                    </ListItem>
                  );
                })}
              </List>
            </InfoBox> */}
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
    </RootWrapper>
  );
};

export default ProjectPage;
