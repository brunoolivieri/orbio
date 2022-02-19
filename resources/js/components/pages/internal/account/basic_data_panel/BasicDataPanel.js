// IMPORTAÇÃO DOS COMPONENTES PARA O MATERIAL UI
import { Tooltip } from '@mui/material';
import { IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import RefreshIcon from '@mui/icons-material/Refresh';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import { Box } from '@mui/system';
import EditIcon from '@mui/icons-material/Edit';
import { Alert } from '@mui/material';

import AxiosApi from "../../../../../services/AxiosApi";

import { FormValidation } from '../../../../../services/FormValidation';

import { useState, useEffect } from 'react';

export function BasicDataPanel(props){

// ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

    // States referentes ao formulário
    const [editMode, setEditMode] = useState(false);
    const [saveNecessary, setSaveNecessary] = useState(false);

    // States de validação dos campos
    const [errorDetected, setErrorDetected] = useState({name: false, email: false}); // State para o efeito de erro - true ou false
    const [errorMessage, setErrorMessage] = useState({name: null, email: null}); // State para a mensagem do erro - objeto com mensagens para cada campo

    // State da mensagem do alerta
    const [displayAlert, setDisplayAlert] = useState({display: false, type: "", message: ""});

// ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

    function enableFieldsEdition(){

        setEditMode(!editMode);

    }

    function enableSaveButton(){

        setSaveNecessary(true);

    }

    function reloadFormulary(){

        props.reload_setter(!props.reload_state);

    }

    /*
    * Rotina 1
    * Ponto inicial do processamento do envio do formulário 
    * Recebe os dados do formulário, e transforma em um objeto da classe FormData
    * A próxima rotina, 2, validará esses dados
    */ 
    function handleSubmitForm(event){
        event.preventDefault();

        // Instância da classe JS FormData - para trabalhar os dados do formulário
        const data = new FormData(event.currentTarget);

        // Validação dos dados do formulário
        // A comunicação com o backend só é realizada se o retorno for true
        if(dataValidate(data)){
  
            // Inicialização da requisição para o servidor
            requestServerOperation(data);
  
        }

    }

    /*
    * Rotina 2
    * Validação dos dados no frontend
    * Recebe o objeto da classe FormData criado na rotina 1
    * Se a validação não falhar, a próxima rotina, 3, é a da comunicação com o Laravel 
    */
    function dataValidate(formData){

        // Padrão de um email válido
        const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        // Validação dos dados - true para presença de erro e false para ausência
        // O valor final é um objeto com dois atributos: "erro" e "message"
        // Se o atributo "erro" for true, um erro foi detectado, e o atributo "message" terá a mensagem sobre a natureza do erro
        const nameValidate = FormValidation(formData.get("user_fullname"), 3, null, null, null);
        const emailValidate = FormValidation(formData.get("user_email"), null, null, emailPattern, "EMAIL");
  
        // Atualização dos estados responsáveis por manipular os inputs
        setErrorDetected({name: nameValidate.error, email: emailValidate.error});
        setErrorMessage({name: nameValidate.message, email: emailValidate.message});
        
        // Se o nome ou acesso estiverem errados
        if(nameValidate.error || emailValidate.error){
  
          return false;
  
        }else{
  
            return true;
  
        }
  
      }

      /*
    * Rotina 3
    * Comunicação AJAX com o Laravel utilizando AXIOS
    * Após o recebimento da resposta, é chamada próxima rotina, 4, de tratamento da resposta do servidor
    */
    function requestServerOperation(data){

        AxiosApi.post("/api/user-update-data?panel=basic_data", {
          id: props.userid,
          email: data.get("user_email"),
          name: data.get("user_fullname")
        })
        .then(function (response) {
  
            // Tratamento da resposta do servidor
            serverResponseTreatment(response);
  
        })
        .catch(function (error) {
          
          // Tratamento da resposta do servidor
          serverResponseTreatment(error.response);
  
        });
  
      }

      /*
    * Rotina 4
    * Tratamento da resposta do servidor
    * Se for um sucesso, aparece, mo modal, um alerta com a mensagem de sucesso, e o novo registro na tabela de usuários
    */
    function serverResponseTreatment(response){

        if(response.status === 200){
   
           // Alerta sucesso
           setDisplayAlert({display: true, type: "success", message: "Dados atualizados com sucesso!"});

           // Recarregar os dados do usuário
           props.reload_setter(!props.reload_state);

           // Desabilitar modo de edição
           setEditMode(false);
   
         }else{
   
           if(response.data.error === "email_already_exists"){
   
             // Atualização do input
             setErrorDetected({name: false, email: true});
             setErrorMessage({name: null, email: "Esse email já existe"});
   
             // Alerta erro
             setDisplayAlert({display: true, type: "error", message: "O email informado já está cadastrado no sistema"});
   
             // Habilitar botão de envio
             setDisabledButton(false);
   
           }else{
   
             // Alerta
             setDisplayAlert({display: true, type: "error", message: "Erro! Tente novamente."});
   
             // Habilitar botão de envio
             setDisabledButton(false);
   
           } 
   
         }
   
       }

// ============================================================================== ESTRUTURAÇÃO DA PÁGINA - COMPONENTES DO MATERIAL UI ============================================================================== //

    return(
        <>
        <Grid container spacing={1} alignItems="center">

            {saveNecessary && <Grid item>
                <Tooltip title="Salvar Alterações">
                    <IconButton form = "user_account_basic_form" type="submit">
                        <PublishedWithChangesIcon />         
                    </IconButton>
                </Tooltip>  
            </Grid>}

            <Grid item>
                <Tooltip title="Habilitar Edição">
                    <IconButton onClick = {enableFieldsEdition}>
                        <EditIcon />         
                    </IconButton>
                </Tooltip>  
            </Grid>

            <Grid item>
                <Tooltip title="Reload">
                    <IconButton onClick = {reloadFormulary}>
                    {/* O recarregamento dos dados é a alteração do valor das dependências do useEffect que realiza uma requisição AXIOS */}
                    <RefreshIcon color="inherit" sx={{ display: 'block' }} />         
                    </IconButton>
                </Tooltip>  
            </Grid>

        </Grid>

        {displayAlert.display && 
            <Alert severity={displayAlert.type}>{displayAlert.message}</Alert> 
        } 
       
        <Box component="form" id = "user_account_basic_form" noValidate onSubmit={handleSubmitForm} sx={{ mt: 2 }} >

            <Grid container spacing={5}>
        
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="user_fullname"
                        name="user_fullname"
                        label="Nome completo"
                        fullWidth
                        variant="outlined"
                        defaultValue={props.name}
                        helperText = {errorMessage.name}
                        error = {errorDetected.name}
                        onChange={enableSaveButton}
                        InputProps={{
                            readOnly: !editMode,
                        }}
                        focused={editMode}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="user_email"
                        name="user_email"
                        label="Email"
                        fullWidth
                        variant="outlined"
                        defaultValue={props.email}
                        helperText = {errorMessage.email}
                        error = {errorDetected.email}
                        onChange={enableSaveButton}
                        InputProps={{
                            readOnly: !editMode,
                        }}
                        focused={editMode}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="profile_type"
                        name="profile_type"
                        label="Perfil de usuário"
                        fullWidth
                        variant="outlined"
                        defaultValue={props.profile}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="user_last_access"
                        name="user_last_access"
                        label="Data do último acesso"
                        fullWidth
                        variant="outlined"
                        defaultValue={props.last_access}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="user_last_update"
                        name="user_last_update"
                        label="Data da última atualização"
                        fullWidth
                        defaultValue={props.last_update}
                        variant="outlined"
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Grid>
                
            </Grid>

        </Box> 
        </>
    );
  
}