// React
import * as React from 'react';
// Material UI
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
import { Switch } from '@mui/material';
import { FormGroup } from '@mui/material';
import { FormControlLabel } from '@mui/material';
// Custom
import { useAuthentication } from '../../../../context/InternalRoutesAuth/AuthenticationContext';
import { FormValidation } from '../../../../../utils/FormValidation';
import { GenericSelect } from '../../../input_select/GenericSelect';
import AxiosApi from '../../../../../services/AxiosApi';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

export const UpdateUserFormulary = React.memo(({ ...props }) => {

  // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

  // Utilizador do state global de autenticação
  const { AuthData } = useAuthentication();

  // States do formulário
  const [open, setOpen] = React.useState(false);

  // States utilizados nas validações dos campos 
  const [errorDetected, setErrorDetected] = React.useState({ email: false, name: false, profile: false, status: false });
  const [errorMessage, setErrorMessage] = React.useState({ email: null, name: null, profile: null, status: null });

  // State da mensagem do alerta
  const [displayAlert, setDisplayAlert] = React.useState({ display: false, type: "", message: "" });

  // State da acessibilidade do botão de executar o registro
  const [disabledButton, setDisabledButton] = React.useState(false);

  // Switch state
  const [isChecked, setIsChecked] = React.useState(props.record.status == 1 ? true : false);

  // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

  // Função para abrir o modal
  const handleClickOpen = () => {
    setOpen(true);
  }

  // Função para fechar o modal
  const handleClose = () => {

    props.record_setter(null);
    setErrorDetected({ email: false, name: false, profile: false, status: false });
    setErrorMessage({ email: null, name: null, profile: null, status: null });
    setDisplayAlert({ display: false, type: "", message: "" });
    setDisabledButton(false);

    setOpen(false);

  }

  /*
   * Rotina 1
   * 
   */
  const handleSubmitOperation = (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    if (submitedDataValidate(data)) {

      setDisabledButton(true);

      requestServerOperation(data);

    }

  }

  const submitedDataValidate = (formData) => {

    const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    const emailValidate = FormValidation(formData.get("email_input"), null, null, emailPattern, "EMAIL");
    const nameValidate = FormValidation(formData.get("name_input"), 3, null, null, null);
    const profileValidate = Number(formData.get("select_profile")) === 0 ? { error: true, message: "Selecione um perfil" } : { error: false, message: "" };
    const statusValidate = Number(isChecked) != 0 && Number(isChecked) != 1 ? { error: true, message: "O status deve ser 1 ou 0" } : { error: false, message: "" };

    setErrorDetected({ email: emailValidate.error, name: nameValidate.error, profile: profileValidate.error, status: statusValidate.error });
    setErrorMessage({ email: emailValidate.message, name: nameValidate.message, profile: profileValidate.message, status: statusValidate.message });

    if (emailValidate.error === true || nameValidate.error === true || profileValidate.error || statusValidate.error) {

      return false;

    } else {

      return true;

    }

  }

  const requestServerOperation = (data) => {

    AxiosApi.patch(`/api/admin-module-user/${data.get("user_id")}`, {
      name: data.get("name_input"),
      email: data.get("email_input"),
      status: isChecked,
      profile_id: data.get("select_profile")
    })
      .then(() => {

        successServerResponseTreatment();

      })
      .catch((error) => {

        errorServerResponseTreatment(error.response.data);

      });

  }

  const successServerResponseTreatment = () => {

    setDisplayAlert({ display: true, type: "success", message: "Operação realizada com sucesso!" });

    setTimeout(() => {

      // Deselecionar registro na tabela
      props.record_setter(null);
      // Outros
      props.reload_table();
      setDisabledButton(false);
      handleClose();

    }, 2000);

  }

  const errorServerResponseTreatment = (response_data) => {

    setDisabledButton(false);

    let error_message = (response_data.message != "" && response_data.message != undefined) ? response_data.message : "Houve um erro na realização da operação!";
    setDisplayAlert({ display: true, type: "error", message: error_message });

    // Definição dos objetos de erro possíveis de serem retornados pelo validation do Laravel
    let input_errors = {
      email: { error: false, message: null },
      name: { error: false, message: null },
      profile_id: { error: false, message: null },
      status: { error: false, message: null },
    }

    // Coleta dos objetos de erro existentes na response
    for (let prop in response_data.errors) {

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

  // ============================================================================== ESTRUTURAÇÃO DA PÁGINA ============================================================================== //

  return (
    <>

      <Tooltip title="Editar">
        <IconButton disabled={AuthData.data.user_powers["1"].profile_powers.escrever == 1 ? false : true} onClick={handleClickOpen}>
          <FontAwesomeIcon icon={faPen} color={AuthData.data.user_powers["1"].profile_powers.escrever == 1 ? "#007937" : "#808991"} size="sm" />
        </IconButton>
      </Tooltip>

      {(props.record != null && open) &&
        <Dialog open={open} onClose={handleClose} PaperProps={{ style: { borderRadius: 15 } }}>
          <DialogTitle>ATUALIZAÇÃO | USUÁRIO (ID: {props.record.user_id})</DialogTitle>

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
                defaultValue={props.record.user_id}
                inputProps={{
                  readOnly: true
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                margin="dense"
                id="name_input"
                name="name_input"
                label="Nome completo"
                fullWidth
                variant="outlined"
                defaultValue={props.record.name}
                helperText={errorMessage.name}
                error={errorDetected.name}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                id="email_input"
                name="email_input"
                label="Endereço de email"
                type="email"
                fullWidth
                variant="outlined"
                defaultValue={props.record.email}
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
                default={props.record.access}
                name={"select_profile"}
              />

              <Box sx={{ marginTop: 3 }}>
                <FormGroup>
                  <FormControlLabel control={<Switch defaultChecked={isChecked} onChange={(event) => { setIsChecked(event.currentTarget.checked) }} />} label={isChecked ? "Ativo" : "Inativo"} />
                </FormGroup>
              </Box>

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