import * as React from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip, IconButton, Alert, LinearProgress, Divider, Grid } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from '../../../../../services/AxiosApi';
import { FetchedDataSelection } from '../../../../../components/input_select/FetchedDataSelection';
import { useAuth } from '../../../../../context/Auth';
import { FormValidation } from '../../../../../utils/FormValidation';

const initialFormData = { name: "", email: "", profile_id: "0" };
const initialFormError = { name: { error: false, message: "" }, email: { error: false, message: "" }, profile_id: { error: false, message: "" } }
const initialDisplayAlert = { display: false, type: "", message: "" };

export const CreateUser = React.memo((props) => {

  // ============================================================================== STATES ============================================================================== //

  const { user } = useAuth();
  const [formData, setFormData] = React.useState(initialFormData);
  const [formError, setFormError] = React.useState(initialFormError);
  const [alert, setAlert] = React.useState(initialDisplayAlert);
  const [loading, setLoading] = React.useState(false);
  const [canSave, setCanSave] = React.useState(true);
  const [open, setOpen] = React.useState(false);

  const is_authorized = !!user.user_powers["1"].profile_powers.write;

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
    validation["email"] = FormValidation(formData["email"], null, null, /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Email");
    validation["profile_id"] = formData["profile_id"] != "0" ? { error: false, message: "" } : { error: true, message: "Selecione um perfil" }

    setFormError(validation);

    return !(validation.name.error || validation.email.error || validation.profile_id.error);
  }

  async function requestServer() {
    try {
      const response = await axios.post("api/module/administration-user", formData);
      successResponse(response);
    } catch (error) {
      console.log(error);
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
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  // ============================================================================== JSX ============================================================================== //

  return (
    <>
      <Tooltip title="Novo Usuário">
        <IconButton onClick={handleClickOpen} disabled={!is_authorized} >
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
        <DialogTitle>CADASTRO DE USUÁRIO</DialogTitle>
        <Divider />

        <DialogContent>

          <DialogContentText mb={2}>
            O usuário criado receberá um e-mail com os dados de acesso.
          </DialogContentText>

          <Grid container columns={12} spacing={1}>

            <Grid item xs={12}>
              <TextField
                margin="dense"
                label="Nome completo"
                fullWidth
                variant="outlined"
                required
                name="name"
                onChange={handleInputChange}
                helperText={formError.name.message}
                error={formError.name.error}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                type="email"
                margin="dense"
                label="Endereço de email"
                fullWidth
                variant="outlined"
                required
                name="email"
                onChange={handleInputChange}
                helperText={formError.email.message}
                error={formError.email.error}
              />
            </Grid>

            <Grid item xs={6}>
              <FetchedDataSelection
                label_text={"Perfil"}
                fetch_from={"/api/action/load-profiles"}
                primary_key={"id"}
                key_content={"name"}
                name={"profile_id"}
                error={formError.profile_id.error}
                errorMessage={formError.profile_id.message}
                selected={formData.profile_id}
                handleChange={handleInputChange}
              />
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
