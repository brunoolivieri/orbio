import * as React from 'react';
// Material UI
import { InputLabel, MenuItem, FormControl, Select, TextField, FormHelperText } from '@mui/material';
// Custom
import axios from "../../../services/AxiosApi";

export const FetchedDataSelection = React.memo((props) => {

    const [loading, setLoading] = React.useState(true);
    const [options, setOptions] = React.useState([]);
    const [selected, setSelected] = React.useState(props.selected);

    React.useEffect(() => {
        axios.get(props.fetch_from)
            .then(function (response) {
                setOptions(response.data);
            })
            .catch(function () {
                setOptions([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    function handleChange(event) {
        setSelected(event.target.value);
        props.handleChange(event);
    }

    if (loading) {
        return <TextField fullWidth disabled value={'Carregando...'} />
    }

    if (!loading) {
        return (
            <>
                {!loading &&
                    <FormControl fullWidth sx={{ mt: 1 }}>
                        <InputLabel>{props.label_text}</InputLabel>
                        <Select
                            id={props.name}
                            value={selected}
                            label={props.label_text}
                            onChange={handleChange}
                            name={props.name}
                            error={(options.length == 0) || props.error}
                            disabled={loading}
                        >
                            <MenuItem value="0" disabled>Escolha</MenuItem>
                            {options.length > 0 &&
                                options.map((item) =>
                                    <MenuItem value={item[props.primary_key]} key={item[props.primary_key]}>{item[props.key_content]}</MenuItem>
                                )
                            }
                        </Select>
                        <FormHelperText error>{props.errorMessage}</FormHelperText>
                    </FormControl>
                }

            </>
        );
    }
});