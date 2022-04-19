// IMPORTAÇÃO DOS COMPONENTES REACT
import { useEffect, useState, memo} from "react";

// IMPORTAÇÃO DOS COMPONENTES PARA O MATERIAL UI
import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

// IMPORTAÇÃO DOS COMPONENTES CUSTOMIZADOS
import AxiosApi from "../../../services/AxiosApi";
import { useAuthentication } from "../../context/InternalRoutesAuth/AuthenticationContext";
   
// React Memo para ganho de performance - memoriza o componente enquanto passados os mesmos props
export const GenericSelect = memo(({...props}) => {

    // Utilizador do state global de autenticação
    const {AuthData} = useAuthentication();

    // State da fonte de dados do select
    const [axiosURL] = useState(props.data_source);

    // State do carregamento dos dados do input de select
    const [selectOptions, setSelectOptions] = useState({status: false, data: {error: {load: false, submit: false}, records: null, default_option: "Carregando", label_text: props.label_text}});

    // States utilizados na validação do campo
    const [errorDetected, setErrorDetected] = useState({select: false}); // State para o efeito de erro - true ou false
    const [errorMessage, setErrorMessage] = useState({select: null}); // State para a mensagem do erro - objeto com mensagens para cada campo

    const [selectedOption, setSelectedOption] = useState(props.default);
  
    const handleSelectChange = (event) => {

        setSelectedOption(event.target.value);

    };

    useEffect(() => {

            // Comunicação com o backend
            // Para recuperação dos dados que formam o input de seleção de perfis no formulário de registro
            AxiosApi.get(axiosURL, {
                access: AuthData.data.access
                })
                .then(function (response) {
    
                if(response.status === 200){

                    console.log(response.data)
    
                    setSelectOptions({status: true, data: {error: {load: false, submit: false}, records: response.data, default_option: "Escolha uma opção", label_text: props.label_text}});

                }else{
        
                    setSelectOptions({status: true, data: {error: {load: true, submit: false}, default_option: "Erro", label_text: props.label_text}});
        
                }
    
                })
                .catch(function (error) {
    
                    setSelectOptions({status: true, data: {error: {load: true, submit: false}, default_option: "Erro", label_text: "Perfil"}});
    
            });

    },[open]);

    return(

        <>

            {selectOptions.status ?
                <FormControl sx={{ margin: "5px 5px 0 0", minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-helper-label">{selectOptions.data.label_text}</InputLabel>
                    <Select
                    labelId="demo-simple-select-helper-label"
                    id={props.name}
                    value={selectedOption}
                    label={selectOptions.data.label_text}
                    onChange={handleSelectChange}
                    name={props.name}
                    error = {selectOptions.data.error.load || selectOptions.data.error.submit || props.error ? true : false}
                    disabled={selectOptions.data.error.load || props.disabled ? true : false}
                    >

                    <MenuItem value={0} disabled>{selectOptions.data.default_option}</MenuItem>

                       {!selectOptions.data.error.load && 

                            selectOptions.data.records.map((row) => 
                                
                                <MenuItem value={row[props.primary_key]} key={row[props.primary_key]}>{row[props.key_content]}</MenuItem> 

                            )     
                        
                        }
                    
                    </Select>

                </FormControl>
            : ""}
             
        </>

    )

});