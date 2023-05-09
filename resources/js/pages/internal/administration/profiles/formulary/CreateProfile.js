import *  as React from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, FormLabel, DialogContentText, DialogTitle, Tooltip, IconButton, Alert, LinearProgress, Divider, Grid, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { useAuth } from '../../../../../context/Auth';
import axios from '../../../../../services/AxiosApi';
import { FormValidation } from '../../../../../utils/FormValidation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const initialFormData = { name: "" };
const initialFormError = { name: { error: false, message: "" } };
const initialDisplayAlert = { display: false, type: "", message: "" };

export const CreateProfile = React.memo((props) => {

  // ============================================================================== STATES ============================================================================== //

  const { user } = useAuth();
  const [formData, setFormData] = React.useState(initialFormData);
  const [formError, setFormError] = React.useState(initialFormError);
  const [open, setOpen] = React.useState(false);
  const [alert, setAlert] = React.useState(initialDisplayAlert);
  const [loading, setLoading] = React.useState(false);
  const [canSave, setCanSave] = React.useState(true);
  const is_authorized = user.user_powers["1"].profile_powers.write;

  // Privileges selection function reducer
  function privilegesReducer(actual_state, action) {
    let cloneState = Object.assign({}, actual_state);
    cloneState[action.module][action.privilege] = action.new_value;
    return cloneState;
  }

  // Privileges reducer
  const [privileges, dispatchPrivileges] = React.useReducer(privilegesReducer, {
    "1": { read: false, write: false },
    "2": { read: false, write: false },
    "3": { read: false, write: false },
    "4": { read: false, write: false },
    "5": { read: false, write: false }
  });

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
    setFormData(initialFormData);
    setFormError(initialFormError);
    setAlert(initialDisplayAlert);
    setLoading(false);
    setCanSave(true);
    setOpen(false);
  }

  function handleSubmit() {
    if (!formSubmissionValidation()) {
      return;
    }
    setLoading(true);
    setCanSave(false);
    requestServer();
  }

  function formSubmissionValidation() {
    let validation = Object.assign({}, initialFormError);
    validation["name"] = FormValidation(formData["name"], 3, 255);
    setFormError(validation);
    return !(validation.name.error);
  }

  async function requestServer() {
    try {
      const response = await axios.post("api/module/administration-profile", {
        name: formData.name,
        privileges: privileges,
        access_data: accessData
      });
      successResponse(response);
    } catch (error) {
      console.log(error.message);
      setCanSave(true);
      errorResponse(error.response);
    } finally {
      setLoading(false);
    }
  }

  function successResponse(response) {
    setAlert({ display: true, type: "success", message: response.data.message });
    setTimeout(() => {
      props.reloadTable((old) => !old);
      setLoading(false);
      handleClose();
    }, 2000);
  }

  function errorResponse(response) {
    if (response.status === 422) {
      setAlert({ display: true, type: "error", message: "Dados inválidos!" });
      let response_errors = Object.assign({}, initialFormError);
      for (let field in response.data.errors) {
        response_errors[field] = {
          error: true,
          message: response.data.errors[field][0]
        }
      }
      setFormError(response_errors);
    } else {
      setAlert({ display: true, type: "error", message: response.data.message });
    }
  }

  function handleInputChange(event) {
    setFormData({ ...formData, [event.target.name]: event.currentTarget.value });
  }

  // ============================================================================== STRUCTURES ============================================================================== //

  return (
    <>
      <Tooltip title="Novo Perfil">
        <IconButton onClick={handleClickOpen} disabled={!is_authorized}>
          <FontAwesomeIcon icon={faPlus} color={is_authorized ? "#00713A" : "#E0E0E0"} size="sm" />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ style: { borderRadius: 15 } }}
        fullWidth
        maxWidth="xl"
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
                helperText={formError.name.message}
                error={formError.name.error}
              />
            </Grid>
          </Grid>

          <DialogContentText>
            Selecione abaixo o poder de acesso do perfil aos módulos existentes.
          </DialogContentText>

          <Grid container sx={{ mt: 2, mb: 2 }} spacing={1} alignItems="left">
            <Grid item>
              <FormLabel component="legend">Admin</FormLabel>
              <FormGroup>
                <FormControlLabel control={<Checkbox checked={privileges["1"].read} onChange={(event) => { dispatchPrivileges({ module: "1", privilege: "read", new_value: event.currentTarget.checked }) }} />} label="Ler" />
                <FormControlLabel control={<Checkbox checked={privileges["1"].write} onChange={(event) => { dispatchPrivileges({ module: "1", privilege: "write", new_value: event.currentTarget.checked }) }} />} label="Escrever" />
              </FormGroup>
            </Grid>

            <Grid item>
              <FormLabel component="legend">Planos</FormLabel>
              <FormGroup>
                <FormControlLabel control={<Checkbox checked={privileges["2"].read} onChange={(event) => { dispatchPrivileges({ module: "2", privilege: "read", new_value: event.currentTarget.checked }) }} />} label="Ler" />
                <FormControlLabel control={<Checkbox checked={privileges["2"].write} onChange={(event) => { dispatchPrivileges({ module: "2", privilege: "write", new_value: event.currentTarget.checked }) }} />} label="Escrever" />
              </FormGroup>
            </Grid>

            <Grid item>
              <FormLabel component="legend">Ordens</FormLabel>
              <FormGroup>
                <FormControlLabel control={<Checkbox checked={privileges["3"].read} onChange={(event) => { dispatchPrivileges({ module: "3", privilege: "read", new_value: event.currentTarget.checked }) }} />} label="Ler" />
                <FormControlLabel control={<Checkbox checked={privileges["3"].write} onChange={(event) => { dispatchPrivileges({ module: "3", privilege: "write", new_value: event.currentTarget.checked }) }} />} label="Escrever" />
              </FormGroup>
            </Grid>

            <Grid item>
              <FormLabel component="legend">Relatórios</FormLabel>
              <FormGroup>
                <FormControlLabel control={<Checkbox checked={privileges["4"].read} onChange={(event) => { dispatchPrivileges({ module: "4", privilege: "read", new_value: event.currentTarget.checked }) }} />} label="Ler" />
                <FormControlLabel control={<Checkbox checked={privileges["4"].write} onChange={(event) => { dispatchPrivileges({ module: "4", privilege: "write", new_value: event.currentTarget.checked }) }} />} label="Escrever" />
              </FormGroup>
            </Grid>

            <Grid item>
              <FormLabel component="legend">Equipamentos</FormLabel>
              <FormGroup>
                <FormControlLabel control={<Checkbox checked={privileges["5"].read} onChange={(event) => { dispatchPrivileges({ module: "5", privilege: "read", new_value: event.currentTarget.checked }) }} />} label="Ler" />
                <FormControlLabel control={<Checkbox checked={privileges["5"].write} onChange={(event) => { dispatchPrivileges({ module: "5", privilege: "write", new_value: event.currentTarget.checked }) }} />} label="Escrever" />
              </FormGroup>
            </Grid>
          </Grid>

          <DialogContentText>
            Selecione abaixo os dados que serão requisitados aos usuários vinculados a esse perfil.
          </DialogContentText>

          <Grid container sx={{ mt: 2 }} spacing={1} alignItems="left">

            <Grid item xs={4}>
              <FormGroup>
                <FormControlLabel control={<Checkbox checked={Boolean(accessData["address"])} onChange={(event) => { dispatch({ field: "address", new_value: event.currentTarget.checked }) }} />} label="Endereço" />
              </FormGroup>
            </Grid>

            <Grid item xs={4}>
              <FormGroup>
                <FormControlLabel control={<Checkbox checked={Boolean(accessData["anac_license"])} onChange={(event) => { dispatch({ field: "anac_license", new_value: event.currentTarget.checked }) }} />} label="Licença Anac" />
              </FormGroup>
            </Grid>

            <Grid item xs={4}>
              <FormGroup>
                <FormControlLabel control={<Checkbox checked={Boolean(accessData["cpf"])} onChange={(event) => { dispatch({ field: "cpf", new_value: event.currentTarget.checked }) }} />} label="CPF" />
              </FormGroup>
            </Grid>

            <Grid item xs={4}>
              <FormGroup>
                <FormControlLabel control={<Checkbox checked={Boolean(accessData["cnpj"])} onChange={(event) => { dispatch({ field: "cnpj", new_value: event.currentTarget.checked }) }} />} label="CNPJ" />
              </FormGroup>
            </Grid>

            <Grid item xs={4}>
              <FormGroup>
                <FormControlLabel control={<Checkbox checked={Boolean(accessData["telephone"])} onChange={(event) => { dispatch({ field: "telephone", new_value: event.currentTarget.checked }) }} />} label="Telefone" />
              </FormGroup>
            </Grid>

            <Grid item xs={4}>
              <FormGroup>
                <FormControlLabel control={<Checkbox checked={Boolean(accessData["cellphone"])} onChange={(event) => { dispatch({ field: "cellphone", new_value: event.currentTarget.checked }) }} />} label="Celular" />
              </FormGroup>
            </Grid>

            <Grid item xs={4}>
              <FormGroup>
                <FormControlLabel control={<Checkbox checked={Boolean(accessData["company_name"])} onChange={(event) => { dispatch({ field: "company_name", new_value: event.currentTarget.checked }) }} />} label="Razão Social" />
              </FormGroup>
            </Grid>

            <Grid item xs={4}>
              <FormGroup>
                <FormControlLabel control={<Checkbox checked={Boolean(accessData["trading_name"])} onChange={(event) => { dispatch({ field: "trading_name", new_value: event.currentTarget.checked }) }} />} label="Nome fantasia" />
              </FormGroup>
            </Grid>

          </Grid>

        </DialogContent>

        {(!loading && alert.display) &&
          <Alert severity={alert.type}>{alert.message}</Alert>
        }

        {loading && <LinearProgress />}

        <Divider />
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit" disabled={!canSave} variant="contained" onClick={handleSubmit}>Confirmar</Button>
        </DialogActions>

      </Dialog>
    </>
  );
});
