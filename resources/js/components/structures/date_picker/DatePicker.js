import * as React from 'react';

import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker as DatePickerMui } from '@mui/x-date-pickers/DatePicker';

export function DatePicker(props) {
  const [value, setValue] = React.useState(props.value);

  function handleChange(value) {
    setValue(value);
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePickerMui
        label={props.label}
        value={value}
        onChange={(value) => handleChange(value)}
        renderInput={(params) => <TextField {...params} />}

      />
    </LocalizationProvider>
  );
}
