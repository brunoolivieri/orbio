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
import { Tooltip } from '@mui/material';

// IMPORTAÇÃO DOS COMPONENTES CUSTOMIZADOS
import { useAuthentication } from '../../../../context/InternalRoutesAuth/AuthenticationContext';
import { FormValidation } from '../../../../../utils/FormValidation';
import { GenericSelect } from '../../../input_select/GenericSelect';
import AxiosApi from '../../../../../services/AxiosApi';

// IMPORTAÇÃO DOS ÍCONES DO FONTS AWESOME
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';

export const UpdateUserFormulary = React.memo(({...props}) => {

// ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

    // Utilizador do state global de autenticação
    const {AuthData} = useAuthentication();

    // States do formulário
    const [open, setOpen] = React.useState(false);

    // States utilizados nas validações dos campos 
    const [errorDetected, setErrorDetected] = useState({email: false, name: false, profile: false, status: false}); 
    const [errorMessage, setErrorMessage] = useState({email: null, name: null, profile: null, status: null}); 

    // State da mensagem do alerta
    const [displayAlert, setDisplayAlert] = useState({display: false, type: "", message: ""});

    // State da acessibilidade do botão de executar o registro
    const [disabledButton, setDisabledButton] = useState(false);

// ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

    // Função para abrir o modal
    const handleClickOpen = () => {
        if(props.selected_record.dom != null){
            setOpen(true);
        }
    };

    // Função para fechar o modal
    const handleClose = () => {

      setErrorDetected({email: false, name: false, profile: false, status: false});
      setErrorMessage({email: null, name: null, profile: null, status: null});
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
  
        const data = new FormData(event.currentTarget);
  
        if(dataValidate(data)){

            setDisabledButton(true);

            requestServerOperation(data);

        }
  
    }

    function dataValidate(formData){

      const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

      const emailValidate = FormValidation(formData.get("email_input"), null, null, emailPattern, "EMAIL");
      const nameValidate = FormValidation(formData.get("name_input"), 3, null, null, null);
      const profileValidate = Number(formData.get("select_profile")) === 0 ? {error: true, message: "Selecione um perfil"} : {error: false, message: ""};
      const statusValidate = Number(formData.get("status_input")) != 0 && Number(formData.get("status_input")) != 1 ? {error: true, message: "O status deve ser 1 ou 0"} : {error: false, message: ""}; 

      setErrorDetected({email: emailValidate.error, name: nameValidate.error, profile: profileValidate.error, status: statusValidate.error});
      setErrorMessage({email: emailValidate.message, name: nameValidate.message, profile: profileValidate.message, status: statusValidate.message});

      if(emailValidate.error === true || nameValidate.error === true || profileValidate.error || statusValidate.error){

          return false;

      }else{

          return true;

      }

    }

    function requestServerOperation(data){

        // Dados para o middleware de autenticação
        let logged_user_id = AuthData.data.id; 
        let module_id = 1; 
        let action = "escrever"; 

        AxiosApi.patch(`/api/admin-module-user/${data.get("user_id")}`, {
            auth: `${logged_user_id}.${module_id}.${action}`,
            name: data.get("name_input"),
            email: data.get("email_input"),
            status: data.get("status_input"),
            profile_id: data.get("select_profile")
        })
        .then((response) => {

            successServerResponseTreatment();  

        })
        .catch((error) => {
            
            errorServerResponseTreatment(error.response.data);

        });

    }

    function successServerResponseTreatment(){

      setDisplayAlert({display: true, type: "success", message: "Operação realizada com sucesso!"});

      setTimeout(() => {

        setDisabledButton(false);

        handleClose();

      }, 2000);

    }

    function errorServerResponseTreatment(response_data){

      setDisabledButton(false);

      let error_message = (response_data.message != "" && response_data.message != undefined) ? response_data.message : "Houve um erro na realização da operação!";
      setDisplayAlert({display: true, type: "error", message: error_message});

       // Definição dos objetos de erro possíveis de serem retornados pelo validation do Laravel
      let input_errors = {
        email: {error: false, message: null},
        name: {error: false, message: null},
        profile_id: {error: false, message: null},
        status: {error: false, message: null},
      }

      // Coleta dos objetos de erro existentes na response
      for(let prop in response_data.errors){

        input_errors[prop] = {
          error: true, 
          message: response_data.errors[prop][0]
        }

      }

      setErrorDetected({
        email: input_errors.email.error, 
        name: input_errors.name.error, 
        profile: input_errors.profile_id.error, 
        status: input_errors.status.error
      });

      setErrorMessage({
        email: input_errors.email.message, 
        name: input_errors.name.message, 
        profile: input_errors.profile_id.message, 
        status: input_errors.status.message
      });

    }

    // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

  return (
    <>

      <Tooltip title="Editar">
          <IconButton disabled={AuthData.data.user_powers["1"].profile_powers.ler == 1 ? false : true} onClick={handleClickOpen}>
              <FontAwesomeIcon icon={faPenToSquare} color={AuthData.data.user_powers["1"].profile_powers.ler == 1 ? "green" : "#808991"} size = "sm"/>
          </IconButton>
      </Tooltip>

    {(props.selected_record.dom != null && open) && 

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>ATUALIZAÇÃO | USUÁRIO (ID: {props.selected_record.data_cells.user_id})</DialogTitle>

        {/* Formulário da criação/registro do usuário - Componente Box do tipo "form" */}
        <Box component="form" noValidate onSubmit={handleSubmitOperation} >

          <DialogContent>
            
            <TextField
              margin="dense"
              id="user_id"
              name="user_id"
              label="ID"
              type="email"
              fullWidth
              variant="outlined"
              defaultValue={props.selected_record.data_cells.user_id}
              inputProps={{
                readOnly: true
            }}
            />
            <TextField
              margin="dense"
              id="name_input"
              name="name_input"
              label="Nome completo"
              fullWidth
              variant="outlined"
              defaultValue={props.selected_record.data_cells.name}
              helperText = {errorMessage.name}
              error = {errorDetected.name}
            />
            <TextField
              margin="dense"
              id="email_input"
              name="email_input"
              label="Endereço de email"
              type="email"
              fullWidth
              variant="outlined"
              defaultValue={props.selected_record.data_cells.email} 
              helperText = {errorMessage.email}
              error = {errorDetected.email}
            />

            <TextField
              margin="dense"
              id="status_input"
              name="status_input"
              label="Status da conta"
              type="number"
              fullWidth
              variant="outlined"
              defaultValue={props.selected_record.data_cells.status}
              helperText = {errorMessage.status}
              error = {errorDetected.status}
              InputProps={{
                inputProps: { min: 0, max: 1 }
                }}
            />

            <GenericSelect 
            label_text = {"Perfil"} 
            data_source = {"/api/admin-module-user/create?auth=none"} 
            primary_key={"id"} 
            key_content={"nome"} 
            error = {errorDetected.profile} 
            default = {props.selected_record.data_cells.access} 
            name = {"select_profile"} 
            />

          </DialogContent>

          {displayAlert.display && 
              <Alert severity={displayAlert.type}>{displayAlert.message}</Alert> 
          }
          
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={disabledButton} variant="contained">Confirmar atualização</Button>
          </DialogActions>

        </Box>
  
      </Dialog>
      }
    </>
  );

});