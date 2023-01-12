import *  as React from 'react';
// Material UI
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip, IconButton, Alert, LinearProgress, Divider, Grid, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography } from '@mui/material';
// Custom
import { useAuthentication } from '../../../../../context/InternalRoutesAuth/AuthenticationContext';
import axios from '../../../../../../services/AxiosApi';
import { FormValidation } from '../../../../../../utils/FormValidation';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const initialControlledInput = { name: "" };
const initialFieldError = { name: false };
const initialFieldErrorMessage = { name: "" };
const initialDisplayAlert = { display: false, type: "", message: "" };

export const CreateProfile = React.memo((props) => {

  // ============================================================================== STATES ============================================================================== //

  const { AuthData } = useAuthentication();

  const [controlledInput, setControlledInput] = React.useState(initialControlledInput);
  const [fieldError, setFieldError] = React.useState(initialFieldError);
  const [fiedlErrorMessage, setFieldErrorMessage] = React.useState(initialFieldErrorMessage);
  const [open, setOpen] = React.useState(false);
  const [displayAlert, setDisplayAlert] = React.useState(initialDisplayAlert);
  const [loading, setLoading] = React.useState(false);

  // Reducer Dispatch
  function accessDataReducer(actual_state, action) {
    let cloneState = Object.assign({}, actual_state);
    cloneState[action.field] = action.new_value ? 1 : 0;
    return cloneState;
  }

  // Reducer
  const [accessData, dispatch] = React.useReducer(accessDataReducer, {
    address: 0,
    anac_license: 0,
    cpf: 0,
    cnpj: 0,
    telephone: 0,
    cellphone: 0,
    company_name: 0,
    trading_name: 0
  });

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

  function handleSubmit() {
    if (formValidation()) {
      setLoading(true);
      requestServerOperation();
    }
  }

  function formValidation() {
    const nameValidate = FormValidation(controlledInput.name, 3, null, null, "nome");

    setFieldError({ name: nameValidate.error });
    setFieldErrorMessage({ name: nameValidate.message });

    return !(nameValidate.error);
  }

  function requestServerOperation() {
    axios.post("/api/admin-module-profile", {
      name: controlledInput.name,
      access_data: accessData
    })
      .then(function (response) {
        successResponse(response);
      })
      .catch(function (error) {
        errorResponse(error.response);
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

  function errorResponse(response) {
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

  function handleInputChange(event) {
    setControlledInput({ ...controlledInput, [event.target.name]: event.currentTarget.value });
  }

  // ============================================================================== STRUCTURES ============================================================================== //

  return (
    <>
      <Tooltip title="Novo Perfil">
        <IconButton onClick={handleClickOpen} disabled={!AuthData.data.user_powers["1"].profile_powers.write == 1}>
          <FontAwesomeIcon icon={faPlus} color={AuthData.data.user_powers["1"].profile_powers.write == 1 ? "#00713A" : "#E0E0E0"} size="sm" />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ style: { borderRadius: 15 } }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>CRIAÇÃO DE PERFIL</DialogTitle>
        <Divider />

        <DialogContent>

          <Grid container mb={2}>

            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="name"
                label="Nome do perfil"
                fullWidth
                variant="outlined"
                onChange={handleInputChange}
                helperText={fiedlErrorMessage.name}
                error={fieldError.name}
              />
            </Grid>

          </Grid>

          <DialogContentText>
            Selecione abaixo os dados que serão requisitados aos usuários vinculados a esse perfil.
          </DialogContentText>

          <Grid container sx={{ mt: 2 }} spacing={1} alignItems="left">

            <Grid item xs={4}>
              <FormGroup>
                <FormControlLabel control={<Checkbox checked={accessData["address"]} onChange={(event) => { dispatch({ field: "address", new_value: event.currentTarget.checked }) }} />} label="Endereço" />
              </FormGroup>
            </Grid>

            <Grid item xs={4}>
              <FormGroup>
                <FormControlLabel control={<Checkbox checked={accessData["anac_license"]} onChange={(event) => { dispatch({ field: "anac_license", new_value: event.currentTarget.checked }) }} />} label="Licença Anac" />
              </FormGroup>
            </Grid>

            <Grid item xs={4}>
              <FormGroup>
                <FormControlLabel control={<Checkbox checked={accessData["cpf"]} onChange={(event) => { dispatch({ field: "cpf", new_value: event.currentTarget.checked }) }} />} label="CPF" />
              </FormGroup>
            </Grid>

            <Grid item xs={4}>
              <FormGroup>
                <FormControlLabel control={<Checkbox checked={accessData["cnpj"]} onChange={(event) => { dispatch({ field: "cnpj", new_value: event.currentTarget.checked }) }} />} label="CNPJ" />
              </FormGroup>
            </Grid>

            <Grid item xs={4}>
              <FormGroup>
                <FormControlLabel control={<Checkbox checked={accessData["telephone"]} onChange={(event) => { dispatch({ field: "telephone", new_value: event.currentTarget.checked }) }} />} label="Telefone" />
              </FormGroup>
            </Grid>

            <Grid item xs={4}>
              <FormGroup>
                <FormControlLabel control={<Checkbox checked={accessData["cellphone"]} onChange={(event) => { dispatch({ field: "cellphone", new_value: event.currentTarget.checked }) }} />} label="Celular" />
              </FormGroup>
            </Grid>

            <Grid item xs={4}>
              <FormGroup>
                <FormControlLabel control={<Checkbox checked={accessData["company_name"]} onChange={(event) => { dispatch({ field: "company_name", new_value: event.currentTarget.checked }) }} />} label="Razão Social" />
              </FormGroup>
            </Grid>

            <Grid item xs={4}>
              <FormGroup>
                <FormControlLabel control={<Checkbox checked={accessData["trading_name"]} onChange={(event) => { dispatch({ field: "trading_name", new_value: event.currentTarget.checked }) }} />} label="Nome fantasia" />
              </FormGroup>
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
