import * as React from 'react';
// Material UI
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton, Alert, LinearProgress, Divider, Grid } from '@mui/material';
// Custom
import { useAuth } from '../../../../../context/Auth';
import { FormValidation } from '../../../../../../utils/FormValidation';
import { FetchedDataSelection } from '../../../../../shared/input_select/FetchedDataSelection';
import axios from '../../../../../../services/AxiosApi';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

const initialFormData = { name: "", email: "", profile_id: "" };
const initialFormError = { name: { error: false, message: "" }, email: { error: false, message: "" }, profile_id: { error: false, message: "" } };
const initialDisplayAlert = { display: false, type: "", message: "" };

export const UpdateUser = React.memo((props) => {

  // ============================================================================== STATES ============================================================================== //

  const { user } = useAuth();

  const [formData, setFormData] = React.useState({});
  const [formError, setFormError] = React.useState(initialFormError);
  const [displayAlert, setDisplayAlert] = React.useState(initialDisplayAlert);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  // ============================================================================== FUNCTIONS ============================================================================== //

  function handleClickOpen() {
    setOpen(true);
    setFormData({ id: props.record.id, name: props.record.name, email: props.record.email, profile_id: props.record.profile.id });
  }

  function handleClose() {
    setFormData(initialFormData);
    setFormError(initialFormError);
    setDisplayAlert(initialDisplayAlert);
    setLoading(false);
    setOpen(false);
  }

  function handleSubmit() {
    if (!formSubmissionValidation()) return ''

    setLoading(true);
    requestServer();

  }

  function formSubmissionValidation() {

    let validation = Object.assign({}, initialFormError);

    validation["name"] = FormValidation(formData["name"], 3, 255);
    validation["email"] = FormValidation(formData["email"], null, null, /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Email");
    validation["profile_id"] = formData["profile_id"] != "0" ? { error: false, message: "" } : { error: true, message: "Selecione um perfil" };

    setFormError(validation);

    return !(validation.name.error || validation.email.error || validation.profile_id.error);
  }

  async function requestServer() {

    try {

      const response = await axios.patch(`/api/admin-module-user/${formData.id}`, formData);
      successResponse(response);

    } catch (error) {
      errorResponse(error.response);
    } finally {
      setLoading(false);
    }

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
    if (response.status === 422) {
      setDisplayAlert({ display: true, type: "error", message: "Dados inválidos!" });
      let response_errors = {}
      for (let field in response.data.errors) {
        response_errors[field] = {
          error: true,
          message: response.data.errors[field][0]
        }
      }
      setFormError(response_errors);
    } else {
      setDisplayAlert({ display: true, type: "error", message: "Erro do servidor!" });
    }
  }

  function handleInputChange(event) {
    console.log(event.target)
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  // ============================================================================== JSX ============================================================================== //

  return (
    <>
      <Tooltip title="Editar">
        <IconButton disabled={!user.user_powers["1"].profile_powers.write == 1} onClick={handleClickOpen}>
          <FontAwesomeIcon icon={faPen} color={user.user_powers["1"].profile_powers.write == 1 ? "#007937" : "#E0E0E0"} size="sm" />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ style: { borderRadius: 15 } }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>ATUALIZAÇÃO DE USUÁRIO</DialogTitle>
        <Divider />

        <DialogContent>

          <Grid container columns={12} spacing={1}>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="name"
                label="Nome completo"
                fullWidth
                variant="outlined"
                onChange={handleInputChange}
                value={formData.name}
                helperText={formError.name.message}
                error={formError.name.error}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="email"
                label="Endereço de email"
                type="email"
                fullWidth
                variant="outlined"
                onChange={handleInputChange}
                value={formData.email}
                helperText={formError.email.message}
                error={formError.email.error}
              />
            </Grid>

            <Grid item xs={6}>
              <FetchedDataSelection
                label_text={"Perfil"}
                fetch_from={"/api/load-profiles"}
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

        {displayAlert.display &&
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