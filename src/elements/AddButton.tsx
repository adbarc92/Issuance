import React from 'react';
import { Add } from '@material-ui/icons';
import { Button } from '@material-ui/core';

interface AddButtonProps {
  title: string;
  handleClick: () => void;
}

const AddButton = (props: AddButtonProps): JSX.Element => {
  return (
    <Button variant="contained" color="primary" onClick={props.handleClick}>
      {props.title}
      <Add />
    </Button>
  );
};

export default AddButton;
