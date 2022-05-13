// React
import * as React from 'react';
// Material UI
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Tooltip } from '@mui/material';
import { IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import { Alert } from '@mui/material';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
// Custom
import AxiosApi from '../../../../../services/AxiosApi';
import { GenericSelect } from '../../../input_select/GenericSelect';
import { useAuthentication } from '../../../../context/InternalRoutesAuth/AuthenticationContext';
import { FormValidation } from '../../../../../utils/FormValidation';

export function CreateUserFormulary({ ...props }) {

  // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

  // Utilizador do state global de autenticação
  const { AuthData } = useAuthentication();

  // States utilizados nas validações dos campos 
  const [errorDetected, setErrorDetected] = React.useState({ name: false, email: false, profile: false }); // State para o efeito de erro - true ou false
  const [errorMessage, setErrorMessage] = React.useState({ name: null, email: null, profile: null }); // State para a mensagem do erro - objeto com mensagens para cada campo

  // State da mensagem do alerta
  const [displayAlert, setDisplayAlert] = React.useState({ display: false, type: "", message: "" });

  // State da acessibilidade do botão de executar o registro
  const [disabledButton, setDisabledButton] = React.useState(false);

  // States do formulário
  const [open, setOpen] = React.useState(false);

  // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

  // Função para abrir o modal
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Função para fechar o modal
  const handleClose = () => {

    setErrorDetected({ name: false, email: false, profile: false });
    setErrorMessage({ name: null, email: null, profile: null });
    setDisplayAlert({ display: false, type: "", message: "" });
    setDisabledButton(false);
    setOpen(false);

  };

  /*
  * Rotina 1
  * Ponto inicial do processamento do envio do formulário de registro
  * Recebe os dados do formulário, e transforma em um objeto da classe FormData
  * A próxima rotina, 2, validará esses dados
  */
  function handleRegistrationSubmit(event) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    if (dataValidate(data)) {

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
  function dataValidate(formData) {

    const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    const nameValidate = FormValidation(formData.get("registration_name_input"), 3, null, null, null);
    const emailValidate = FormValidation(formData.get("registration_email_input"), null, null, emailPattern, "EMAIL");
    const profileValidate = Number(formData.get("select_profile")) === 0 ? { error: true, message: "Selecione um perfil" } : { error: false, message: "" };

    setErrorDetected({ name: nameValidate.error, email: emailValidate.error, profile: profileValidate.error });
    setErrorMessage({ name: nameValidate.message, email: emailValidate.message, profile: profileValidate.message });

    if (nameValidate.error || emailValidate.error || profileValidate.error) {

      return false;

    } else {

      return true;

    }

  }

  /*
  * Rotina 3
  * Comunicação AJAX com o Laravel utilizando AXIOS
  * Após o recebimento da resposta, é chamada próxima rotina, 4, de tratamento da resposta do servidor
  */
  function requestServerOperation(data) {

    let user_id = AuthData.data.id;
    let module_id = 1;
    let action = "escrever";

    const random_pass = `User${(Math.floor(Math.random() * 100000000) + 99999999)}`;

    AxiosApi.post(`/api/admin-module-user`, {
      auth: `${user_id}.${module_id}.${action}`,
      email: data.get("registration_email_input"),
      name: data.get("registration_name_input"),
      profile_id: data.get("select_profile"),
      password: random_pass
    })
      .then(function () {

        successServerResponseTreatment();

      })
      .catch(function (error) {

        errorServerResponseTreatment(error.response.data);

      });

  }

  /*
  * Rotina 4A
  * Tratamento da resposta de uma requisição bem sucedida
  */
  function successServerResponseTreatment() {

    setDisplayAlert({ display: true, type: "success", message: "Operação realizada com sucesso!" });

    setTimeout(() => {

      props.reload_table();

      setDisabledButton(false);

      handleClose();

    }, 2000);

  }

  /*
  * Rotina 4B
  * Tratamento da resposta de uma requisição falha
  * Os erros relacionados aos parâmetros enviados são recuperados com o for in
  */
  function errorServerResponseTreatment(response_data) {

    setDisabledButton(false);

    let error_message = (response_data.message != "" && response_data.message != undefined) ? response_data.message : "Houve um erro na realização da operação!";
    setDisplayAlert({ display: true, type: "error", message: error_message });

    // Definição dos objetos de erro possíveis de serem retornados pelo validation do Laravel
    let input_errors = {
      name: { error: false, message: null },
      email: { error: false, message: null },
      profile_id: { error: false, message: null }
    }

    // Coleta dos objetos de erro existentes na response
    for (let prop in response_data.errors) {

      input_errors[prop] = {
        error: true,
        message: response_data.errors[prop][0]
      }

    }

    setErrorDetected({
      name: input_errors.name.error,
      email: input_errors.email.error,
      profile: input_errors.profile_id.error
    });

    setErrorMessage({
      name: input_errors.name.message,
      email: input_errors.email.message,
      profile: input_errors.profile_id.message
    });

  }

  // ============================================================================== ESTRUTURAÇÃO DA PÁGINA - MATERIAL UI ============================================================================== //

  return (
    <div>

      {/* Botão para abrir o formulário */}
      <Tooltip title="Novo Usuário">
        <IconButton onClick={handleClickOpen} disabled={AuthData.data.user_powers["1"].profile_powers.escrever == 1 ? false : true} >
          <FontAwesomeIcon icon={faPlus} color={AuthData.data.user_powers["1"].profile_powers.escrever == 1 ? "#00713A" : "#808991"} size="sm" />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>CADASTRO DE USUÁRIO</DialogTitle>

        {/* Formulário da criação/registro do usuário - Componente Box do tipo "form" */}
        <Box component="form" noValidate onSubmit={handleRegistrationSubmit} >

          <DialogContent>

            <DialogContentText mb={2}>
              O usuário criado receberá um e-mail com dados de acesso padrão.
            </DialogContentText>

            <TextField
              margin="dense"
              label="Nome completo"
              fullWidth
              variant="outlined"
              required
              id="registration_name_input"
              name="registration_name_input"
              helperText={errorMessage.name}
              error={errorDetected.name}
              sx={{ mb: 2 }}
            />

            <TextField
              type="email"
              margin="dense"
              label="Endereço de email"
              fullWidth
              variant="outlined"
              required
              id="registration_email_input"
              name="registration_email_input"
              helperText={errorMessage.email}
              error={errorDetected.email}
              sx={{ mb: 2 }}
            />

            <GenericSelect
              label_text={"Perfil"}
              data_source={"/api/admin-module-user/create?auth=none"}
              primary_key={"id"}
              key_content={"nome"}
              error={errorDetected.profile}
              default={0}
              name={"select_profile"}
            />

          </DialogContent>

          {displayAlert.display &&
            <Alert severity={displayAlert.type}>{displayAlert.message}</Alert>
          }

          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={disabledButton} variant="contained">Criar usuário e enviar email</Button>
          </DialogActions>

        </Box>

      </Dialog>
    </div>
  );
}
