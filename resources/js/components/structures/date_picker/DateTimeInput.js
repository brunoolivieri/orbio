import * as React from 'react';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';

export function DateTimeInput({...props}) {

  const [value, setValue] = React.useState(new Date());

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
      />
      </LocalizationProvider>
    </>
      
  );
}