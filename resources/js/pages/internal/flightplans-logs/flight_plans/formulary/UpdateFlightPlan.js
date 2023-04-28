import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton, Alert, LinearProgress, TextField, Divider, Grid, Checkbox, FormControlLabel, Link } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../../../../context/Auth';
import { FormValidation } from '../../../../../utils/FormValidation';
import axios from '../../../../../services/AxiosApi';

const fieldError = { error: false, message: "" }
const initialFormError = { name: fieldError, description: fieldError, service_order_id: fieldError, log_id: fieldError };
const initialDisplayAlert = { display: false, type: "", message: "" };

export const UpdateFlightPlan = React.memo((props) => {

  console.log(props.record)

  // ============================================================================== STATES ============================================================================== //

  const { user } = useAuth();
  const [formData, setFormData] = React.useState({ id: props.record.id, name: props.record.name, description: props.record.description, undelete: false });
  const [formError, setFormError] = React.useState(initialFormError);
  const [alert, setAlert] = React.useState(initialDisplayAlert);
  const [loading, setLoading] = React.useState(false);
  const [canSave, setCanSave] = React.useState(true);
  const [open, setOpen] = React.useState(false);

  const is_authorized = !!user.user_powers["2"].profile_powers.write;

  // ============================================================================== FUNCTIONS ============================================================================== //

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setFormError(initialFormError);
    setAlert({ display: false, type: "", message: "" });
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

    for (let field in formData) {
      if (field != "service_order_id" && field != "log_id") {
        validation[field] = FormValidation(formData[field], 3, 255);
      }
    }

    setFormError(validation);

    return !(validation.name.error || validation.description.error);
  }

  async function requestServer() {
    try {
      const response = await axios.patch(`api/module/flight-plans/${formData.id}`, formData);
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

  // ============================================================================== JSX ============================================================================== //

  return (
    <>
      <Tooltip title="Editar">
        <IconButton disabled={!is_authorized} onClick={handleClickOpen}>
          <FontAwesomeIcon icon={faPen} color={is_authorized ? "#007937" : "#E0E0E0"} size="sm" />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ style: { borderRadius: 15 } }}
        fullWidth
        maxWidth="xl"
      >
        <DialogTitle>ATUALIZAÇÃO DE PLANO DE VOO</DialogTitle>
        <Divider />

        <DialogContent>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="name"
                label="Nome do plano"
                type="text"
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
                name="description"
                label="Descrição"
                type="text"
                fullWidth
                variant="outlined"
                onChange={handleInputChange}
                value={formData.description}
                helperText={formError.description.message}
                error={formError.description.error}
              />
            </Grid>

            <Grid item xs={12}>
              {props.record.is_route_editable ?
                <Link href={`${window.location.origin}/map?modify=true&op=update&flightplan=${formData.id}`} target="_blank">
                  <Button variant="contained">Alterar rota</Button>
                </Link>
                :
                <Button variant="contained" disabled>Alterar rota</Button>
              }

            </Grid>

            {props.record.deleted_at &&
              <Grid item xs={12}>
                <FormControlLabel name="undelete" control={<Checkbox />} label="Recuperar" onChange={(e) => setFormData({ ...formData, ["undelete"]: e.target.checked })} />
              </Grid>
            }
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