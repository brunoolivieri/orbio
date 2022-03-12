import * as React from 'react';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';

import moment from 'moment';

export function DateTimeInput({...props}) {

  console.log(props.defaultValue)

  const [value, setValue] = React.useState(new Date(props.defaultValue));

  function updateDateValue(newValue){

    setValue(newValue);
    props.event(newValue);

  }

  return (
    <>
     <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateTimePicker
        renderInput={(props) => <TextField {...props} />}
        label={props.label}
        value={value}
        onChange={(newValue) => {updateDateValue(newValue)}}
        inputFormat="dd/MM/yyyy hh:mm"
        readOnly = {props.operation == "delete" ? true : false}
      />
      </LocalizationProvider>
    </>
      
  );
}