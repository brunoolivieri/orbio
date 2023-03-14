import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export const ToggleRadio = React.memo((props) => {

    const [value, setValue] = React.useState(props.value);

    function handleChange(event) {
        setValue(event.target.value);
        props.setFormData(prev => {
            return {
                ...prev,
                [event.target.name]: event.target.value
            }
        });
    }

    return (
        <FormControl>
            <FormLabel>{props.title}</FormLabel>
            <RadioGroup
                row
                name={props.name}
                onChange={handleChange}
                value={value}
            >
                <FormControlLabel value={"0"} control={<Radio />} label={props.label[0]} />
                <FormControlLabel value={"1"} control={<Radio />} label={props.label[1]} />
            </RadioGroup>
        </FormControl>
    );
});
