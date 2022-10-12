// React
import * as React from 'react';
// Material UI
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
// Custom
import AxiosApi from "../../../services/AxiosApi";

export const SelectStateControl = React.memo((props) => {

    const [loading, setLoading] = React.useState(true);
    const [options, setOptions] = React.useState([]);

    React.useEffect(() => {

        AxiosApi.get(props.data_source)
            .then(function (response) {

                setLoading(false);
                setOptions(response.data);

            })
            .catch(function () {

                setLoading(false);
                setOptions([]);

            });

    }, [open]);

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
                    error={(!loading && options.length == 0) || props.error}
                    disabled={loading}
                >

                    <MenuItem value="0" disabled>{loading ? "Carregando" : "Escolha"}</MenuItem>

                    {!loading &&
                        options.map((item) =>
                            <MenuItem value={item[props.primary_key]} key={item[props.primary_key]}>{item[props.key_content]}</MenuItem>
                        )
                    }

                </Select>
            </FormControl>
        </>
    );
});