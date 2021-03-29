import { styled } from '@material-ui/core';

interface SectionWrapperProps {
  direction: 'column' | 'row';
}

const SectionWrapper = styled('div')((props: SectionWrapperProps) => {
  return {
    display: 'flex',
    flexDirection: props.direction,
  };
});

export default SectionWrapper;
