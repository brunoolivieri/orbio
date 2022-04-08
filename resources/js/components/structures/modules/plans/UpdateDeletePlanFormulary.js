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
import { GenericSelect } from '../../input_select/GenericSelect';

export const UpdateDeletePlanFormulary = React.memo(({data, operation, refresh_setter}) => {

// ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

    // Utilizador do state global de autenticação
    const {AuthData, setAuthData} = useAuthentication();

    // States do formulário
    const [open, setOpen] = useState(false);

    // States utilizados nas validações dos campos 
    const [errorDetected, setErrorDetected] = useState({description: false, status: false}); // State para o efeito de erro - true ou false
    const [errorMessage, setErrorMessage] = useState({description: "", status: ""}); // State para a mensagem do erro - objeto com mensagens para cada campo

    // State da mensagem do alerta
    const [displayAlert, setDisplayAlert] = useState({display: false, type: "", message: ""});

    // State da acessibilidade do botão de executar o registro
    const [disabledButton, setDisabledButton] = useState(false);

     // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

    // Função para abrir o modal
    const handleClickOpen = () => {
        setOpen(true);
    };

    // Função para fechar o modal
    const handleClose = () => {

      setErrorDetected({status: false, description: false});
      setErrorMessage({status: "", description: ""});
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

      const logPattern = "";

      // Se o atributo "erro" for true, um erro foi detectado, e o atributo "message" terá a mensagem sobre a natureza do erro
      const descriptionValidate = FormValidation(formData.get("description"), 3, null, null, null);
      const statusValidate = (formData.get("status") == 0 || formData.get("status") == 1) ? {error: false, message: ""} : {error: true, message: "O status deve ser 1 ou 0"};
     
      setErrorDetected({description: descriptionValidate.error, status: statusValidate.error});
      setErrorMessage({description: descriptionValidate.message, status: statusValidate.message});
      
      if(descriptionValidate.error || statusValidate.error){

        return false;

      }else{

          return true;

      }

    }

     /*
    * Rotina 3
    * Realização da requisição AXIOS
    * Possui dois casos: o Update e o Delete
    * 
    */ 
    function requestServerOperation(data){

      // Dados para o middleware de autenticação 
      let logged_user_id = AuthData.data.id;
      let module_id = 2;
      let module_action = "escrever";

      if(operation === "update"){

        AxiosApi.patch(`/api/plans-module/${data.get("plan_id")}`, {
          auth: `${logged_user_id}.${module_id}.${module_action}`,
          report_id: data.get("select_report"),
          incident_id: data.get("select_incident"),
          status: data.get("status"),
          description: data.get("description"),
        })
        .then(function (response) {
  
          successServerResponseTreatment();
  
        })
        .catch(function (error) {
          
          errorServerResponseTreatment(error.response.data);
  
        });

      }else if(operation === "delete"){

        AxiosApi.delete(`/api/plans-module/${data.get("plan_id")}?auth=${logged_user_id}.${module_id}.${module_action}`)
        .then(function (response) {
  
          successServerResponseTreatment();
  
        })
        .catch(function (error) {
          
          errorServerResponseTreatment(error.response.data);
  
        });

      }

    }

    /*
    * Rotina 4A
    * Tratamento da resposta de uma requisição bem sucedida
    */
    function successServerResponseTreatment(){

      setDisplayAlert({display: true, type: "success", message: "Operação realizada com sucesso!"});

      setTimeout(() => {

        setDisabledButton(false);

        handleClose();

      }, 2000);

    }

    /*
    * Rotina 4B
    * Tratamento da resposta de uma requisição falha
    */
    function errorServerResponseTreatment(response_data){

      let error_message = (response_data.message != "" && response_data.message != undefined) ? response_data.message : "Houve um erro na realização da operação!";
      setDisplayAlert({display: true, type: "error", message: error_message});

      let input_errors = {
        report_id: {error: false, message: null},
        incident_id: {error: false, message: null},
        status: {error: false, message: null},
        description: {error: false, message: null}
      }

      for(let prop in response_data.errors){

        input_errors[prop] = {
          error: true, 
          message: ""
        }

      }

      setErrorDetected({
        report: input_errors.report_id.error, 
        incident: input_errors.incident_id.error, 
        status: input_errors.status.error, 
        description: input_errors.description.error
      });

      setErrorMessage({
        report: input_errors.report_id.message, 
        incident: input_errors.incident_id.message, 
        status: input_errors.status.message, 
        description: input_errors.description.message
      });

    }

// ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

    // Se o perfil do usuário logado não tiver o poder de LER quanto ao módulo de "Planos", os botão serão desabilitados - porque o usuário não terá permissão para isso 
    const deleteButton = <IconButton 
    disabled={AuthData.data.user_powers["2"].profile_powers.escrever == 1 ? (data.access <= AuthData.data.general_access ? true : false) : true} 
    value = {data.id} onClick={handleClickOpen}
    ><DeleteIcon 
    style={{ fill: AuthData.data.user_powers["2"].profile_powers.escrever == 1 ? (data.access <= AuthData.data.general_access ? "#808991" : "#D4353B") : "#808991"}} 
    /></IconButton>

    const updateButton = <IconButton 
    disabled={AuthData.data.user_powers["2"].profile_powers.escrever == 1 ? false : true} 
    value = {data.id} onClick={handleClickOpen}
    ><EditIcon 
    style={{ fill: AuthData.data.user_powers["2"].profile_powers.escrever == 1 ? (data.access <= AuthData.data.general_access ? "#808991" : "#009BE5") : "#808991"}} 
    /></IconButton>

// ============================================================================== ESTRUTURAÇÃO DA PÁGINA - COMPONENTES DO MATERIAL UI ============================================================================== //

  return (
    <div>

      {/* Botão que abre o Modal - pode ser o de atualização ou de deleção, depende da operação */}
      {operation === "update" ? updateButton : deleteButton}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{operation === "update" ? "ATUALIZAÇÃO" : "DELEÇÃO"} | PLANO DE VÔO (ID: {data.plan_id})</DialogTitle>

        {/* Formulário da criação/registro do usuário - Componente Box do tipo "form" */}
        <Box component="form" noValidate onSubmit={handleSubmitOperation} >

          <DialogContent>

            <TextField
              margin="dense"
              id="plan_id"
              name="plan_id"
              label="ID do plano"
              type="text"
              fullWidth
              variant="outlined"
              defaultValue={data.plan_id}
              disabled = {operation === "update" ? false : true} 
            />

            <Box>
              <GenericSelect 
              label_text = {"Relatório"} 
              data_source = {"/api/plans-module/create?data_source=reports&auth=none"} 
              primary_key={"id"} 
              key_content={"id"} 
              error = {null} 
              default = {data.report_id != null ? data.report_id : 0} 
              name = {"select_report"}  
              disabled = {operation === "update" ? false : true} 
              />
              <GenericSelect 
              label_text = {"Incidente"} 
              data_source = {"/api/plans-module/create?data_source=incidents&auth=none"} 
              primary_key={"id"} 
              key_content={"id"} 
              error = {null} 
              default = {data.incident_id != null ? data.incident_id : 0} 
              name = {"select_incident"} 
              disabled = {operation === "update" ? false : true} 
              />
            </Box>

            <TextField
              margin="dense"
              id="status"
              name="status"
              label="Status do plano"
              type="number"
              fullWidth
              variant="outlined"
              defaultValue={data.plan_status}
              error = {errorDetected.status}
              helperText = {errorMessage.status}
              InputProps={{
                  inputProps: { min: 0, max: 1 }
              }}
              disabled = {operation === "update" ? false : true}
            />

            <TextField
              margin="dense"
              id="description"
              name="description"
              label="Descrição"
              type="text"
              fullWidth
              variant="outlined"
              defaultValue={data.plan_description}
              disabled = {operation == "delete" ? true : false}
              helperText = {errorMessage.description}
              error = {errorDetected.description}
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
    </div>

  );

});