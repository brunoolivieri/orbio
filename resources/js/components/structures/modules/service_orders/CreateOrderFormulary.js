// React
import * as React from 'react';
// Material UI
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Tooltip } from '@mui/material';
import { IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import { Alert } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
// Custom
import AxiosApi from '../../../../services/AxiosApi';
import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';
import { FormValidation } from '../../../../utils/FormValidation';
import { GenericSelect } from '../../input_select/GenericSelect';
import { DateTimeSingle } from '../../date_picker/DateTimeSingle';
import { StatusRadio } from '../../radio_group/StatusRadio';
import { FlightPlansForServiceOrderModal } from '../../modals/fullscreen/FlightPlansForServiceOrderModal';
// Fontsawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
// Libs
import moment from 'moment';

export const CreateOrderFormulary = React.memo((props) => {

  // ============================================================================== STATES ============================================================================== //

  const { AuthData } = useAuthentication();
  const [controlledInput, setControlledInput] = React.useState({ pilot_id: "0", client_id: "0", observation: "", status: "1" });
  const [fieldError, setFieldError] = React.useState({ start_date: false, end_date: false, pilot_id: false, client_id: false, observation: false, flight_plans: false, status: false });
  const [fieldErrorMessage, setFieldErrorMessage] = React.useState({ start_date: "", end_date: "", pilot_id: "", client_id: "", observation: "", flight_plans: "", status: "" });
  const [displayAlert, setDisplayAlert] = React.useState({ display: false, type: "", message: "" });
  const [loading, setLoading] = React.useState(false);
  const [startDate, setStartDate] = React.useState(moment());
  const [endDate, setEndDate] = React.useState(moment());
  const [open, setOpen] = React.useState(false);
  const [flightPlansSelected, setFlightPlansSelected] = React.useState([]);

  // ============================================================================== FUNCTIONS ============================================================================== //

  const handleClickOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setFieldError({ start_date: false, end_date: false, pilot_id: false, client_id: false, observation: false, flight_plans: false, status: false });
    setFieldErrorMessage({ start_date: "", end_date: "", pilot_id: "", client_id: "", observation: "", flight_plans: "", status: "" });
    setDisplayAlert({ display: false, type: "", message: "" });
    setControlledInput({ pilot_id: "", client_id: "", observation: "", status: "1" });
    setLoading(false);
    setOpen(false);
  };

  const handleRegistrationSubmit = (event) => {
    event.preventDefault();

    if (formularyDataValidate()) {

      if (verifyDateInterval()) {

        setLoading(true);
        requestServerOperation();

      } else {

        setLoading(false);
        setDisplayAlert({ display: true, type: "error", message: "Erro! A data inicial deve anteceder a final." });

      }

    }

  }

  const formularyDataValidate = () => {

    const startDateValidate = startDate != null ? { error: false, message: "" } : { error: true, message: "Selecione a data inicial" };
    const endDateValidate = endDate != null ? { error: false, message: "" } : { error: true, message: "Selecione a data final" };
    const pilotNameValidate = Number(controlledInput.pilot_id) != 0 ? { error: false, message: "" } : { error: true, message: "O piloto deve ser selecionado" };
    const clientNameValidate = Number(controlledInput.client_id) != 0 ? { error: false, message: "" } : { error: true, message: "O cliente deve ser selecionado" };
    const orderNoteValidate = FormValidation(controlledInput.observation, 3, null, null, null);
    const fligthPlansValidate = flightPlansSelected != null ? { error: false, message: "" } : { error: true, message: "" };
    const statusValidate = Number(controlledInput.status) != 0 && Number(controlledInput.status) != 1 ? { error: true, message: "O status deve ser 1 ou 0" } : { error: false, message: "" };

    setFieldError({
      start_date: startDateValidate.error,
      end_date: endDateValidate.error,
      pilot_id: pilotNameValidate.error,
      client_id: clientNameValidate.error,
      observation: orderNoteValidate.error,
      flight_plans: fligthPlansValidate.error,
      status: statusValidate.error
    });

    setFieldErrorMessage({
      start_date: startDateValidate.message,
      end_date: endDateValidate.message,
      pilot_id: pilotNameValidate.message,
      client_id: clientNameValidate.message,
      observation: orderNoteValidate.message,
      flight_plans: fligthPlansValidate.message,
      status: statusValidate.message
    });

    return !(startDateValidate.error || endDateValidate.error || pilotNameValidate.error || clientNameValidate.error || orderNoteValidate.error || fligthPlansValidate.error || statusValidate.error);

  };

  function verifyDateInterval() {

    return moment(startDate).format('YYYY-MM-DD hh:mm:ss') < moment(endDate).format('YYYY-MM-DD hh:mm:ss');

  }

  const requestServerOperation = () => {

    AxiosApi.post(`/api/orders-module`, {
      start_date: moment(startDate).format('YYYY-MM-DD hh:mm:ss'),
      end_date: moment(endDate).format('YYYY-MM-DD hh:mm:ss'),
      pilot_id: controlledInput.pilot_id,
      client_id: controlledInput.client_id,
      observation: controlledInput.observation,
      status: controlledInput.status,
      flight_plans_ids: flightPlansSelected
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
      start_date: { error: false, message: null },
      end_date: { error: false, message: null },
      pilot_id: { error: false, message: null },
      client_id: { error: false, message: null },
      observation: { error: false, message: null },
      status: { error: false, message: null },
      fligth_plans_ids: { error: false, message: null }
    }

    // Coleta dos objetos de erro existentes na response
    for (let prop in response.data.errors) {

      request_errors[prop] = {
        error: true,
        message: response.data.errors[prop][0]
      }

    }

    setFieldError({
      start_date: request_errors.start_date.error,
      end_date: request_errors.end_date.error,
      pilot_id: request_errors.pilot_id.error,
      client_id: request_errors.client_id.error,
      observation: request_errors.observation.error,
      flight_plans: request_errors.fligth_plans_ids.error,
      status: request_errors.status.error
    });

    setFieldErrorMessage({
      start_date: request_errors.start_date.message,
      end_date: request_errors.end_date.message,
      pilot_id: request_errors.pilot_id.message,
      client_id: request_errors.client_id.message,
      observation: request_errors.observation.message,
      flight_plans: request_errors.fligth_plans_ids.message,
      status: request_errors.status.message
    });

  }

  const handleInputChange = (event) => {
    setControlledInput({ ...controlledInput, [event.target.name]: event.currentTarget.value });
  }

  // ============================================================================== STRUCTURES - MUI ============================================================================== //

  return (
    <>
      <Tooltip title="Nova ordem de serviço">
        <IconButton onClick={handleClickOpen} disabled={AuthData.data.user_powers["3"].profile_powers.write == 1 ? false : true}>
          <FontAwesomeIcon icon={faPlus} color={AuthData.data.user_powers["3"].profile_powers.write == 1 ? "#00713A" : "#808991"} size="sm" />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} PaperProps={{ style: { borderRadius: 15 } }} fullWidth>
        <DialogTitle>CADASTRO DE ORDEM DE SERVIÇO</DialogTitle>

        <Box component="form" noValidate onSubmit={handleRegistrationSubmit} >

          <DialogContent>

            <DialogContentText sx={{ mb: 3 }}>
              Formulário para criação de uma ordem de serviço.
            </DialogContentText>

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Box sx={{ mr: 1 }}>
                <DateTimeSingle
                  event={setStartDate}
                  label={"Inicio da ordem de serviço"}
                  helperText={fieldErrorMessage.flight_start_date}
                  error={fieldError.flight_start_date}
                  defaultValue={moment()}
                  operation={"create"}
                  read_only={false}
                />
              </Box>
              <Box>
                <DateTimeSingle
                  event={setEndDate}
                  label={"Término da ordem de serviço"}
                  helperText={fieldErrorMessage.flight_end_date}
                  error={fieldError.flight_end_date}
                  defaultValue={moment()}
                  operation={"create"}
                  read_only={false}
                />
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <GenericSelect
                label_text="Piloto"
                data_source={"/api/load-users?where=profile_id.3"}
                primary_key={"id"}
                key_content={"name"}
                setControlledInput={setControlledInput}
                controlledInput={controlledInput}
                helperText={fieldErrorMessage.pilot_id}
                error={fieldError.pilot_id}
                value={controlledInput.pilot_id}
                name={"pilot_id"}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <GenericSelect
                label_text="Cliente"
                data_source={"/api/load-users?where=profile_id.4"}
                primary_key={"id"}
                key_content={"name"}
                setControlledInput={setControlledInput}
                controlledInput={controlledInput}
                helperText={fieldErrorMessage.client_id}
                error={fieldError.client_id}
                value={controlledInput.client_id}
                name={"client_id"}
              />
            </Box>

            <Box sx={{ mb: 2 }}>

              <FlightPlansForServiceOrderModal
                setFlightPlansSelected={setFlightPlansSelected}
                flightPlansSelected={flightPlansSelected}
                serviceOrderId={null}
              />

            </Box>

            <TextField
              type="text"
              margin="dense"
              label="Observação"
              fullWidth
              variant="outlined"
              id="observation"
              name="observation"
              onChange={handleInputChange}
              helperText={fieldErrorMessage.observation}
              error={fieldError.observation}
              sx={{ mb: 2 }}
            />

            <Box>
              <StatusRadio
                default={1}
                setControlledInput={setControlledInput}
                controlledInput={controlledInput}
              />
            </Box>

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

      </Dialog>
    </>
  );

});