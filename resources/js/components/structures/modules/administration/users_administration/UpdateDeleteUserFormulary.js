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
import { useAuthentication } from '../../../../context/InternalRoutesAuth/AuthenticationContext';
import { FormValidation } from '../../../../../utils/FormValidation';
import { GenericSelect } from '../../../input_select/GenericSelect';
import AxiosApi from '../../../../../services/AxiosApi';

/*

- Esse modal é utilizado para construir formulários para a página de administração
- Ele recebe os dados e o tipo de operação, e é construído de acordo com esses dados
- Por enquanto é utilizado apenas para a operação de DELETE e UPDATE de usuários

*/

export function UpdateDeleteUserFormulary({data, operation, refresh_setter}) {

  // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

    // Utilizador do state global de autenticação
    const {AuthData} = useAuthentication();

    // States do formulário
    const [open, setOpen] = React.useState(false);

    // States utilizados nas validações dos campos 
    const [errorDetected, setErrorDetected] = useState({email: false, name: false, profile: false, status: false}); // State para o efeito de erro - true ou false
    const [errorMessage, setErrorMessage] = useState({email: null, name: null, profile: null, status: null}); // State para a mensagem do erro - objeto com mensagens para cada campo

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

      setErrorDetected({email: false, name: false, profile: false, status: false});
      setErrorMessage({email: null, name: null, profile: null, status: null});
      setDisplayAlert({display: false, type: "", message: ""});
      setDisabledButton(false);

      setOpen(false);

    };

    // Função para atualizar o registro
    const handleSubmitOperation = (event) => {
      event.preventDefault();

      // Instância da classe JS FormData - para trabalhar os dados do formulário
      const data = new FormData(event.currentTarget);

      if(operation === "update"){

          // Validação dos dados do formulário
          // A comunicação com o backend só é realizada se o retorno for true
          if(dataValidate(data)){

            setDisabledButton(true);

            // Inicialização da requisição para o servidor
            requestServerOperation(data, operation);

        }

      }else if(operation === "delete"){

          setDisabledButton(true);

         // Inicialização da requisição para o servidor
         requestServerOperation(data, operation);

      }

    }

    function dataValidate(formData){

      // Padrão de um email válido
      const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

      const emailValidate = FormValidation(formData.get("email_input"), null, null, emailPattern, "EMAIL");
      const nameValidate = FormValidation(formData.get("name_input"), 3, null, null, null);
      const profileValidate = Number(formData.get("select_profile")) === 0 ? {error: true, message: "Selecione um perfil"} : {error: false, message: ""};
      const statusValidate = (Number(formData.get("status_input")) != 0 && Number(formData.get("status_input")) != 1) ? {error: true, message: "O status deve ser 1 ou 0"} : {error: false, message: ""}; 

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
      let logged_user_id = AuthData.data.id; // ID do usuário logado
      let module_id = 1; // ID do módulo
      let action = "escrever"; // Tipo de ação realizada

      if(operation === "update"){

        AxiosApi.patch(`/api/admin-module-user/${data.get("id_input")}`, {
          auth: `${logged_user_id}.${module_id}.${action}`,
          nome: data.get("name_input"),
          email: data.get("email_input"),
          status: data.get("status_input"),
          id_perfil: data.get("select_profile")
        })
        .then(function (response) {

          successServerResponseTreatment();  
  
        })
        .catch(function (error) {
          
          errorServerResponseTreatment(error.response.data);
  
        });

      }else if(operation === "delete"){

        AxiosApi.delete(`/api/admin-module-user/${data.get("id_input")}?auth=${logged_user_id}.${module_id}.${action}`)
        .then(function (response) {

          successServerResponseTreatment();
  
        })
        .catch(function (error) {
          
          errorServerResponseTreatment(error.response.data);
  
        });

      }

    }

    function successServerResponseTreatment(){

      refresh_setter(true);

      setDisplayAlert({display: true, type: "success", message: "Operação realizada com sucesso!"});

      setTimeout(() => {

        setDisabledButton(false);

        handleClose();

      }, 2000);

    }

    function errorServerResponseTreatment(response_data){

      setDisabledButton(false);

      let error_message = response_data.message != "" ? response_data.message : "Houve um erro na realização da operação!";
      setDisplayAlert({display: true, type: "error", message: error_message});

      let input_errors = {
        email: {error: false, message: null},
        nome: {error: false, message: null},
        id_perfil: {error: false, message: null},
        status: {error: false, message: null},
      }

      for(let prop in response_data.errors){

        input_errors[prop] = {
          error: true, 
          message: response_data.errors[prop][0]
        }

      }

      setErrorDetected({
        email: input_errors.email.error, 
        name: input_errors.nome.error, 
        profile: input_errors.id_perfil.error, 
        status: input_errors.status.error
      });

      setErrorMessage({
        email: input_errors.email.message, 
        name: input_errors.nome.message, 
        profile: input_errors.id_perfil.message, 
        status: input_errors.status.message
      });

    }

    // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

    /* Se o perfil do usuário logado não tiver o poder de LER quanto ao módulo de "Administração", os botão serão desabilitados - porque o usuário não terá permissão para isso  */
    /* Ou, se o registro atual, da tabela, tiver um número de acesso menor (quanto menor, maior o poder) ou igual ao do usuário logado, os botão serão desabilitados - Super Admin não edita Super Admin, Admin não edita Admin, etc */
    const deleteButton = <IconButton 
    disabled={AuthData.data.user_powers["1"].profile_powers.escrever == 1 ? (data.access <= AuthData.data.general_access ? true : false) : true} 
    value = {data.id} onClick={handleClickOpen}
    ><DeleteIcon 
    style={{ fill: AuthData.data.user_powers["1"].profile_powers.escrever == 1 ? (data.access <= AuthData.data.general_access ? "#808991" : "#D4353B") : "#808991"}} 
    /></IconButton>

    const updateButton = <IconButton 
    disabled={AuthData.data.user_powers["1"].profile_powers.escrever == 1 ? false : true} 
    value = {data.id} onClick={handleClickOpen}
    ><EditIcon 
    style={{ fill: AuthData.data.user_powers["1"].profile_powers.escrever == 1 ? (data.access <= AuthData.data.general_access ? "#808991" : "#009BE5") : "#808991"}} 
    /></IconButton>

  return (
    <div>

      {/* Botão que abre o Modal - pode ser o de atualização ou de deleção, depende da operação */}
      {operation === "update" ? updateButton : deleteButton}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{operation === "update" ? "ATUALIZAÇÃO" : "DELEÇÃO"} | USUÁRIO (ID: {data.user_id})</DialogTitle>

        {/* Formulário da criação/registro do usuário - Componente Box do tipo "form" */}
        <Box component="form" noValidate onSubmit={handleSubmitOperation} >

          <DialogContent>
            
            <TextField
              margin="dense"
              id="id_input"
              name="id_input"
              label="ID"
              type="email"
              fullWidth
              variant="outlined"
              defaultValue={data.user_id}
              InputProps={{
                  readOnly: true,
              }}
            />
            <TextField
              margin="dense"
              id="name_input"
              name="name_input"
              label="Nome completo"
              fullWidth
              variant="outlined"
              defaultValue={data.name}
              InputProps={{
                  readOnly: operation == "delete" ? true : false,
              }}
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
              defaultValue={data.email} 
              InputProps={{
                  readOnly: operation == "delete" ? true : false,
              }}
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
              defaultValue={data.status}
              InputProps={{
                  readOnly: operation == "delete" ? true : false,
                  inputProps: { min: 0, max: 1 }
              }}
              helperText = {errorMessage.status}
              error = {errorDetected.status}
            />

            <GenericSelect 
            label_text = {"Perfil"} 
            data_source = {"/api/admin-module-user/create?auth=none"} 
            primary_key={"id"} 
            key_content={"nome"} 
            error = {errorDetected.profile} 
            default = {data.access} 
            disabled = {operation === "update" ? false : true} 
            name = {"select_profile"} 
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
}
