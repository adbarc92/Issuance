import React from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { InputLabel, MenuItem, FormControl, Select } from '@material-ui/core';
import { PersonnelRole } from 'types/personnel';

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
  value: PersonnelRole;
}

const UserSelect = (props: SelectProps): JSX.Element => {
  const classes = useStyles();

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel>Role</InputLabel>
        <Select value={props.value} onChange={props.onChange}>
          <MenuItem value={PersonnelRole.BOSS}>Boss</MenuItem>
          <MenuItem value={PersonnelRole.MIDDLER}>Middler</MenuItem>
          <MenuItem value={PersonnelRole.GRUNT}>Grunt</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default UserSelect;
