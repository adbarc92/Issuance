import React from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { InputProps as StandardInputProps } from '@material-ui/core/Input/index';
import {
  InputLabel,
  MenuItem,
  FormHelperText,
  FormControl,
  Select,
} from '@material-ui/core';
import { UserRole } from 'types/user';

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
  value: UserRole;
}

const UserSelect = (props: SelectProps): JSX.Element => {
  const classes = useStyles();
  // const { onChange } = props;
  // const [role, setRole] = React.useState('');

  // const handleChange = (e: React.ChangeEvent<{ value: unknown }>) => {
  //   setRole(e.target.value as string);
  // };

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel>Role</InputLabel>
        <Select value={props.value} onChange={props.onChange}>
          <MenuItem value={UserRole.BOSS}>Boss</MenuItem>
          <MenuItem value={UserRole.MIDDLER}>Middler</MenuItem>
          <MenuItem value={UserRole.GRUNT}>Grunt</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default UserSelect;
