import { GetBrazilStatesAndCities } from "../../../services/GetBrazilStatesAndCities";

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { useState, useEffect } from "react";

export function SelectStates(props){

    const [selectedItemValue, setSelectedItem] = useState(props.default != null ? props.default : "0");

    // State do carregamento dos dados do input de select
    const [selectData, setSelectionData] = useState({status: false, data: GetBrazilStatesAndCities("GET_STATES")});

    const handleSelectChange = (event) => {

        setSelectedItem(event.target.value);

    };

    return(

        <>
            <FormControl sx={{ mt: 3, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-helper-label">Estado</InputLabel>
                <Select
                labelId="demo-simple-select-helper-label"
                id={"select_item_input"}
                value={selectedItemValue}
                label={"Estado"}
                onChange={handleSelectChange}
                name={"select_item_input"}
                error = {false}
                disabled={false}
                >

                <MenuItem value={0} disabled>Escolha uma opção</MenuItem>

                    {
                    selectData.data.map((row, index) => 
                                            
                        <MenuItem value={row.sigla} key={index}>{row.sigla}</MenuItem>

                    )
                    }
                    
                </Select>

            </FormControl>     
        </>

    )
    
}