import React from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  InputLabel,
  MenuItem,
  FormHelperText,
  FormControl,
  Select,
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      marginLeft: 0,
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  })
);

const BasedSelect = () => {
  const classes = useStyles();
  const [role, setRole] = React.useState('');

  const handleChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setRole(e.target.value as string);
  };

  return (
    <div>
      <FormControl className={classes.formControl}>
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
