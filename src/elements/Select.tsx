import React from 'react';

import {
  InputLabel,
  MenuItem,
  FormControl,
  Select as MuiSelect,
} from '@material-ui/core';

export interface SelectItem<T> {
  label: string;
  value: T;
}

export interface SelectProps<T> {
  items: SelectItem<T>[];
  value: T;
  onChange: (e: any) => void;
  title: string;
  fullWidth?: boolean;
}

const Select = function <T>(props: SelectProps<T>): JSX.Element {
  return (
    <div>
      <InputLabel>{props.title}</InputLabel>
      <MuiSelect
        fullWidth={props.fullWidth}
        value={props.value}
        onChange={props.onChange}
      >
        {props.items.map((item, index) => {
          return (
            <MenuItem value={item.value as any} key={index}>
              {item.label}
            </MenuItem>
          );
        })}
      </MuiSelect>
    </div>
  );
};

export default Select;
