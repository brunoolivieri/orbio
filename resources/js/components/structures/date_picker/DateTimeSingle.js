import * as React from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

export const DateTimeSingle = React.memo((props) => {

    const [value, setValue] = React.useState(new Date(props.defaultValue));

    React.useEffect(() => {
        props.event(value);
    }, []);

    const handleChange = (newValue) => {

        setValue(newValue);
        props.event(newValue);

    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
                renderInput={(props) => <TextField {...props} />}
                label={props.label}
                value={value}
                onChange={(newValue) => { handleChange(newValue) }}
                inputFormat="dd/MM/yyyy hh:mm"
                readOnly={props.read_only}
            />
        </LocalizationProvider>
    );
});
