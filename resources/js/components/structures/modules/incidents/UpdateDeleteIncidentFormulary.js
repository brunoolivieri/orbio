// IMPORTAÇÃO DOS COMPONENTES REACT
import { useState, useEffect } from 'react';
import * as React from 'react';

// IMPORTAÇÃO DOS COMPONENTES MATERIALUI
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import { Alert } from '@mui/material';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

// IMPORTAÇÃO DOS COMPONENTES CUSTOMIZADOS
import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';
import { FormValidation } from '../../../../utils/FormValidation';
import AxiosApi from '../../../../services/AxiosApi';
import { DateTimeInput } from '../../date_picker/DateTimeInput';

import moment from 'moment';

export function UpdateDeleteIncidentFormulary({data, operation, refresh_setter}){

    // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

    // Utilizador do state global de autenticação
    const {AuthData, setAuthData} = useAuthentication();

    // States do formulário
    const [open, setOpen] = useState(false);

    // State da operação a ser realizada
    const [formOperation, setOperation] = useState(operation);

    // States utilizados nas validações dos campos 
    const [errorDetected, setErrorDetected] = useState({order_start_date: false, order_end_date: false, numOS: false, creator_name: false, pilot_name: false, client_name: false, order_note: false}); 
    const [errorMessage, setErrorMessage] = useState({order_start_date: "", order_end_date: "", numOS: "", creator_name: "", pilot_name: "", client_name: "", order_note: ""}); 

    // State da mensagem do alerta
    const [displayAlert, setDisplayAlert] = useState({display: false, type: "", message: ""});

    // State da acessibilidade do botão de executar o registro
    const [disabledButton, setDisabledButton] = useState(false);

    // States dos inputs de data
    const [incidentDate, setIncidentDate] = useState(data.incident_date);

    // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

    // Função para abrir o modal
    const handleClickOpen = () => {
        setOpen(true);
    };

    // Função para fechar o modal
    const handleClose = () => {

      setErrorDetected({order_start_date: false, order_end_date: false, numOS: false, creator_name: false, pilot_name: false, client_name: false, order_note: false});
      setErrorMessage({order_start_date: "", order_end_date: "", numOS: "", creator_name: "", pilot_name: "", client_name: "", order_note: ""});
      setDisplayAlert({display: false, type: "", message: ""});
      setDisabledButton(false);

      setOpen(false);

    };

     /*
    * Rotina 1
    * Captura do envio do formulário
    * 
    */ 
    const handleSubmitOperation = (event) => {
      event.preventDefault();

      // Instância da classe JS FormData - para trabalhar os dados do formulário
      const data = new FormData(event.currentTarget);

      if(operation === "update"){

        // Validação dos dados do formulário
        // A comunicação com o backend só é realizada se o retorno for true
        if(dataValidate(data)){

            // Botão é desabilitado
            setDisabledButton(true);

            // Inicialização da requisição para o servidor
            requestServerOperation(data);

        }

      }else if(operation === "delete"){

          setDisabledButton(true);

         // Inicialização da requisição para o servidor
         requestServerOperation(data, operation);

      }

    }

     /*
    * Rotina 2
    * Validação dos dados no frontend
    * Recebe o objeto da classe FormData criado na rotina 1
    * Se a validação não falhar, a próxima rotina, 3, é a da comunicação com o Laravel 
    */
     function dataValidate(formData){

       // Se o atributo "erro" for true, um erro foi detectado, e o atributo "message" terá a mensagem sobre a natureza do erro
       const incidentDateValidate = startDate != null ? {error: false, message: ""} : {error: true, message: "Selecione a data inicial"};
       const incidentTypeValidate = FormValidation(formData.get("order_numos"), 3, null, null, null);
       const incidentNoteValidate = FormValidation(formData.get("creator_name"), 3, null, null, null);
 
       // Atualização dos estados responsáveis por manipular os inputs
       setErrorDetected({incident_date: incidentDateValidate.error, incident_type: incidentTypeValidate.error, incident_note: incidentNoteValidate.error});
       setErrorMessage({incident_date: incidentDateValidate.message, incident_type: incidentTypeValidate.message, incident_note: incidentNoteValidate.message});
    
      if(incidentDateValidate.error || incidentTypeValidate.error || incidentNoteValidate.error){

        return false;

      }else{

          return true;

      }

    }

     /*
    * Rotina 4
    * Realização da requisição AXIOS
    * Possui dois casos: o Update e o Delete
    * 
    */ 
    function requestServerOperation(data){

      // Dados para o middleware de autenticação 
        let logged_user_id = AuthData.data.id;
        let module_id = 5;
        let module_action = "escrever";

      if(operation === "update"){

        AxiosApi.patch(`/api/incidents-module/update`, {
            auth: `${logged_user_id}.${module_id}.${module_action}`,
            incident_date: moment(incidentDate).format('YYYY-MM-DD hh:mm:ss'),
            incident_type: data.get("incident_type"),
            incident_note: data.get("incident_note"),
        })
        .then(function (response) {
  
            serverResponseTreatment(response);
  
        })
        .catch(function (error) {
          
          serverResponseTreatment(error.response);
  
        });

      }else if(operation === "delete"){

        AxiosApi.delete(`/api/incidents-module/${data.get("incident_id")}?auth=${logged_user_id}.${module_id}.${module_action}`)
        .then(function (response) {
  
            serverResponseTreatment(response);
  
        })
        .catch(function (error) {
          
          serverResponseTreatment(error.response);
  
        });

      }

    }

     /*
    * Rotina 5
    * Tratamento da resposta da requisição AXIOS
    * Possui dois casos: o Update e o Delete
    * 
    */
    function serverResponseTreatment(response){

      if(response.status === 200){

        if(operation === "update"){

          refresh_setter(true);

          setDisplayAlert({display: true, type: "success", message: "Atualização realizada com sucesso!"});

        }else{

          refresh_setter(true);

          setDisplayAlert({display: true, type: "success", message: "Deleção realizada com sucesso!"});

        }

        setTimeout(() => {

          setDisabledButton(false);

          handleClose();

        }, 2000);

      }else{

        setDisabledButton(false);

        setDisplayAlert({display: true, type: "error", message: "Erro! Tente novamente."});

      }

    }

    // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

    // Se o perfil do usuário logado não tiver o poder de LER quanto ao módulo de "Administração", os botão serão desabilitados - porque o usuário não terá permissão para isso 
    // Ou, se o registro atual, da tabela, tiver um número de acesso menor (quanto menor, maior o poder) ou igual ao do usuário logado, os botão serão desabilitados - Super Admin não edita Super Admin, Admin não edita Admin, etc 
    const deleteButton = <IconButton 
    disabled={AuthData.data.user_powers["5"].profile_powers.escrever == 1 ? (data.access <= AuthData.data.general_access ? true : false) : true} 
    value = {data.id} onClick={handleClickOpen}
    ><DeleteIcon 
    style={{ fill: AuthData.data.user_powers["5"].profile_powers.escrever == 1 ? (data.access <= AuthData.data.general_access ? "#808991" : "#D4353B") : "#808991"}} 
    /></IconButton>

    const updateButton = <IconButton 
    disabled={AuthData.data.user_powers["5"].profile_powers.escrever == 1 ? false : true} 
    value = {data.id} onClick={handleClickOpen}
    ><EditIcon 
    style={{ fill: AuthData.data.user_powers["5"].profile_powers.escrever == 1 ? (data.access <= AuthData.data.general_access ? "#808991" : "#009BE5") : "#808991"}} 
    /></IconButton>

    return(
        <>
        {/* Botão que abre o Modal - pode ser o de atualização ou de deleção, depende da operação */}
        {operation === "update" ? updateButton : deleteButton}
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{operation === "update" ? "ATUALIZAÇÃO" : "DELEÇÃO"} | INCIDENTE (ID: {data.incident_id})</DialogTitle>
    
            {/* Formulário da criação/registro do usuário - Componente Box do tipo "form" */}
            <Box component="form" noValidate onSubmit={handleSubmitOperation} >
    
              <DialogContent>

              <Box sx={{display: "flex", justifyContent: "space-between"}}>
                  <DateTimeInput 
                    event = {setIncidentDate}
                    label = {"Data do incidente"} 
                    helperText = {errorMessage.incident_date} 
                    error = {errorDetected.incident_date} 
                    defaultValue = {data.incident_date}
                    operation = {"create"}
                    />
                </Box>

                <TextField
                  type = "text"
                  margin="dense"
                  label="ID do incidente"
                  fullWidth
                  variant="outlined"
                  required
                  id="incident_id"
                  name="incident_id"
                  InputProps={{
                    readOnly: true 
                  }}
                  defaultValue = {data.incident_id}
                />

                <TextField
                  type = "text"
                  margin="dense"
                  label="Tipo do incidente"
                  fullWidth
                  variant="outlined"
                  required
                  id="incident_type"
                  name="incident_type"
                  helperText = {errorMessage.incident_type}
                  error = {errorDetected.incident_type}
                  defaultValue = {data.incident_type}
                  InputProps={{
                    readOnly: operation == "delete" ? true : false
                  }}
                />

                <TextField
                  type = "text"
                  margin="dense"
                  label="Descrição"
                  fullWidth
                  variant="outlined"
                  required
                  id="incident_note"
                  name="incident_note"
                  helperText = {errorMessage.incident_note}
                  error = {errorDetected.incident_note}
                  defaultValue = {data.description}
                  InputProps={{
                    readOnly: operation == "delete" ? true : false
                  }}
                />
                  
              </DialogContent>
    
              {displayAlert.display && 
                  <Alert severity={displayAlert.type}>{displayAlert.message}</Alert> 
              }
              
              <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button type="submit" disabled={disabledButton}>Confirmar {operation === "update" ? "atualização" : "deleção"}</Button>
              </DialogActions>
    
            </Box>
    
            
          </Dialog>
        </>
    )
    
}