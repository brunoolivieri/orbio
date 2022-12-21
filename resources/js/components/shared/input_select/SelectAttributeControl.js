import * as React from 'react';
// Material UI
import { InputLabel, MenuItem, FormControl, Select, TextField } from '@mui/material';
// Custom
import axios from "../../../services/AxiosApi";

export const SelectAttributeControl = React.memo((props) => {

    const [loading, setLoading] = React.useState(true);
    const [options, setOptions] = React.useState([]);

    React.useEffect(() => {

        axios.get(props.data_source)
            .then(function (response) {
                setOptions(response.data);
            })
            .catch(function () {
                setOptions([]);
            })
            .finally(() => {
                setLoading(false);
            });

    }, [open]);

    function handleChange(event) {
        props.setControlledInput({ ...props.controlledInput, [event.target.name]: event.target.value });
    }

    return (
        <>
            {!loading &&
                <FormControl fullWidth sx={{ mt: 1 }}>
                    <InputLabel>{props.label_text}</InputLabel>

                    <Select
                        id={props.name}
                        value={props.value}
                        label={props.label_text}
                        onChange={handleChange}
                        name={props.name}
                        error={(options.length == 0) || props.error}
                        disabled={loading}
                    >

                        <MenuItem value="0" disabled>{loading ? "Carregando" : "Escolha"}</MenuItem>

                        {options.length > 0 &&
                            options.map((item) =>
                                <MenuItem value={item[props.primary_key]} key={item[props.primary_key]}>{item[props.key_content]}</MenuItem>
                            )
                        }

                    </Select>
                </FormControl>
            }

            {loading && <TextField fullWidth disabled value={'Loading...'} />}

        </>
    );
});