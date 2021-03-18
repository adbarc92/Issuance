import React from 'react';

import { styled } from '@material-ui/core';

import theme, { colors } from 'theme';

interface InfoBoxProps {
  title: string;
  children?: any;
  gridarea?: string;
}

interface InfoBoxWrapperProps {
  gridarea?: string;
}

const InfoBoxHeader = styled('div')(() => {
  return {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    padding: '0.25rem 0',
    margin: '0.25rem 0',
    borderBottom: `2px solid ${theme.palette.primary.main}`,
  };
});

const InfoBoxWrapper = styled('div')((props: InfoBoxWrapperProps) => {
  return {
    gridArea: props.gridarea,
    border: `2px solid ${colors.grey}`,
    borderRadius: '4px',
    padding: '0.5rem',
    margin: '1rem',
    position: 'static',
  };
});

const InfoBox = (props: InfoBoxProps): JSX.Element => {
  return (
    <InfoBoxWrapper gridarea={props.gridarea}>
      <InfoBoxHeader>{props.title}</InfoBoxHeader>
      {props.children}
    </InfoBoxWrapper>
  );
};

export default InfoBox;
