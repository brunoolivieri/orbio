

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export function SelectCities(props){


    return (
        <>
            <FormControl sx={{ mt: 3, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-helper-label">{selectConfig.data.label_text}</InputLabel>
                <Select
                labelId="demo-simple-select-helper-label"
                id={"select_item_input"}
                value={selectedItemValue}
                label={selectConfig.data.label_text}
                onChange={handleSelectChange}
                name={"select_item_input"}
                error = {selectConfig.data.error.load || selectConfig.data.error.submit || props.error ? true : false}
                disabled={selectConfig.data.error.load || props.disabled ? true : false}
                >

                <MenuItem value={0} disabled>{selectConfig.data.default_option}</MenuItem>

                    {!selectConfig.data.error.load && 

                        selectConfig.data.records.map((row) => 
                                                
                            <MenuItem value={row.id} key={row.id}>{row.nome}</MenuItem>

                        )     
                    
                    }     
                
                </Select>

            </FormControl>
        </>
    );

}