import * as React from 'react';
// Material UI
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip, IconButton, Box, Alert, LinearProgress } from '@mui/material';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
// Custom
import axios from '../../../../../services/AxiosApi';
import { SelectAttributeControl } from '../../../input_select/SelectAttributeControl';
import { useAuthentication } from '../../../../context/InternalRoutesAuth/AuthenticationContext';
import { FormValidation } from '../../../../../utils/FormValidation';

const initialControlledInput = { name: "", email: "", profile: "0" };
const initialFieldError = { name: false, email: false, profile: false };
const initialFieldErrorMessage = { name: "", email: "", profile: "" };
const initialDisplayAlert = { display: false, type: "", message: "" };

export const CreateUserFormulary = React.memo(({ ...props }) => {

  // ============================================================================== STATES ============================================================================== //

  const { AuthData } = useAuthentication();
  const [controlledInput, setControlledInput] = React.useState(initialControlledInput);
  const [fieldError, setFieldError] = React.useState(initialFieldError);
  const [fieldErrorMessage, setFieldErrorMessage] = React.useState(initialFieldErrorMessage);
  const [displayAlert, setDisplayAlert] = React.useState(initialDisplayAlert);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  // ============================================================================== FUNCTIONS ============================================================================== //

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setControlledInput(initialControlledInput);
    setFieldError(initialFieldError);
    setFieldErrorMessage(initialFieldErrorMessage);
    setDisplayAlert(initialDisplayAlert);
    setLoading(false);
    setOpen(false);
  }

  function handleRegistrationSubmit(event) {
    event.preventDefault();
    if (formValidation()) {
      setLoading(true);
      requestServerOperation();
    }
  }

  function formValidation() {
    const nameValidate = FormValidation(controlledInput.name, 3, null, null, null);
    const emailValidate = FormValidation(controlledInput.email, null, null, /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "e-mail");
    const profileValidate = Number(controlledInput.profile) === 0 ? { error: true, message: "Selecione um perfil" } : { error: false, message: "" };

    setFieldError({ name: nameValidate.error, email: emailValidate.error, profile: profileValidate.error });
    setFieldErrorMessage({ name: nameValidate.message, email: emailValidate.message, profile: profileValidate.message });

    return !(nameValidate.error || emailValidate.error || profileValidate.error);
  }

  function requestServerOperation() {
    axios.post(`/api/admin-module-user`, {
      email: controlledInput.email,
      name: controlledInput.name,
      profile_id: controlledInput.profile
    })
      .then(function (response) {
        setLoading(false);
        successResponse(response);
      })
      .catch(function (error) {
        setLoading(false);
        errorResponse(error.response);
      });
  }

  function successResponse(response) {
    setDisplayAlert({ display: true, type: "success", message: response.data.message });
    setTimeout(() => {
      props.reload_table();
      setLoading(false);
      handleClose();
    }, 2000);
  }

  function errorResponse(response) {
    setDisplayAlert({ display: true, type: "error", message: response.data.message });

    let request_errors = {
      name: { error: false, message: null },
      email: { error: false, message: null },
      profile_id: { error: false, message: null }
    }

    for (let prop in response.data.errors) {
      request_errors[prop] = {
        error: true,
        message: response.data.errors[prop][0]
      }
    }

    setFieldError({
      name: request_errors.name.error,
      email: request_errors.email.error,
      profile: request_errors.profile_id.error
    });

    setFieldErrorMessage({
      name: request_errors.name.message,
      email: request_errors.email.message,
      profile: request_errors.profile_id.message
    });
  }

  function handleInputChange(event) {
    setControlledInput({ ...controlledInput, [event.target.name]: event.currentTarget.value });
  }

  // ============================================================================== STRUCTURES ============================================================================== //

  return (
    <>
      <Tooltip title="Novo Usuário">
        <IconButton onClick={handleClickOpen} disabled={AuthData.data.user_powers["1"].profile_powers.write == 1 ? false : true} >
          <FontAwesomeIcon icon={faPlus} color={AuthData.data.user_powers["1"].profile_powers.write == 1 ? "#00713A" : "#808991"} size="sm" />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ style: { borderRadius: 15 } }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>CADASTRO DE USUÁRIO</DialogTitle>

        <Box component="form" noValidate onSubmit={handleRegistrationSubmit} >

          <DialogContent>

            <DialogContentText mb={2}>
              O usuário criado receberá um e-mail com os dados de acesso padrão.
            </DialogContentText>

            <TextField
              margin="dense"
              label="Nome completo"
              fullWidth
              variant="outlined"
              required
              name="name"
              onChange={handleInputChange}
              helperText={fieldErrorMessage.name}
              error={fieldError.name}
              sx={{ mb: 2 }}
            />

            <TextField
              type="email"
              margin="dense"
              label="Endereço de email"
              fullWidth
              variant="outlined"
              required
              name="email"
              onChange={handleInputChange}
              helperText={fieldErrorMessage.email}
              error={fieldError.email}
              sx={{ mb: 2 }}
            />

            <SelectAttributeControl
              label_text={"Perfil"}
              data_source={"/api/load-profiles"}
              primary_key={"id"}
              key_content={"name"}
              error={fieldError.profile}
              name={"profile"}
              value={controlledInput.profile}
              setControlledInput={setControlledInput}
              controlledInput={controlledInput}
            />

          </DialogContent>

          {(!loading && displayAlert.display) &&
            <Alert severity={displayAlert.type}>{displayAlert.message}</Alert>
          }

          {loading && <LinearProgress />}

          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={loading} variant="contained">Confirmar</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
});
