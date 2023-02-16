import * as React from 'react';
// Material UI
import { MenuItem, FormControl, Select, TextField, FormHelperText } from '@mui/material';
// Custom
import axios from '../../../../../../services/AxiosApi';

export const FetchedStatesSelection = React.memo((props) => {

    const [loading, setLoading] = React.useState(true);
    const [options, setOptions] = React.useState([]);
    const [selected, setSelected] = React.useState();

    React.useEffect(() => {

        let unmounted = false;

        axios.get(props.fetch_from)
            .then(function (response) {
                if (!unmounted) {
                    let options = response.data.map(item => ({
                        id: item["id"],
                        value: item["sigla"]
                    }));
                    setOptions(options);
                    setSelected(props.selected);
                }
            })
            .catch(function () {
                if (!unmounted) {
                    setOptions([]);
                }
            })
            .finally(() => {
                if (!unmounted) {
                    setLoading(false);
                }
            });

        return () => {
            unmounted = true;
        }
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
            <FormControl fullWidth>
                <Select
                    value={selected}
                    onChange={handleChange}
                    name={"state"}
                    error={props.error}
                    disabled={loading}
                >
                    <MenuItem value="0" disabled>Escolha um estado</MenuItem>
                    {options.length > 0 &&
                        options.map((option) =>
                            <MenuItem value={option.value} key={option.id}>{option.value}</MenuItem>
                        )
                    }
                </Select>
                <FormHelperText error>{props.errorMessage}</FormHelperText>
            </FormControl>
        )
    }
});