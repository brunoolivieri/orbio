import * as React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDateFns } from '@mui/x-date-pickers-pro/AdapterDateFns';
import { MobileDateRangePicker } from '@mui/x-date-pickers-pro/MobileDateRangePicker';

export default function ResponsiveDateRangePicker(props) {

    const [value, setValue] = React.useState([new Date(props.default_start), new Date(props.default_end)]);

    const handleChange = (new_value) => {

        setValue(new_value);
        props.event(new_value);

    }

    return (
        <>
            <LocalizationProvider
                dateAdapter={AdapterDateFns}
                localeText={{ start: props.start_label, end: props.end_label }}
            >
                <MobileDateRangePicker
                    value={value}
                    onChange={(new_value) => handleChange(new_value)}
                    renderInput={(startProps, endProps) => (
                        <React.Fragment>
                            <TextField {...startProps} />
                            <Box sx={{ mx: 2 }}> to </Box>
                            <TextField {...endProps} />
                        </React.Fragment>
                    )}
                />
            </LocalizationProvider>
        </>

    );
}
