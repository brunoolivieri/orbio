import *  as React from 'react';
// Material UI
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip, IconButton, Box, Alert, LinearProgress } from '@mui/material';
// Custom
import { useAuthentication } from '../../../../context/InternalRoutesAuth/AuthenticationContext';
import axios from '../../../../../services/AxiosApi';
import { FormValidation } from '../../../../../utils/FormValidation';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const initialControlledInput = { name: "" };
const initialFieldError = { name: false };
const initialFieldErrorMessage = { name: "" };
const initialDisplayAlert = { display: false, type: "", message: "" };

export const CreateProfileFormulary = React.memo((props) => {

  // ============================================================================== STATES ============================================================================== //

  const { AuthData } = useAuthentication();
  const [controlledInput, setControlledInput] = React.useState(initialControlledInput);
  const [fieldError, setFieldError] = React.useState(initialFieldError);
  const [fiedlErrorMessage, setFieldErrorMessage] = React.useState(initialFieldErrorMessage);
  const [open, setOpen] = React.useState(false);
  const [displayAlert, setDisplayAlert] = React.useState(initialDisplayAlert);
  const [loading, setLoading] = React.useState(false);

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

  const handleRegistrationProfile = (event) => {
    event.preventDefault();
    if (formValidation()) {
      setLoading(true);
      requestServerOperation();
    }
  }

  const formValidation = () => {
    const nameValidate = FormValidation(controlledInput.name, 3, null, null, "nome");

    setFieldError({ name: nameValidate.error });
    setFieldErrorMessage({ name: nameValidate.message });

    return !(nameValidate.error);
  }

  const requestServerOperation = () => {
    axios.post("/api/admin-module-profile", {
      name: controlledInput.name
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

  const successResponse = (response) => {
    setDisplayAlert({ display: true, type: "success", message: response.data.message });
    setTimeout(() => {
      props.reload_table();
      setLoading(false);
      handleClose();
    }, 2000);
  }

  const errorResponse = (response) => {
    setDisplayAlert({ display: true, type: "error", message: response.data.message });

    let request_errors = {
      name: { error: false, message: null }
    }

    for (let prop in response.data.errors) {
      request_errors[prop] = {
        error: true,
        message: response.data.errors[prop][0]
      }
    }

    setFieldError({ name: request_errors.name.error });
    setFieldErrorMessage({ name: request_errors.name.message });
  }

  const handleInputChange = (event) => {
    setControlledInput({ ...controlledInput, [event.target.name]: event.currentTarget.value });
  }

  // ============================================================================== STRUCTURES ============================================================================== //

  return (
    <>
      <Tooltip title="Novo Perfil">
        <IconButton onClick={handleClickOpen} disabled={AuthData.data.user_powers["1"].profile_powers.write == 1 ? false : true}>
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
        <DialogTitle>CADASTRO DE PERFIL</DialogTitle>

        <Box component="form" noValidate onSubmit={handleRegistrationProfile} >
          <DialogContent>

            <DialogContentText>
              Um novo perfil deve ser criado apenas sob demanda, e, com a mesma condição, editado e excluído.
            </DialogContentText>

            <TextField
              margin="dense"
              name="name"
              label="Nome do perfil"
              fullWidth
              variant="outlined"
              onChange={handleInputChange}
              helperText={fiedlErrorMessage.name}
              error={fieldError.name}
              sx={{ mt: 3 }}
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
