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
  console.log('props.value:', props.value);
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        margin="normal"
        label="Date picker dialog"
        format="MM/dd/yyyy"
        value={new Date(props.value).toISOString()}
        // value={new Date('2014-08-18T21:11:54')}
        onChange={props.onChange}
        KeyboardButtonProps={{
          'aria-label': 'change date',
        }}
      />
    </MuiPickersUtilsProvider>
  );
};

export default DateTimePicker;
