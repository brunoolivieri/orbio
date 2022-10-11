// React
import * as React from 'react';
// Material UI
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Tooltip } from '@mui/material';
import { IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import { Alert } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import Grid from '@mui/material/Grid';
import FormHelperText from '@mui/material/FormHelperText';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
// Libs
import moment from 'moment';
// Custom
import { DatePicker } from '../../date_picker/DatePicker';
import AxiosApi from '../../../../services/AxiosApi';
import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';
import { FormValidation } from '../../../../utils/FormValidation';
import { GenericSelect } from '../../input_select/GenericSelect';

export const CreateIncidentFormulary = React.memo((props) => {

  // ============================================================================== STATES ============================================================================== //

  const { AuthData } = useAuthentication();
  const [controlledInput, setControlledInput] = React.useState({ flight_plan_id: "", service_order_id: "", type: "", description: "", date: "" });
  const [fieldError, setFieldError] = React.useState({ flight_plan_id: false, service_order_id: false, date: false, type: false, description: false });
  const [fieldErrorMessage, setFieldErrorMessage] = React.useState({ flight_plan_id: "", service_order_id: "", date: "", type: "", description: "" });
  const [displayAlert, setDisplayAlert] = React.useState({ display: false, type: "", message: "" });
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  // ============================================================================== FUNCTIONS ============================================================================== //

  const handleClickOpen = () => {
    setOpen(true);
    setControlledInput({ flight_plan_id: "0", service_order_id: "0", type: "", description: "", date: moment() });
  }

  const handleClose = () => {
    setFieldError({ date: false, type: false, description: false });
    setFieldErrorMessage({ date: "", type: "", description: "" });
    setDisplayAlert({ display: false, type: "", message: "" });
    setControlledInput({ type: "", description: "" });
    setLoading(false);
    setOpen(false);
  }

  const handleRegistrationSubmit = (event) => {
    event.preventDefault();

    if (formularyDataValidation()) {

      setLoading(true);
      requestServerOperation();

    }

  }

  const formularyDataValidation = () => {

    const incidentDateValidate = controlledInput.date != null ? { error: false, message: "" } : { error: true, message: "Selecione a data inicial" };
    const incidentTypeValidate = FormValidation(controlledInput.type, 2, null, null, null);
    const incidentNoteValidate = FormValidation(controlledInput.description, 3, null, null, null);
    const incidentFlightPlanValidate = controlledInput.flight_plan_id != "0" ? { error: false, message: "" } : { error: false, message: "O plano de voo precisa ser selecionado" };
    const incidentDateFlightPlanServiceOrderValidate = controlledInput.service_order_id != "0" ? { error: false, message: "" } : { error: false, message: "A ordem de serviço precisa ser selecionada" }

    setFieldError({ flight_plan_id: incidentFlightPlanValidate.error, service_order_id: incidentDateFlightPlanServiceOrderValidate.error, date: incidentDateValidate.error, type: incidentTypeValidate.error, description: incidentNoteValidate.error });
    setFieldErrorMessage({ flight_plan_id: incidentFlightPlanValidate.message, service_order_id: incidentDateFlightPlanServiceOrderValidate.message, date: incidentDateValidate.message, type: incidentTypeValidate.message, description: incidentNoteValidate.message });

    return !(incidentFlightPlanValidate.error || incidentDateFlightPlanServiceOrderValidate.error || incidentDateValidate.error || incidentTypeValidate.error || incidentNoteValidate.error);

  }

  const requestServerOperation = () => {

    AxiosApi.post(`/api/incidents-module`, controlledInput)
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
      props.reload_table();
      setLoading(false);
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
      description: { error: false, message: null }
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
      description: request_errors.description.error
    });

    setFieldErrorMessage({
      date: request_errors.date.message,
      type: request_errors.type.message,
      description: request_errors.description.message
    });

  }

  const handleInputChange = (event) => {
    setControlledInput({ ...controlledInput, [event.target.name]: event.currentTarget.value });
  }

  // ============================================================================== STRUCTURES ============================================================================== //

  return (
    <>

      <Tooltip title="Novo incidente">
        <IconButton onClick={handleClickOpen} disabled={AuthData.data.user_powers["5"].profile_powers.write == 1 ? false : true}>
          <FontAwesomeIcon icon={faPlus} color={AuthData.data.user_powers["5"].profile_powers.write == 1 ? "#007937" : "#808991"} size="sm" />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} PaperProps={{ style: { borderRadius: 15 } }} fullWidth>
        <DialogTitle>CADASTRO DE INCIDENTE</DialogTitle>

        <Box component="form" noValidate onSubmit={handleRegistrationSubmit} >

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

              <Grid item xs={6}>
                <GenericSelect
                  label_text="Plano de voo"
                  data_source={"/api/load-flight-plans"}
                  primary_key={"id"}
                  key_content={"name"}
                  setControlledInput={setControlledInput}
                  controlledInput={controlledInput}
                  error={fieldError.flight_plan_id}
                  name={"flight_plan_id"}
                  value={controlledInput.flight_plan_id}
                />
                <FormHelperText error>{fieldErrorMessage.flight_plan_id}</FormHelperText>
              </Grid>

              <Grid item xs={6}>
                {controlledInput.flight_plan_id != "0" &&
                  <>
                    <GenericSelect
                      label_text={"Ordem de serviço"}
                      data_source={`/api/load-service-orders-by-flight-plan?flight_plan_id=${controlledInput.flight_plan_id}`}
                      primary_key={"id"}
                      key_content={"number"}
                      setControlledInput={setControlledInput}
                      controlledInput={controlledInput}
                      error={fieldError.service_order_id}
                      name={"service_order_id"}
                      value={controlledInput.service_order_id}
                    />
                    <FormHelperText error>{fieldErrorMessage.service_order_id}</FormHelperText>
                  </>

                }
              </Grid>

            </Grid>

          </DialogContent>

          {
            (!loading && displayAlert.display) &&
            <Alert severity={displayAlert.type}>{displayAlert.message}</Alert>
          }

          {loading && <LinearProgress />}

          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={loading} variant="contained">Confirmar</Button>
          </DialogActions>

        </Box >

      </Dialog >

    </>
  )

});