import * as React from 'react';
// Material UI
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton, Alert, LinearProgress, TextField, Divider, Grid, Link } from '@mui/material';
// Custom
import { useAuthentication } from '../../../../../context/InternalRoutesAuth/AuthenticationContext';
import { FormValidation } from '../../../../../../utils/FormValidation';
import axios from '../../../../../../services/AxiosApi';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

const initialFieldError = { name: false, description: false };
const initialFieldErrorMessage = { name: "", description: "" };
const initialDisplatAlert = { display: false, type: "", message: "" };

export const UpdateFlightPlan = React.memo((props) => {

  // ============================================================================== STATES ============================================================================== //

  const { AuthData } = useAuthentication();

  const [controlledInput, setControlledInput] = React.useState({ id: props.record.id, name: props.record.name, description: props.record.description });
  const [fieldError, setFieldError] = React.useState(initialFieldError);
  const [fieldErrorMessage, setFieldErrorMessage] = React.useState(initialFieldErrorMessage);
  const [displayAlert, setDisplayAlert] = React.useState(initialDisplatAlert);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  // ============================================================================== FUNCTIONS ============================================================================== //

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setFieldError({ description: false });
    setFieldErrorMessage({ description: "" });
    setDisplayAlert({ display: false, type: "", message: "" });
    setLoading(false);
    setOpen(false);
  }

  function handleSubmit() {
    if (formValidation()) {
      setLoading(true);
      requestServerOperation();
    }
  }

  function formValidation() {
    const nameValidate = FormValidation(controlledInput.name, 3, null, null, "nome");
    const descriptionValidate = FormValidation(controlledInput.description, 3, null, null, "descrição");

    setFieldError({ name: nameValidate.error, description: descriptionValidate.error });
    setFieldErrorMessage({ name: nameValidate.message, description: descriptionValidate.message });

    return !(nameValidate.error || descriptionValidate.error);
  }

  function requestServerOperation() {
    axios.patch(`/api/plans-module/${controlledInput.id}`, {
      name: controlledInput.name,
      description: controlledInput.description
    })
      .then(function (response) {
        successResponse(response);
      })
      .catch(function (error) {
        errorResponse(error.response.data);
      })
      .finally(() => {
        setLoading(false);
      })
  }

  function successResponse(response) {
    setDisplayAlert({ display: true, type: "success", message: response.data.message });
    setTimeout(() => {
      props.reloadTable((old) => !old);
      setLoading(false);
      handleClose();
    }, 2000);
  }

  function errorResponse(response_data) {
    setDisplayAlert({ display: true, type: "error", message: response_data.message });

    let request_errors = {
      name: { error: false, message: null },
      description: { error: false, message: null }
    }

    for (let prop in response_data.errors) {
      request_errors[prop] = {
        error: true,
        message: response_data.errors[prop][0]
      }
    }

    setFieldError({
      name: request_errors.name.error,
      description: request_errors.description.error
    });

    setFieldErrorMessage({
      name: request_errors.name.message,
      description: request_errors.description.message
    });
  }

  function handleInputChange(event) {
    setControlledInput({ ...controlledInput, [event.target.name]: event.currentTarget.value });
  }

  // ============================================================================== STRUCTURES ============================================================================== //

  return (
    <>
      <Tooltip title="Editar">
        <IconButton disabled={!AuthData.data.user_powers["2"].profile_powers.write == 1} onClick={handleClickOpen}>
          <FontAwesomeIcon icon={faPen} color={AuthData.data.user_powers["2"].profile_powers.write == 1 ? "#007937" : "#E0E0E0"} size="sm" />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ style: { borderRadius: 15 } }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>ATUALIZAÇÃO DE PLANO DE VOO</DialogTitle>
        <Divider />

        <DialogContent>
          <Grid container spacing={1}>

            <Grid item xs={2}>
              <TextField
                margin="dense"
                id="id"
                name="id"
                label="ID do plano"
                type="text"
                fullWidth
                variant="outlined"
                onChange={handleInputChange}
                defaultValue={props.record.id}
                inputProps={{
                  readOnly: true
                }}
              />
            </Grid>

            <Grid item xs={10}>
              <TextField
                margin="dense"
                id="name"
                name="name"
                label="Nome do plano"
                type="text"
                fullWidth
                variant="outlined"
                onChange={handleInputChange}
                defaultValue={props.record.name}
                helperText={fieldErrorMessage.name}
                error={fieldError.name}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="description"
                label="Descrição"
                type="text"
                fullWidth
                variant="outlined"
                onChange={handleInputChange}
                defaultValue={props.record.description}
                helperText={fieldErrorMessage.description}
                error={fieldError.description}
              />
            </Grid>

            <Grid item xs={6}>
              <Button variant="contained" disabled>
                <Link href={`/internal/map?file=${props.record.file}`} target="_blank" sx={{ color: '#fff', textDecoration: 'none' }}>
                  Editar plano
                </Link>
              </Button>
            </Grid>

          </Grid>
        </DialogContent>

        {(!loading && displayAlert.display) &&
          <Alert severity={displayAlert.type}>{displayAlert.message}</Alert>
        }

        {loading && <LinearProgress />}

        <Divider />
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit" disabled={loading} variant="contained" onClick={handleSubmit}>Confirmar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
});