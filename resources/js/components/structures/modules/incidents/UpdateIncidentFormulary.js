// React
import * as React from 'react';
// Material UI
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import { Alert } from '@mui/material';
import { IconButton } from '@mui/material';
import { Tooltip } from "@mui/material";
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import FormHelperText from '@mui/material/FormHelperText';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
// Outros
import moment from 'moment';
// Custom
import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';
import { FormValidation } from '../../../../utils/FormValidation';
import AxiosApi from '../../../../services/AxiosApi';
import { DatePicker } from '../../date_picker/DatePicker';
import { SelectExternalData } from '../../input_select/SelectExternalData';

export const UpdateIncidentFormulary = React.memo((props) => {

  React.useEffect(() => {
    setSelectedServiceOrder("0");
  }, [selectedFlightPlan])

  // ============================================================================== STATES ============================================================================== //

  const { AuthData } = useAuthentication();
  const [controlledInput, setControlledInput] = React.useState({ id: "", type: "", description: "", date: "" });
  const [fieldError, setFieldError] = React.useState({ date: false, type: false, description: false });
  const [fieldErrorMessage, setFieldErrorMessage] = React.useState({ date: "", type: "", description: "" });
  const [displayAlert, setDisplayAlert] = React.useState({ display: false, type: "", message: "" });
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

    setFieldError({ date: false, type: false, description: false });
    setFieldErrorMessage({ date: "", type: "", description: "" });
    setDisplayAlert({ display: false, type: "", message: "" });
    setControlledInput({ id: props.record.id, type: props.record.type, description: props.record.description, date: props.record.date });

    AxiosApi.get("/api/load-flight-plans", {
    })
      .then(function (response) {
        setFlightPlans(response.data);
        setSelectedFlightPlan(props.record.service_order.flight_plan.id);
        setSelectedServiceOrder(props.record.service_order.id);
      })
      .catch(function (error) {
        setLoading(false);
        errorServerResponseTreatment(error.response);
      });
  }

  const handleClose = () => {
    setOpen(false);
  }

  React.useEffect(() => {

    const url = "/api/load-service-orders-by-flight-plan?flight_plan_id=" + selectedFlightPlan;

    AxiosApi.get(url, {
    })
      .then(function (response) {
        setServiceOrdersByFlightPlan(response.data);
      })
      .catch(function (error) {
        setLoading(false);
        errorServerResponseTreatment(error.response);
      });

  }, [selectedFlightPlan]);

  const handleSubmitOperation = (event) => {
    event.preventDefault();

    if (formularyDataValidation()) {

      setLoading(true);
      requestServerOperation();

    }

  }

  const formularyDataValidation = () => {

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

    AxiosApi.patch(`/api/incidents-module/${controlledInput.id}`, {
      date: moment(controlledInput.date).format('YYYY-MM-DD'),
      type: controlledInput.type,
      description: controlledInput.description,
      flight_plan_id: selectedFlightPlan,
      service_order_id: selectedServiceOrder
    })
      .then(function (response) {

        setLoading(false);
        successServerResponseTreatment(response);

      })
      .catch(function (error) {

        setLoading(false);
        errorServerResponseTreatment(error.response);

      });

  }

  const successServerResponseTreatment = (response) => {

    setDisplayAlert({ display: true, type: "success", message: response.data.message });

    setTimeout(() => {
      props.record_setter(null);
      props.reload_table();
      handleClose();
    }, 2000);

  }

  const errorServerResponseTreatment = (response) => {

    const error_message = response.data.message ? response.data.message : "Erro do servidor";
    setDisplayAlert({ display: true, type: "error", message: error_message });

    // Definição dos objetos de erro possíveis de serem retornados pelo validation do Laravel
    let request_errors = {
      date: { error: false, message: null },
      type: { error: false, message: null },
      description: { error: false, message: null },
      flight_plan_id: { error: false, message: null },
      service_order_id: { error: false, message: null }
    }

    // Coleta dos objetos de erro existentes na response
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
        <IconButton disabled={AuthData.data.user_powers["5"].profile_powers.read == 1 ? false : true} onClick={handleClickOpen}>
          <FontAwesomeIcon icon={faPen} color={AuthData.data.user_powers["5"].profile_powers.read == 1 ? "#007937" : "#808991"} size="sm" />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} PaperProps={{ style: { borderRadius: 15 } }} fullWidth>
        <DialogTitle>ATUALIZAÇÃO | INCIDENTE (ID: {props.record.id})</DialogTitle>

        <Box component="form" noValidate onSubmit={handleSubmitOperation} >
          <DialogContent>

            <Grid item container spacing={1}>

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

          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={loading} variant="contained">Confirmar</Button>
          </DialogActions>

        </Box>

      </Dialog >

    </>
  )

})