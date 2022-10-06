import * as React from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

export const DateTimeSingle = React.memo((props) => {

    const [value, setValue] = React.useState(new Date(props.value));

    const handleChange = (value) => {

        setValue(value);
        props.setControlledInput({ ...props.controlledInput, [props.name]: value });

    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
                renderInput={(props) => <TextField {...props} />}
                label={props.label}
                value={value}
                onChange={(value) => { handleChange(value) }}
                inputFormat="dd/MM/yyyy hh:mm"
                readOnly={props.read_only}
            />
        </LocalizationProvider>
    );
});
