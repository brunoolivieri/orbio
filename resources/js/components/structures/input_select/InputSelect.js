// IMPORTAÇÃO DOS COMPONENTES REACT
import { useEffect, useState} from "react";

// IMPORTAÇÃO DOS COMPONENTES PARA O MATERIAL UI
import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';

// IMPORTAÇÃO DOS COMPONENTES CUSTOMIZADOS
import AxiosApi from "../../../services/AxiosApi";
import { useAuthentication } from "../../context/InternalRoutesAuth/AuthenticationContext";
   
// React Memo para ganho de performance - memoriza o componente enquanto passados os mesmos props
export const InputSelect = React.memo((props) => {

    // Utilizador do state global de autenticação
    const {AuthData, setAuthData} = useAuthentication();

    // State da fonte de dados do select
    const [axiosURL, setAxiosURL] = useState(props.data_source);

    // State do carregamento dos dados do input de select
    const [selectConfig, setSelectionInputData] = useState({status: false, data: {error: {load: false, submit: false}, records: null, default_option: "", label_text: ""}});

    // States utilizados na validação do campo
    const [errorDetected, setErrorDetected] = useState({select: false}); // State para o efeito de erro - true ou false
    const [errorMessage, setErrorMessage] = useState({select: null}); // State para a mensagem do erro - objeto com mensagens para cada campo

    const [selectedItemValue, setSelectedItem] = useState(props.default);
  
    const handleSelectChange = (event) => {

        setSelectedItem(event.target.value);

    };

    useEffect(() => {

        // Comunicação com o backend
        // Para recuperação dos dados que formam o input de seleção de perfis no formulário de registro
        AxiosApi.get(axiosURL, {
          access: AuthData.data.access
          })
          .then(function (response) {

            if(response.status === 200){

                //console.log(response)

              setSelectionInputData({status: true, data: {error: {load: false, submit: false}, records: response.data, default_option: "Escolha uma opção", label_text: "Perfil"}});
    
            }else{
    
              setSelectionInputData({status: true, data: {error: {load: true, submit: false}, default_option: "Erro", label_text: "Perfil"}});
    
            }

          })
          .catch(function (error) {

            setSelectionInputData({status: true, data: {error: {load: true, submit: false}, default_option: "Erro", label_text: "Perfil"}});

        });
      

    },[open]);

    return(

        <>

            {selectConfig.status ?
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
            : ""}
             
        </>

    )

})