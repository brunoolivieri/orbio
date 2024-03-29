import * as React from 'react';
import { TextField, FormHelperText } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker as DatePickerMui } from '@mui/x-date-pickers/DatePicker';

export function DatePicker(props) {

  const [value, setValue] = React.useState(new Date(props.value));

  const handleChange = (value) => {
    setValue(value);
    props.setFormData({ ...props.formData, [props.name]: value });
  }

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePickerMui
          label={props.label}
          value={value}
          onChange={(value) => handleChange(value)}
          inputFormat="dd/MM/yyyy"
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
      <FormHelperText error>{props.errorMessage}</FormHelperText>
    </>
  );
}
