import * as React from 'react';
// Material UI
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton, Alert, LinearProgress, Divider, Grid } from '@mui/material';
// Custom
import { useAuth } from '../../../../../context/Auth';
import { FormValidation } from '../../../../../../utils/FormValidation';
import { SelectAttributeControl } from '../../../../../shared/input_select/SelectAttributeControl';
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

  const [formData, setFormData] = React.useState({ id: props.record.id, name: props.record.name, email: props.record.email, profile_id: props.record.profile.id });
  const [formError, setFormError] = React.useState(initialFormError);
  const [displayAlert, setDisplayAlert] = React.useState(initialDisplayAlert);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  // ============================================================================== FUNCTIONS ============================================================================== //

  function handleClickOpen() {
    setOpen(true);
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

    for (let field in formData) {
      if (field === "name") {
        validation[field] = FormValidation(formData[field], 3, 255, null, "Nome");
      } else if (field === "email") {
        validation[field] = FormValidation(formData[field], null, null, /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Email");
      } else if (field === "profile_id") {
        validation[field] = formData[field] != "0" ? { error: false, message: "" } : { error: true, message: "Selecione um perfil" }
      }
    }

    setFormError(validation);

    return !(validation.name.error || validation.email.error || validation.profile.error);
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
    setDisplayAlert({ display: true, type: "error", message: response.data.message });

    let response_errors = {};
    for (let field in response.data.errors) {
      response_errors[field] = {
        error: true,
        message: response.data.errors[field][0]
      }
    }

    setFormError(response_errors);
  }

  function handleInputChange(event) {
    setFormData({ ...formData, [event.target.name]: event.currentTarget.value });
  }

  // ============================================================================== JSX ============================================================================== //

  return (
    <>
      <Tooltip title="Editar">
        <IconButton disabled={!user.data.user_powers["1"].profile_powers.write == 1} onClick={handleClickOpen}>
          <FontAwesomeIcon icon={faPen} color={user.data.user_powers["1"].profile_powers.write == 1 ? "#007937" : "#E0E0E0"} size="sm" />
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
              <SelectAttributeControl
                label_text={"Perfil"}
                data_source={"/api/load-profiles"}
                primary_key={"id"}
                key_content={"name"}
                name={"profile"}
                onChange={handleInputChange}
                error={formError.profile_id.error}
                value={formData.profile_id}
                setControlledInput={setFormData}
                controlledInput={formData}
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