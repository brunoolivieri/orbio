import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import AxiosApi from '../../../services/AxiosApi';

export function AutoCompleteCity(props) {

    const [source] = React.useState(props.source);
    const [options, setOptions] = React.useState([]);

    React.useEffect(() => {

        AxiosApi.get(source)
            .then(function (response) {

                const data = response.data;

                let options = data.map(item => ({
                    id: item[props.primary_key],
                    label: item[props.key_text]
                }));

                setOptions(options);

            })
            .catch(function (error) {

                console.log(error);
                setOptions([]);

            });

    }, [open]);

    const handleChange = (event, value) => {
        props.setSelectedCity(value.label);
    }

    return (
        <>

            < Autocomplete
                disablePortal
                id={props.name}
                options={options}
                sx={{ width: '100%' }}
                onChange={(event, value) => handleChange(event, value)}
                name={props.name}
                renderInput={(params) => <TextField {...params} label={props.label} />}
            />

        </>
    );
}
