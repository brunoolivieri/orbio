// React
import * as React from 'react';
// Material UI
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
// Custom JSON
import brazil_cities from "../../../services/brazil_geo_data.json";

export const SelectStates = React.memo((props) => {

    const [selectedItemValue, setSelectedItem] = React.useState(props.default != null ? props.default : "0");

    // State do carregamento dos dados do input de select
    const [selectData] = React.useState({ status: false, data: brazil_cities.estados });

    const handleSelectChange = (event) => {

        setSelectedItem(event.target.value);
        props.save_necessary_setter(true);
        props.state_input_setter(event.target.value);

    };

    return (

        <>
            <FormControl sx={{ mr: 2 }}>
                <InputLabel id="demo-simple-select-helper-label">Estado</InputLabel>
                <Select
                    labelId="demo-simple-select-helper-label"
                    id={"select_state_input"}
                    value={selectedItemValue}
                    label={"Estado"}
                    onChange={handleSelectChange}
                    name={"select_state_input"}
                    error={props.error}
                    disabled={!props.edit_mode}
                >
                    <MenuItem value={0} disabled>Escolha uma opção</MenuItem>

                    {
                        selectData.data.map((row, index) =>

                            // O valor de cada item é igual à sigla do estado para que possa haver a correspondência com o AuthContext
                            // O valor do estado regional no context é a sua sigla
                            <MenuItem value={row.sigla} key={index}>{row.sigla}</MenuItem>

                        )
                    }

                </Select>
            </FormControl>
        </>

    )

});