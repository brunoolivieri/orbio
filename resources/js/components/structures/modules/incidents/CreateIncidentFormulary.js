import * as React from 'react';
// Material UI
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton, Alert, LinearProgress, TextField, Grid, FormHelperText, Divider } from '@mui/material';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
// Libs
import moment from 'moment';
// Custom
import { DatePicker } from '../../date_picker/DatePicker';
import axios from '../../../../services/AxiosApi';
import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';
import { FormValidation } from '../../../../utils/FormValidation';
import { SelectExternalData } from '../../input_select/SelectExternalData';

const initialControlledInput = { type: "", description: "", date: moment() };
const initialFieldError = { name: false, description: false };
const initialFieldErrorMessage = { name: "", description: "" };
const initialDisplatAlert = { display: false, type: "", message: "" };

export const CreateIncidentFormulary = React.memo((props) => {

  // ============================================================================== STATES ============================================================================== //

  const { AuthData } = useAuthentication();
  const [controlledInput, setControlledInput] = React.useState(initialControlledInput);
  const [fieldError, setFieldError] = React.useState(initialFieldError);
  const [fieldErrorMessage, setFieldErrorMessage] = React.useState(initialFieldErrorMessage);
  const [displayAlert, setDisplayAlert] = React.useState(initialDisplatAlert);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  // Select Inputs
  const [serviceOrdersByFlightPlan, setServiceOrdersByFlightPlan] = React.useState([]);
  const [flightPlans, setFlightPlans] = React.useState([]);
  const [selectedFlightPlan, setSelectedFlightPlan] = React.useState("0");
  const [selectedServiceOrder, setSelectedServiceOrder] = React.useState("0");

  // ============================================================================== FUNCTIONS ============================================================================== //

  const handleClickOpen = () => {
    setOpen(true);
    axios.get("/api/load-flight-plans", {
    })
      .then(function (response) {
        setFlightPlans(response.data);
        setSelectedFlightPlan("0");
        setSelectedServiceOrder("0");
      })
      .catch(function (error) {
        setLoading(false);
        errorResponse(error.response);
      });
  }

  const handleClose = () => {
    setOpen(false);
    setLoading(false);
    setFieldError(initialFieldError);
    setFieldErrorMessage(initialFieldErrorMessage);
    setDisplayAlert(initialDisplatAlert);
    setControlledInput(initialControlledInput);
  }

  React.useEffect(() => {
    const url = "/api/load-service-orders-by-flight-plan?flight_plan_id=" + selectedFlightPlan;
    axios.get(url, {
    })
      .then(function (response) {
        setServiceOrdersByFlightPlan(response.data);
      })
      .catch(function (error) {
        setLoading(false);
        errorResponse(error.response);
      });
  }, [selectedFlightPlan]);

  const handleSubmit = () => {
    if (formValidation()) {
      setLoading(true);
      requestServerOperation();
    }
  }

  const formValidation = () => {
    const incidentDateValidate = controlledInput.date != null ? { error: false, message: "" } : { error: true, message: "Selecione a data inicial" };
    const incidentTypeValidate = FormValidation(controlledInput.type, 2, null, null, null);
    const incidentNoteValidate = FormValidation(controlledInput.description, 3, null, null, null);
    const incidentFlightPlanValidate = selectedFlightPlan != "0" ? { error: false, message: "" } : { error: false, message: "O plano de voo precisa ser selecionado" };
    const incidentDateFlightPlanServiceOrderValidate = selectedServiceOrder != "0" ? { error: false, message: "" } : { error: false, message: "A ordem de serviço precisa ser selecionada" }

    setFieldError({ flight_plan_id: incidentFlightPlanValidate.error, service_order_id: incidentDateFlightPlanServiceOrderValidate.error, date: incidentDateValidate.error, type: incidentTypeValidate.error, description: incidentNoteValidate.error });
    setFieldErrorMessage({ flight_plan_id: incidentFlightPlanValidate.message, service_order_id: incidentDateFlightPlanServiceOrderValidate.message, date: incidentDateValidate.message, type: incidentTypeValidate.message, description: incidentNoteValidate.message });

    return !(incidentFlightPlanValidate.error || incidentDateFlightPlanServiceOrderValidate.error || incidentDateValidate.error || incidentTypeValidate.error || incidentNoteValidate.error);
  }

  const requestServerOperation = () => {
    axios.post(`/api/incidents-module`, {
      date: moment(controlledInput.date).format('YYYY-MM-DD'),
      type: controlledInput.type,
      description: controlledInput.description,
      flight_plan_id: selectedFlightPlan,
      service_order_id: selectedServiceOrder
    })
      .then(function (response) {
        successResponse(response);
      })
      .catch(function (error) {
        errorResponse(error.response);
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

  function errorResponse(response) {
    setDisplayAlert({ display: true, type: "error", message: response.data.message });

    let request_errors = {
      date: { error: false, message: null },
      type: { error: false, message: null },
      description: { error: false, message: null }
    }

    for (let prop in response.data.errors) {
      request_errors[prop] = {
        error: true,
        message: response.data.errors[prop][0]
      }
    }

    setFieldError({
      date: request_errors.date.error,
      type: request_errors.type.error,
      description: request_errors.description.error
    });

    setFieldErrorMessage({
      date: request_errors.date.message,
      type: request_errors.type.message,
      description: request_errors.description.message
    });
  }

  function handleInputChange(event) {
    setControlledInput({ ...controlledInput, [event.target.name]: event.currentTarget.value });
  }

  // ============================================================================== STRUCTURES ============================================================================== //

  return (
    <>
      <Tooltip title="Novo incidente">
        <IconButton onClick={handleClickOpen} disabled={!AuthData.data.user_powers["5"].profile_powers.write == 1}>
          <FontAwesomeIcon icon={faPlus} color={AuthData.data.user_powers["5"].profile_powers.write == 1 ? "#007937" : "#E0E0E0"} size="sm" />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ style: { borderRadius: 15 } }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>CADASTRO DE INCIDENTE</DialogTitle>
        <Divider />

        <DialogContent>
          <Grid item container spacing={1} mt={1}>

            <Grid item xs={12}>
              <DatePicker
                setControlledInput={setControlledInput}
                controlledInput={controlledInput}
                name={"date"}
                label={"Data do incidente"}
                error={fieldError.date}
                value={controlledInput.date}
                operation={"create"}
                read_only={false}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                type="text"
                margin="dense"
                label="Tipo do incidente"
                fullWidth
                variant="outlined"
                name="type"
                onChange={handleInputChange}
                helperText={fieldErrorMessage.type}
                error={fieldError.type}
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
                onChange={handleInputChange}
                helperText={fieldErrorMessage.description}
                error={fieldError.description}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <SelectExternalData
                label_text={"Plano de voo"}
                primary_key={"id"}
                key_content={"name"}
                setter={setSelectedFlightPlan}
                options={flightPlans}
                error={fieldError.flight_plan_id}
                value={selectedFlightPlan}
              />
              <FormHelperText error>{fieldErrorMessage.flight_plan_id}</FormHelperText>
            </Grid>

            <Grid item xs={12} md={6}>
              <SelectExternalData
                label_text={"Ordem de serviço"}
                primary_key={"id"}
                key_content={"number"}
                setter={setSelectedServiceOrder}
                options={serviceOrdersByFlightPlan}
                error={fieldError.service_order_id}
                value={selectedServiceOrder}
              />
              <FormHelperText error>{fieldErrorMessage.service_order_id}</FormHelperText>
            </Grid>
          </Grid>
        </DialogContent>

        {
          (!loading && displayAlert.display) &&
          <Alert severity={displayAlert.type}>{displayAlert.message}</Alert>
        }

        {loading && <LinearProgress />}

        <Divider />
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button disabled={loading} variant="contained" onClick={handleSubmit}>Confirmar</Button>
        </DialogActions>
      </Dialog >
    </>
  )
});