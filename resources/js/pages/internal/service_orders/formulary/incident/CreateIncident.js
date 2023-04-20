import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton, Alert, LinearProgress, Grid, Divider, TextField } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import axios from '../../../../../services/AxiosApi';
import { FormValidation } from '../../../../../utils/FormValidation';
import { DatePicker } from '../../../../../components/date_picker/DatePicker';

const initialFormData = { type: "", description: "", date: moment() };
const fieldError = { error: false, message: "" }
const initialFormError = { type: fieldError, description: fieldError, date: fieldError }
const initialDisplayAlert = { display: false, type: "", message: "" };

export const CreateIncident = React.memo((props) => {

  // ============================================================================== STATES ============================================================================== //

  const [formData, setFormData] = React.useState(initialFormData);
  const [formError, setFormError] = React.useState(initialFormError);
  const [alert, setAlert] = React.useState(initialDisplayAlert);
  const [loading, setLoading] = React.useState(false);
  const [canSave, setCanSave] = React.useState(true);
  const [open, setOpen] = React.useState(false);

  // ============================================================================== FUNCTIONS ============================================================================== //

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setLoading(false);
    setFormData(initialFormData);
    setFormError(initialFormError);
    setAlert(initialDisplayAlert);
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

    validation["type"] = FormValidation(formData["type"], 3, 255);
    validation["date"] = formData.date != null ? { error: false, message: "" } : { error: true, message: "Selecione a data inicial" };
    validation["description"] = FormValidation(formData["description"], 3, 255);

    setFormError(validation);

    return !(validation.type.error || validation.date.error || validation.description.error);
  }

  async function requestServer() {

    try {

      const response = await axios.post("api/action/service-order/incidents", {
        date: moment(formData.date).format('YYYY-MM-DD'),
        type: formData.type,
        description: formData.description,
        serviceOrderId: props.serviceOrderId,
        flightPlanId: props.flightPlanId
      });

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
      <Tooltip title="Novo incidente">
        <IconButton onClick={handleOpen}>
          <FontAwesomeIcon icon={faPlus} color="#007937" size="sm" />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ style: { borderRadius: 15 } }}
        fullWidth
        maxWidth="xl"
      >
        <DialogTitle>CADASTRO DE INCIDENTE</DialogTitle>
        <Divider />

        <DialogContent>
          <Grid item container spacing={1} mt={1}>

            <Grid item xs={12}>
              <DatePicker
                label={"Data"}
                name={"date"}
                value={formData.date}
                setFormData={setFormData}
                formData={formData}
                errorMessage={formError.date.message}
              />
            </Grid>


            <Grid item xs={12}>
              <TextField
                type="text"
                margin="dense"
                label="Tipo"
                fullWidth
                variant="outlined"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                helperText={formError.type.message}
                error={formError.type.error}
              />
            </Grid>


            <Grid item xs={12} mb={1}>
              <TextField
                type="text"
                margin="dense"
                label="Descrição"
                fullWidth
                variant="outlined"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                helperText={formError.description.message}
                error={formError.description.error}
              />
            </Grid>

          </Grid>
        </DialogContent>

        {
          (!loading && alert.display) &&
          <Alert severity={alert.type}>{alert.message}</Alert>
        }

        {loading && <LinearProgress />}

        <Divider />
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button disabled={!canSave} variant="contained" onClick={handleSubmit}>Confirmar</Button>
        </DialogActions>
      </Dialog >
    </>
  )
});