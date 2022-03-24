// IMPORTAÇÃO DOS COMPONENTES REACT
import { useState, useEffect } from 'react';
import * as React from 'react';

// IMPORTAÇÃO DOS COMPONENTES MATERIALUI
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Input, Tooltip } from '@mui/material';
import { IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import { Alert } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { DateTimeInput } from '../../date_picker/DateTimeInput';

// IMPORTAÇÃO DOS COMPONENTES CUSTOMIZADOS
import AxiosApi from '../../../../services/AxiosApi';
import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';
import { FormValidation } from '../../../../utils/FormValidation';

// IMPORTAÇÃO DE BIBLIOTECAS EXTERNAS
import moment from 'moment';

export function CreateIncidentFormulary(){

    // Utilizador do state global de autenticação
    const {AuthData, setAuthData} = useAuthentication();

    // States utilizados nas validações dos campos 
    const [errorDetected, setErrorDetected] = useState({incident_date: false, incident_type: false, incident_note: false}); 
    const [errorMessage, setErrorMessage] = useState({incident_date: "", incident_type: "", incident_note: ""}); 

    // State da mensagem do alerta
    const [displayAlert, setDisplayAlert] = useState({display: false, type: "", message: ""});

    // State da acessibilidade do botão de executar o registro
    const [disabledButton, setDisabledButton] = useState(false);

    // States do formulário
    const [open, setOpen] = React.useState(false);

    // States dos inputs de data
    const [incidentDate, setIncidentDate] = useState(moment());

    // Função para abrir o modal
    const handleClickOpen = () => {
        setOpen(true);
    };

    // Função para fechar o modal
    const handleClose = () => {

        setErrorDetected({incident_date: false, incident_type: false, incident_note: false});
        setErrorMessage({incident_date: "", incident_type: "", incident_note: ""});
        setDisplayAlert({display: false, type: "", message: ""});
        setDisabledButton(false);

        setOpen(false);

    };

    /*
    * Rotina 1
    * Ponto inicial do processamento do envio do formulário de registro
    * Recebe os dados do formulário, e transforma em um objeto da classe FormData
    */ 
    function handleRegistrationSubmit(event){
        event.preventDefault();
  
        const data = new FormData(event.currentTarget);
  
          if(dataValidate(data)){
  
            setDisabledButton(true);

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
    * Comunicação AJAX com o Laravel utilizando AXIOS
    * Após o recebimento da resposta, é chamada próxima rotina, 4, de tratamento da resposta do servidor
    */
    function requestServerOperation(data){

    // Dados para o middleware de autenticação 
    let logged_user_id = AuthData.data.id;
    let module_id = 5;
    let module_action = "escrever";

    AxiosApi.post(`/api/incidents-module`, {
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

    }

    /*
    * Rotina 5
    * Tratamento da resposta do servidor
    * Se for um sucesso, aparece, mo modal, um alerta com a mensagem de sucesso, e o novo registro na tabela de usuários
    */
    function serverResponseTreatment(response){

    if(response.status === 200){

        setDisplayAlert({display: true, type: "success", message: "Cadastro realizado com sucesso!"});

        setTimeout(() => {
        
        setDisabledButton(false);
        
        handleClose();

        }, 2000);

    }else{

        setDisplayAlert({display: true, type: "error", message: "Erro! Tente novamente."});

        setDisabledButton(false);

    }

    }
    
    return(
        <>
        {/* Botão para abrir o formulário */}
        <Tooltip title="Nova Ordem">
            <IconButton onClick={handleClickOpen} disabled={AuthData.data.user_powers["4"].profile_powers.escrever == 1 ? false : true}>
              <AddCircleIcon />
            </IconButton>
          </Tooltip>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>CADASTRO DE INCIDENTE</DialogTitle>
    
            {/* Formulário da criação/registro do usuário - Componente Box do tipo "form" */}
            <Box component="form" noValidate onSubmit={handleRegistrationSubmit} >
    
              <DialogContent>
            
                <DialogContentText sx={{mb: 3}}>
                  Formulário para criação de um registro de incidente.
                </DialogContentText>

                <Box sx={{display: "flex", justifyContent: "space-between"}}>
                  <DateTimeInput 
                    event = {setIncidentDate}
                    label = {"Data do incidente"} 
                    helperText = {errorMessage.incident_date} 
                    error = {errorDetected.incident_date} 
                    defaultValue = {moment()}
                    operation = {"create"}
                    />
                </Box>

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
                />
                  
              </DialogContent>
    
              {displayAlert.display && 
                  <Alert severity={displayAlert.type}>{displayAlert.message}</Alert> 
              }
    
              <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button type="submit" disabled={disabledButton}>Criar incidente</Button>
              </DialogActions>
    
            </Box>
          
          </Dialog>
        
        </>
    )
    
}