// React
import * as React from 'react';
// Material UI
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export const SelectExternalData = React.memo((props) => {

    const [options, setOptions] = React.useState(props.options);

    React.useEffect(() => {
        setOptions(props.options);
    });

    const handleChange = (event) => {
        props.setter(event.target.value);
    }

    return (
        <>
            <FormControl sx={{ minWidth: '100%' }}>
                <InputLabel>{props.label_text}</InputLabel>

                <Select
                    id={props.name}
                    value={props.value}
                    label={props.label_text}
                    onChange={handleChange}
                    name={props.name}
                    error={props.error}
                    disabled={options.length === 0}
                >

                    <MenuItem value="0" disabled>{"Escolha"}</MenuItem>

                    {options.length > 0 &&
                        options.map((item) =>
                            <MenuItem value={item[props.primary_key]} key={item[props.primary_key]}>{item[props.key_content]}</MenuItem>
                        )
                    }

                </Select>
            </FormControl>
        </>
    );
});