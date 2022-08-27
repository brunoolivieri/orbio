

// React
import * as React from 'react';
// Custom JSON
import cities from "../../../services/brazil_geo_data.json";
// Material UI
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export const SelectCities = React.memo((props) => {

    const [options, setOptions] = React.useState([]);
    const [selected, setSelected] = React.useState(props.controlledInput.city);

    React.useEffect(() => {
        cities.estados.map((state) => {
            // The cities of the selected state are selected
            if (state.sigla == props.controlledInput.state) {
                setOptions(state.cidades);
            }
        });
    }, []);

    const handleSelectChange = (event) => {

        setSelected(event.target.value);
        props.setControlledInput({ ...props.controlledInput, [event.target.name]: event.target.value });
        
    }

    return (
        <>
            <FormControl sx={{ mr: 2 }}>
                <InputLabel id="demo-simple-select-helper-label">Cidade</InputLabel>
                <Select
                    labelId="demo-simple-select-helper-label"
                    value={selected}
                    label={"Cidade"}
                    onChange={handleSelectChange}
                    name={"city"}
                    error={props.fieldError}
                >

                    <MenuItem value="0" disabled>Escolha uma opção</MenuItem>

                    {options.map((city, index) =>
                        <MenuItem value={city} key={index}>{city}</MenuItem>
                    )

                    }

                </Select>

            </FormControl>
        </>
    )

})