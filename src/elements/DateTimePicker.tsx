import React from 'react';
import { TextField } from '@material-ui/core';

export interface DateTimeProps {
  value: Date | null;
  setValue: (Date) => void;
  defaultValue?: Date;
}

const DateTimePicker = (props: DateTimeProps): JSX.Element => {
  return (
    <form>
      <TextField
        id="datetime-local"
        label="deadline"
        type="datetime-local"
        defaultValue={props.defaultValue}
        InputLabelProps={{ shrink: true }}
        value={props.value}
        onChange={e => {
          props.setValue(e.target.value);
        }}
      />
    </form>
  );
};

export default DateTimePicker;
