

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

    const [selectedOption, setSelectedOption] = React.useState(props.default != null ? props.default : "0");
    const [options, setOptions] = React.useState([]);

    React.useEffect(() => {
        cities.estados.map((state) => {
            // The cities of the selected state are selected
            if (state.sigla == props.selectedState) {
                setOptions(state.cidades);
            }
        });
    }, [props.selectedState]);

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
        props.setControlledInput({ ...props.controlledInput, [event.target.name]: event.target.value });
    }

    return (
        <>
            <FormControl sx={{ mr: 2 }}>
                <InputLabel id="demo-simple-select-helper-label">Cidade</InputLabel>
                <Select
                    labelId="demo-simple-select-helper-label"
                    value={selectedOption}
                    label={"Cidade"}
                    onChange={handleSelectChange}
                    name={"city"}
                    error={props.fieldError}
                    disabled={props.selectedState != null ? false : true}
                >

                    <MenuItem value={0} disabled>Escolha uma opção</MenuItem>

                    {options.map((city, index) =>

                        <MenuItem value={city} key={index}>{city}</MenuItem>

                    )

                    }

                </Select>

            </FormControl>
        </>
    )

})