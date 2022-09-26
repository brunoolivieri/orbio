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
import LinearProgress from '@mui/material/LinearProgress';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
// Custom
import AxiosApi from '../../../../../services/AxiosApi';
import { GenericSelect } from '../../../input_select/GenericSelect';
import { useAuthentication } from '../../../../context/InternalRoutesAuth/AuthenticationContext';
import { FormValidation } from '../../../../../utils/FormValidation';

export const CreateUserFormulary = React.memo(({ ...props }) => {

  // ============================================================================== STATES ============================================================================== //

  const { AuthData } = useAuthentication();
  const [controlledInput, setControlledInput] = React.useState({ name: "", email: "", profile: "0" });
  const [fieldError, setFieldError] = React.useState({ name: false, email: false, profile: false });
  const [fieldErrorMessage, setFieldErrorMessage] = React.useState({ name: null, email: null, profile: null });
  const [displayAlert, setDisplayAlert] = React.useState({ display: false, type: "", message: "" });
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  // ============================================================================== FUNCTIONS ============================================================================== //

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setFieldError({ name: false, email: false, profile: false });
    setFieldErrorMessage({ name: null, email: null, profile: null });
    setDisplayAlert({ display: false, type: "", message: "" });
    setControlledInput({ name: "", email: "", profile: "" });
    setLoading(false);
    setOpen(false);
  }

  const handleRegistrationSubmit = (event) => {
    event.preventDefault();

    if (formularyDataValidate()) {

      setLoading(true);
      requestServerOperation();

    }

  }

  const formularyDataValidate = () => {

    const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    const nameValidate = FormValidation(controlledInput.name, 3, null, null, null);
    const emailValidate = FormValidation(controlledInput.email, null, null, emailPattern, "e-mail");
    const profileValidate = Number(controlledInput.profile) === 0 ? { error: true, message: "Selecione um perfil" } : { error: false, message: "" };

    setFieldError({ name: nameValidate.error, email: emailValidate.error, profile: profileValidate.error });
    setFieldErrorMessage({ name: nameValidate.message, email: emailValidate.message, profile: profileValidate.message });

    return !(nameValidate.error || emailValidate.error || profileValidate.error);

  }

  const requestServerOperation = () => {

    AxiosApi.post(`/api/admin-module-user`, {
      email: controlledInput.email,
      name: controlledInput.name,
      profile_id: controlledInput.profile
    })
      .then(function () {

        setLoading(false);
        successServerResponseTreatment();

      })
      .catch(function (error) {

        setLoading(false);
        errorServerResponseTreatment(error.response);

      });

  }

  const successServerResponseTreatment = () => {

    setDisplayAlert({ display: true, type: "success", message: "Operação realizada com sucesso!" });

    setTimeout(() => {
      props.reload_table();
      setLoading(false);
      handleClose();
    }, 2000);

  }

  const errorServerResponseTreatment = (response) => {

    const error_message = response.data.message ? response.data.message : "Erro do servidor";
    setDisplayAlert({ display: true, type: "error", message: error_message });

    // Errors by key that can be returned from backend validation
    let request_errors = {
      name: { error: false, message: null },
      email: { error: false, message: null },
      profile_id: { error: false, message: null }
    }

    // Get errors by their key 
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

  const handleInputChange = (event) => {
    setControlledInput({ ...controlledInput, [event.target.name]: event.currentTarget.value });
  }

  // ============================================================================== STRUCTURES ============================================================================== //

  return (
    <div>

      {/* Botão para abrir o formulário */}
      <Tooltip title="Novo Usuário">
        <IconButton onClick={handleClickOpen} disabled={AuthData.data.user_powers["1"].profile_powers.write == 1 ? false : true} >
          <FontAwesomeIcon icon={faPlus} color={AuthData.data.user_powers["1"].profile_powers.write == 1 ? "#00713A" : "#808991"} size="sm" />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} PaperProps={{ style: { borderRadius: 15 } }}>
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

            <GenericSelect
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
    </div>
  );
});
