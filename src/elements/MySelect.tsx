import React from 'react';

import { InputLabel, MenuItem, FormControl, Select } from '@material-ui/core';

export interface SelectProps {
  keys: string[];
  values: string[];
  onChange: (e: any) => void;
  value: any;
  title: string;
}

const MySelect = (props: SelectProps): JSX.Element => {
  return (
    <>
      <FormControl>
        <InputLabel>{props.title}</InputLabel>
        <Select value={props.value} onChange={props.onChange}>
          {props.keys.map((option, index) => {
            return (
              <MenuItem value={option} key={index}>
                {props.values[index]}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </>
  );
};

export default MySelect;
