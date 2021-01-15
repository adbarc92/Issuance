import { styled } from '@material-ui/core';
import { Link } from 'react-router-dom';

const LinkLessText = styled(Link)(() => {
  return {
    color: '#FFF',
    textDecorationLine: 'none',
  };
});

export default LinkLessText;
