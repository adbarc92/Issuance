import React from 'react';
import { TextField } from '@material-ui/core';

const InputComment = (): JSX.Element => {
  return (
    <div>
      <TextField variant="outlined" required multiline></TextField>
    </div>
  );
};

export default InputComment;
