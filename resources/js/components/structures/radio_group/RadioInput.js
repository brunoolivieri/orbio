import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export const RadioInput = React.memo(({ ...props }) => {

    return (
        <FormControl>
            <FormLabel>{props.title}</FormLabel>
            <RadioGroup
                row
                name={props.name}
                defaultValue={props.default_value}
            >
                {props.options.map((item, index) =>
                    <FormControlLabel value={item.value} control={<Radio />} label={item.label} key={index} />
                )}
            </RadioGroup>
        </FormControl>
    );
});
