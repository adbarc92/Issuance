import React from 'react';
import 'date-fns';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

export interface DateTimeProps {
  value: string;
  onChange: (date: Date | null, value?: string | null | undefined) => void;
}

const DateTimePicker = (props: DateTimeProps): JSX.Element => {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        margin="normal"
        label="Date picker dialog"
        format="MM/dd/yyyy"
        value={new Date(props.value).toISOString()}
        onChange={props.onChange}
        KeyboardButtonProps={{
          'aria-label': 'change date',
        }}
      />
    </MuiPickersUtilsProvider>
  );
};

export default DateTimePicker;
