import React from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { InputLabel, MenuItem, FormControl, Select } from '@material-ui/core';
import { PersonRole } from 'types/person';

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

interface SelectProps {
  onChange: (e: any) => void;
  value: PersonRole;
}

const UserSelect = (props: SelectProps): JSX.Element => {
  const classes = useStyles();

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel>Role</InputLabel>
        <Select value={props.value} onChange={props.onChange}>
          <MenuItem value={PersonRole.BOSS}>Boss</MenuItem>
          <MenuItem value={PersonRole.MIDDLER}>Middler</MenuItem>
          <MenuItem value={PersonRole.GRUNT}>Grunt</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default UserSelect;
