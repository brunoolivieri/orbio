import * as React from 'react';
// Material UI
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton, Alert, LinearProgress, TextField, Grid, FormHelperText, Divider } from '@mui/material';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
// Outros
import moment from 'moment';
// Custom
import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';
import { FormValidation } from '../../../../utils/FormValidation';
import axios from '../../../../services/AxiosApi';
import { DatePicker } from '../../date_picker/DatePicker';
import { SelectExternalData } from '../../input_select/SelectExternalData';

const initialFieldError = { date: false, type: false, description: false };
const initialFieldErrorMessage = { date: "", type: "", description: "" };
const initialDisplayAlert = { display: false, type: "", message: "" };

export const UpdateIncidentFormulary = React.memo((props) => {

  React.useEffect(() => {
    setSelectedServiceOrder("0");
  }, [selectedFlightPlan])

  // ============================================================================== STATES ============================================================================== //

  const { AuthData } = useAuthentication();

  const [controlledInput, setControlledInput] = React.useState({ id: props.record.id, type: props.record.type, description: props.record.description, date: props.record.date });
  const [fieldError, setFieldError] = React.useState(initialFieldError);
  const [fieldErrorMessage, setFieldErrorMessage] = React.useState(initialFieldErrorMessage);
  const [displayAlert, setDisplayAlert] = React.useState(initialDisplayAlert);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  // Select Inputs
  const [serviceOrdersByFlightPlan, setServiceOrdersByFlightPlan] = React.useState([]);
  const [flightPlans, setFlightPlans] = React.useState([]);
  const [selectedFlightPlan, setSelectedFlightPlan] = React.useState("");
  const [selectedServiceOrder, setSelectedServiceOrder] = React.useState("");

  // ============================================================================== FUNCTIONS ============================================================================== //

  const handleClickOpen = () => {
    setOpen(true);
    setLoading(false);
    setFieldError(initialFieldError);
    setFieldErrorMessage(initialFieldErrorMessage);
    setDisplayAlert(initialDisplayAlert);

    axios.get("/api/load-flight-plans", {
    })
      .then(function (response) {
        setFlightPlans(response.data);
        setSelectedFlightPlan(props.record.service_order.flight_plan.id);
        setSelectedServiceOrder(props.record.service_order.id);
      })
      .catch(function (error) {
        setLoading(false);
        errorResponse(error.response);
      });
  }

  const handleClose = () => {
    setOpen(false);
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
    const date_validate = controlledInput.date != null ? { error: false, message: "" } : { error: true, message: "Selecione a data inicial" };
    const type_validate = FormValidation(controlledInput.type, 2, null, null, null);
    const observation_validate = FormValidation(controlledInput.description, 3, null, null, null);
    const flight_plan_validate = selectedFlightPlan != "0" ? { error: false, message: "" } : { error: true, message: "Selecione um plano de voo" };
    const service_order_validate = selectedServiceOrder != "0" ? { error: false, message: "" } : { error: true, message: "Selecione uma ordem de serviço" };

    setFieldError({ date: date_validate.error, type: type_validate.error, description: observation_validate.error, flight_plan_id: flight_plan_validate.error, service_order_id: service_order_validate.error });
    setFieldErrorMessage({ date: date_validate.message, type: type_validate.message, description: observation_validate.message, flight_plan_id: flight_plan_validate.message, service_order_id: service_order_validate.message });

    return !(date_validate.error || type_validate.error || observation_validate.error || flight_plan_validate.error || service_order_validate.error);
  }

  const requestServerOperation = () => {
    axios.patch(`/api/incidents-module/${controlledInput.id}`, {
      date: moment(controlledInput.date).format('YYYY-MM-DD'),
      type: controlledInput.type,
      description: controlledInput.description,
      flight_plan_id: selectedFlightPlan,
      service_order_id: selectedServiceOrder
    })
      .then(function (response) {
        setLoading(false);
        successResponse(response);
      })
      .catch(function (error) {
        setLoading(false);
        errorResponse(error.response);
      });
  }

  const successResponse = (response) => {
    setDisplayAlert({ display: true, type: "success", message: response.data.message });
    setTimeout(() => {
      props.reloadTable((old) => !old);
      handleClose();
    }, 2000);
  }

  const errorResponse = (response) => {
    setDisplayAlert({ display: true, type: "error", message: response.data.message });

    let request_errors = {
      date: { error: false, message: null },
      type: { error: false, message: null },
      description: { error: false, message: null },
      flight_plan_id: { error: false, message: null },
      service_order_id: { error: false, message: null }
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
      description: request_errors.description.error,
      flight_plan_id: request_errors.flight_plan_id.error,
      service_order_id: request_errors.service_order_id.error
    });

    setFieldErrorMessage({
      date: request_errors.date.message,
      type: request_errors.type.message,
      description: request_errors.description.message,
      flight_plan_id: request_errors.flight_plan_id.message,
      service_order_id: request_errors.service_order_id.message
    });
  }

  const handleInputChange = (event) => {
    setControlledInput({ ...controlledInput, [event.target.name]: event.currentTarget.value });
  }

  // ============================================================================== STRUCTURES - MUI ============================================================================== //

  return (
    <>
      <Tooltip title="Editar">
        <IconButton disabled={!AuthData.data.user_powers["5"].profile_powers.read == 1} onClick={handleClickOpen}>
          <FontAwesomeIcon icon={faPen} color={AuthData.data.user_powers["5"].profile_powers.read == 1 ? "#007937" : "#E0E0E0"} size="sm" />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ style: { borderRadius: 15 } }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>ATUALIZAÇÃO DO INCIDENTE</DialogTitle>
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
                value={controlledInput.type}
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
                value={controlledInput.description}
                onChange={handleInputChange}
                helperText={fieldErrorMessage.description}
                error={fieldError.description}
              />
            </Grid>

            <Grid item xs={6}>
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

            <Grid item xs={6}>
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

        {(!loading && displayAlert.display) &&
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
})