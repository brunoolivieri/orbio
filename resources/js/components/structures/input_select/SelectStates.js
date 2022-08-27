// React
import * as React from 'react';
// Material UI
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
// Custom JSON
import cities from "../../../services/brazil_geo_data.json";

export const SelectStates = React.memo((props) => {

    const [selected, setSelected] = React.useState(props.controlledInput.state);

    const handleSelectChange = (event) => {

        setSelected(event.target.value);
        props.setControlledInput({ ...props.controlledInput, [event.target.name]: event.target.value });

        console.log(selected)
        console.log(props.controlledInput.state)

        if (selected != "0") {
            props.setControlledInput({ ...props.controlledInput, ["city"]: "0" });
        }

    }

    return (

        <>
            <FormControl sx={{ mr: 2 }}>
                <InputLabel id="demo-simple-select-helper-label">Estado</InputLabel>

                <Select
                    labelId="demo-simple-select-helper-label"
                    value={selected}
                    label={"Estado"}
                    onChange={handleSelectChange}
                    name={"state"}
                    error={props.fieldError}
                >

                    <MenuItem value="0" disabled>Escolha uma opção</MenuItem>

                    {
                        cities.estados.map((row, index) =>
                            <MenuItem value={row.sigla} key={index}>{row.sigla}</MenuItem>
                        )
                    }

                </Select>

            </FormControl>
        </>

    )

});