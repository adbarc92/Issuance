import React from 'react';

import {
  InputLabel,
  MenuItem,
  FormHelperText,
  FormControl,
  Select,
} from '@material-ui/core';

const BasedSelect = () => {
  const [role, setRole] = React.useState('');

  const handleChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setRole(e.target.value as string);
  };

  return (
    <div>
      <FormControl>
        <InputLabel>Role</InputLabel>
        <Select onChange={handleChange}>
          <MenuItem value={'Boss'}>Boss</MenuItem>
          <MenuItem value={'Middler'}>Middler</MenuItem>
          <MenuItem value={'Grunt'}>Grunt</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default BasedSelect;
