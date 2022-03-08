

import brazil_cities from "../../../services/brazil_geo_data.json";

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { useState, useEffect } from "react";

export function SelectCities(props){

    useEffect(() => {

        brazil_cities.estados.map((row) => {

            // Se o estado já escolhido for igual ao da estrutura de dados
            if(row.sigla == props.choosen_state){

                // As cidades do estado escolhido são recuperadas
                setSelectionData({status: true, data: row.cidades});

            }

        })

    },[props.choosen_state])
 
    const [selectedItemValue, setSelectedItem] = useState(props.default != null ? props.default : "0");

    // State do carregamento dos dados do input de select
    const [selectData, setSelectionData] = useState({status: false, data: []});

    const handleSelectChange = (event) => {

        setSelectedItem(event.target.value);
        props.state_input_setter(event.target.value);

    };

    return (
        <>
            <FormControl sx={{mr: 2}}>
                <InputLabel id="demo-simple-select-helper-label">Cidade</InputLabel>
                <Select
                labelId="demo-simple-select-helper-label"
                id={"select_city_input"}
                value={selectedItemValue}
                label={"Cidade"}
                onChange={handleSelectChange}
                name={"select_city_input"}
                error = {props.error}
                disabled={props.edit_mode == false ? true : (props.choosen_state != null ? false : true)}
                >

                <MenuItem value={0} disabled>Escolha uma opção</MenuItem>

                    {selectData.status && 

                        selectData.data.map((element, index) => 
                                                                    
                        <MenuItem value={element} key={index}>{element}</MenuItem>

                        )

                    }
                    
                </Select>

            </FormControl>
        </>
    )
    
}