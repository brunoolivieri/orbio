import * as React from 'react';
// Material UI
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton, Alert, LinearProgress, TextField, Grid, Divider, DialogContentText } from '@mui/material';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
// Custom
import { useAuth } from '../../../../../context/Auth';
import { FormValidation } from '../../../../../../utils/FormValidation';
import axios from '../../../../../../services/AxiosApi';

const initialFieldError = {
  name: false,
  observation: false
}

const initialFieldErrorMessage = {
  name: '',
  observation: ''
}

const initialDisplayAlert = { display: false, type: "", message: "" };

export const UpdateReport = React.memo((props) => {

  // ============================================================================== STATES ============================================================================== //

  const { user } = useAuth();
  const [open, setOpen] = React.useState(false);
  const [controlledInput, setControlledInput] = React.useState({ id: props.record.id, name: props.record.name, observation: props.record.observation });
  const [fieldError, setFieldError] = React.useState(initialFieldError);
  const [fieldErrorMessage, setFieldErrorMessage] = React.useState(initialFieldErrorMessage);
  const [displayAlert, setDisplayAlert] = React.useState(initialDisplayAlert);
  const [loading, setLoading] = React.useState(false);

  // ============================================================================== FUNCTIONS ============================================================================== //

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setFieldError({ observation: false });
    setFieldErrorMessage({ observation: "" });
    setDisplayAlert({ display: false, type: "", message: "" });
    setOpen(false);
    setLoading(false);
  }

  function handleSubmit() {
    if (formValidation()) {
      setLoading(true);
      requestServer();
    }
  }

  function formValidation() {

    const nameValidate = FormValidation(controlledInput.name, 3, null, null, null);
    const observationValidate = FormValidation(controlledInput.observation, 3, null, null, null);

    setFieldError({ name: nameValidate.error, observation: observationValidate.error });
    setFieldErrorMessage({ name: nameValidate.message, observation: observationValidate.message });

    return !(observationValidate.error || nameValidate.error);

  }

  function requestServer() {
    axios.patch(`/api/reports-module/${controlledInput.id}`, controlledInput)
      .then(function (response) {
        successResponse(response);
      })
      .catch(function (error) {
        errorServerResponseTreatment(error.response);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function successResponse(response) {
    setDisplayAlert({ display: true, type: "success", message: response.data.message });
    setTimeout(() => {
      props.reloadTable((old) => !old);
      handleClose();
    }, 2000);
  }

  function errorServerResponseTreatment(data) {

    let error_message = (data.message != "" && data.message != undefined) ? data.message : "Erro do servidor!";
    setDisplayAlert({ display: true, type: "error", message: error_message });

    // Definição dos objetos de erro possíveis de serem retornados pelo validation do Laravel
    let input_errors = {
      observation: { error: false, message: null },
    }

    // Coleta dos objetos de erro existentes na response
    for (let prop in data.errors) {

      input_errors[prop] = {
        error: true,
        message: data.errors[prop][0]
      }

    }

    setFieldError({
      observation: input_errors.observation.error
    });

    setFieldErrorMessage({
      observation: input_errors.observation.message
    });

  }

  function handleInputChange(event) {
    setControlledInput({ ...controlledInput, [event.target.name]: event.currentTarget.value });
  }

  // ============================================================================== STRUCTURES - MUI ============================================================================== //

  return (
    <>
      <Tooltip title="Editar">
        <IconButton disabled={!user.user_powers["4"].profile_powers.write == 1} onClick={handleClickOpen}>
          <FontAwesomeIcon icon={faPen} color={user.user_powers["4"].profile_powers.write == 1 ? "#007937" : "#E0E0E0"} size="sm" />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ style: { borderRadius: 15 } }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>ATUALIZAÇÃO DE RELATÓRIO</DialogTitle>
        <Divider />

        <DialogContent>

          <DialogContentText sx={{ mb: 2 }}>
            Preencha todos os dados requisitados no formulário para a atualização do relatório.
          </DialogContentText>

          <Grid container spacing={1}>

            <Grid item xs={12}>
              <TextField
                margin="dense"
                id="id"
                name="id"
                label="ID"
                type="text"
                fullWidth
                variant="outlined"
                value={controlledInput.id}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                margin="dense"
                label="Nome"
                type="text"
                fullWidth
                name="name"
                variant="outlined"
                value={controlledInput.name}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                margin="dense"
                id="observation"
                name="observation"
                label="Observação"
                type="text"
                fullWidth
                variant="outlined"
                value={controlledInput.observation}
                helperText={fieldErrorMessage.observation}
                error={fieldError.observation}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>

        </DialogContent>

        {displayAlert.display &&
          <Alert severity={displayAlert.type}>{displayAlert.message}</Alert>
        }

        {loading && <LinearProgress />}

        <Divider />
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button disabled={loading} variant="contained" onClick={handleSubmit}>Confirmar</Button>
        </DialogActions>

      </Dialog>
    </>
  );
});