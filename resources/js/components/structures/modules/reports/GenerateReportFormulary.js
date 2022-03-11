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
import Box from '@mui/material/Box';
import { Alert } from '@mui/material';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

// IMPORTAÇÃO DOS COMPONENTES CUSTOMIZADOS
import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';
import { FormValidation } from '../../../../services/FormValidation';
import { InputSelect } from '../../input_select/InputSelect';
import AxiosApi from '../../../../services/AxiosApi';

export function GenerateReportFormulary({data, operation, refresh_setter}){

    // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

    // Utilizador do state global de autenticação
    const {AuthData, setAuthData} = useAuthentication();

    // States do formulário
    const [open, setOpen] = useState(false);

    // State da operação a ser realizada
    const [formOperation, setOperation] = useState(operation);

    // States utilizados nas validações dos campos 
    const [errorDetected, setErrorDetected] = useState({flight_start_date: false, flight_end_date: false, flight_log: false, report_note: false}); // State para o efeito de erro - true ou false
    const [errorMessage, setErrorMessage] = useState({flight_start_date: "", flight_end_date: "", flight_log: "", report_note: ""}); // State para a mensagem do erro - objeto com mensagens para cada campo

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

        setErrorDetected({flight_start_date: false, flight_end_date: false, flight_log: false, report_note: false});
        setErrorMessage({flight_start_date: "", flight_end_date: "", flight_log: "", report_note: ""});
        setDisplayAlert({display: false, type: "", message: ""});
        setDisabledButton(false);
  
        setOpen(false);

    };

    // Função para atualizar o registro
    const handleSubmitOperation = (event) => {
        event.preventDefault();

        // Instância da classe JS FormData - para trabalhar os dados do formulário
        const data = new FormData(event.currentTarget);

        // Validação dos dados do formulário
        // A comunicação com o backend só é realizada se o retorno for true
        if(dataValidate(data)){

        setDisabledButton(true);

        // Inicialização da requisição para o servidor
        requestServerOperation(data, operation);

    }


    }

    function dataValidate(formData){

      // Padrão de um email válido
      const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

      // Validação dos dados - true para presença de erro e false para ausência
      // Se utilizada a função FormValidation é retornado um objeto com dois atributos: "erro" e "message"
      // Se o atributo "erro" for true, um erro foi detectado, e o atributo "message" terá a mensagem sobre a natureza do erro
      const emailValidate = FormValidation(formData.get("email_input"), null, null, emailPattern, "EMAIL");
      const nameValidate = FormValidation(formData.get("name_input"), 3, null, null, null);
      const profileValidate = Number(formData.get("select_item_input")) === 0 ? {error: true, message: "Selecione um perfil"} : {error: false, message: ""};

      // Atualização dos estados responsáveis por manipular os inputs
      setErrorDetected({email: emailValidate.error, name: nameValidate.error});
      setErrorMessage({email: emailValidate.message, name: nameValidate.message});

      // Se o email ou a senha estiverem errados
      if(emailValidate.error === true || nameValidate.error === true || profileValidate.error){

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

        // Reunião dos dados de autenticação em uma string para enviar no corpo da requisição PATCH
        let auth = `${logged_user_id}/${module_id}/${action}`;

        AxiosApi.patch("/api/admin-module/users_panel", {
          auth: auth,
          id: data.get("id_input"),
          name: data.get("name_input"),
          email: data.get("email_input"),
          status: data.get("status_input"),
          profile: data.get("select_item_input")
        })
        .then(function (response) {
  
            // Tratamento da resposta do servidor
            serverResponseTreatment(response);
  
        })
        .catch(function (error) {
          
          // Tratamento da resposta do servidor
          serverResponseTreatment(error.response);
  
        });

      }else if(operation === "delete"){

        let param = `users_panel|${data.get("id_input")}`;

        AxiosApi.delete(`/api/admin-module/${param}?auth=${logged_user_id}/${module_id}/${action}`)
        .then(function (response) {
  
            // Tratamento da resposta do servidor
            serverResponseTreatment(response);
  
        })
        .catch(function (error) {
          
          // Tratamento da resposta do servidor
          serverResponseTreatment(error.response);
  
        });

      }

    }

    function serverResponseTreatment(response){

      if(response.status === 200){

        if(operation === "update"){

          // Altera o state "refreshPanel" para true
          refresh_setter(true);

          // Alerta sucesso
          setDisplayAlert({display: true, type: "success", message: "Atualização realizada com sucesso!"});

        }else{

          // Altera o state "refreshPanel" para true
          refresh_setter(true);

          // Alerta sucesso
          setDisplayAlert({display: true, type: "success", message: "Deleção realizada com sucesso!"});

        }

        setTimeout(() => {

          setDisabledButton(false);

          handleClose();

        }, 2000);

      }else{

        setDisabledButton(false);

        if(operation === "update" && response.data.error === "email_already_exists"){

          // Atualização dos estados responsáveis por manipular os inputs
          setErrorDetected({email: true, name: false});
          setErrorMessage({email: "Esse email já existe", name: null});

          // Alerta erro
          setDisplayAlert({display: true, type: "error", message: "Erro! Já existe um usuário com esse email."});

        }else{

          // Alerta erro
          setDisplayAlert({display: true, type: "error", message: "Erro! Tente novamente."});

        }

      }

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
        <DialogTitle>{operation === "update" ? "ATUALIZAÇÃO" : "DELEÇÃO"}</DialogTitle>

        {/* Formulário da criação/registro do usuário - Componente Box do tipo "form" */}
        <Box component="form" noValidate onSubmit={handleSubmitOperation} sx={{ mt: 1 }} >

          <DialogContent>
            <DialogContentText>
              Formulário para {operation === "update" ? "atualização" : "deleção"} do registro do usuário de ID igual a {data.user_id} e nome {data.name}.
            </DialogContentText>
            <TextField
              margin="dense"
              id="id_input"
              name="id_input"
              label="ID"
              type="text"
              fullWidth
              variant="outlined"
              defaultValue={data.report_id}
              InputProps={{
                  readOnly: true,
              }}
            />
            <TextField
              margin="dense"
              id="name_input"
              name="name_input"
              label="Nome completo"
              type="text"
              fullWidth
              variant="outlined"
              defaultValue={data.flight_start_date}
              InputProps={{
                  readOnly: operation == "delete" ? true : false,
              }}
              helperText = {errorMessage.flight_start_date}
              error = {errorDetected.flight_start_date}
            />
            <TextField
              margin="dense"
              id="email_input"
              name="email_input"
              label="Endereço de email"
              type="text"
              fullWidth
              variant="outlined"
              defaultValue={data.flight_end_date} 
              InputProps={{
                  readOnly: operation == "delete" ? true : false,
              }}
              helperText = {errorMessage.flight_end_date}
              error = {errorDetected.flight_end_date}
            />

            <TextField
              margin="dense"
              id="status_input"
              name="status_input"
              label="Status da conta"
              type="text"
              fullWidth
              variant="outlined"
              defaultValue={data.flight_log}
              InputProps={{
                  readOnly: operation == "delete" ? true : false,
                  inputProps: { min: 0, max: 1 }
              }}
              helperText = {errorMessage.flight_log}
              error = {errorDetected.flight_log}
            />

            <TextField
              margin="dense"
              id="status_input"
              name="status_input"
              label="Status da conta"
              type="text"
              fullWidth
              variant="outlined"
              defaultValue={data.report_note}
              InputProps={{
                  readOnly: operation == "delete" ? true : false
              }}
              helperText = {errorMessage.report_note}
              error = {errorDetected.report_note}
            />

          <InputSelect label_text = {"Perfil"} data_source = {"/api/admin-module/create?panel=users_panel&auth=none"} error = {errorDetected.profile} default = {data.access} disabled = {operation === "update" ? false : true} />

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