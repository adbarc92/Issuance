import React from 'react';
import { styled } from '@material-ui/core';

const TitleWrapper = styled('div')(() => {
  return {
    padding: '0.5rem',
    fontSize: '3rem',
    margin: '0',
  };
});

const SubtitleWrapper = styled('div')(() => {
  return {
    display: 'flex',
    justifyContent: 'flex-end',
    marginRight: '1%',
    marginBottom: '0.5rem',
    fontSize: '1rem',
  };
});

const HeaderElemWrapper = styled('div')(() => {
  return {
    display: 'flex',
    justifyContent: 'flex-end',
    marginRight: '1%',
    marginBottom: '0.5rem',
    fontSize: '1rem',
  };
});

interface TitleProps {
  title: string;
  subtitle?: string;
  headerElem?: JSX.Element;
}

const PageTitle = (props: TitleProps): JSX.Element => {
  return (
    <>
      <TitleWrapper>{props.title}</TitleWrapper>
      {props.subtitle ? (
        <SubtitleWrapper>{props.subtitle}</SubtitleWrapper>
      ) : null}
      {props.headerElem ? (
        <HeaderElemWrapper>{props.headerElem}</HeaderElemWrapper>
      ) : null}
    </>
  );
};

export default PageTitle;
