import React from 'react';
import { styled } from '@material-ui/core';

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

interface TitleProps {
  title: string;
  projectId?: number;
}

const PageTitle = (props: TitleProps): JSX.Element => {
  return (
    <TitleWrapper>
      {props.projectId ? <ProjectLabel>{props.projectId}</ProjectLabel> : null}
      <TitleHeader>{props.title}</TitleHeader>
    </TitleWrapper>
  );
};

export default PageTitle;
