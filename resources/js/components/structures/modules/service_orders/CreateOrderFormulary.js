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
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import FormHelperText from '@mui/material/FormHelperText';
import Avatar from '@mui/material/Avatar';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import MapIcon from '@mui/icons-material/Map';
import SettingsIcon from '@mui/icons-material/Settings';
// Custom
import AxiosApi from '../../../../services/AxiosApi';
import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';
import { FormValidation } from '../../../../utils/FormValidation';
import { SelectAttributeControl } from '../../input_select/SelectAttributeControl';
import { DatePicker } from '../../date_picker/DatePicker';
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
  const [controlledInput, setControlledInput] = React.useState({ pilot_id: "", client_id: "", observation: "", status: "1", start_date: moment(), end_date: moment() });
  const [fieldError, setFieldError] = React.useState({ start_date: false, end_date: false, pilot_id: false, client_id: false, observation: false, flight_plans: false, status: false });
  const [fieldErrorMessage, setFieldErrorMessage] = React.useState({ start_date: "", end_date: "", pilot_id: "", client_id: "", observation: "", flight_plans: "", status: "" });
  const [displayAlert, setDisplayAlert] = React.useState({ display: false, type: "", message: "" });
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [flightPlans, setFlightPlans] = React.useState([]);

  // ============================================================================== FUNCTIONS ============================================================================== //

  const handleClickOpen = () => {
    setOpen(true);
    setControlledInput({ pilot_id: "0", client_id: "0", observation: "", status: "1", start_date: moment(), end_date: moment() });
  }

  const handleClose = () => {
    setFieldError({ start_date: false, end_date: false, pilot_id: false, client_id: false, observation: false, flight_plans: false, status: false });
    setFieldErrorMessage({ start_date: "", end_date: "", pilot_id: "", client_id: "", observation: "", flight_plans: "", status: "" });
    setDisplayAlert({ display: false, type: "", message: "" });
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
        setDisplayAlert({ display: true, type: "error", message: "A data inicial deve anteceder a final." });

      }

    }

  }

  const formularyDataValidate = () => {

    const startDateValidate = moment(controlledInput.startDate).format("YYYY-MM_DD") != null ? { error: false, message: "" } : { error: true, message: "Selecione a data inicial" };
    const endDateValidate = moment(controlledInput.endDate).format("YYYY-MM_DD") != null ? { error: false, message: "" } : { error: true, message: "Selecione a data final" };
    const pilotNameValidate = Number(controlledInput.pilot_id) != 0 ? { error: false, message: "" } : { error: true, message: "O piloto deve ser selecionado" };
    const clientNameValidate = Number(controlledInput.client_id) != 0 ? { error: false, message: "" } : { error: true, message: "O cliente deve ser selecionado" };
    const observationValidate = FormValidation(controlledInput.observation, 3, null, null, null);
    const fligthPlansValidate = flightPlans != null ? { error: false, message: "" } : { error: true, message: "" };
    const statusValidate = Number(controlledInput.status) != 0 && Number(controlledInput.status) != 1 ? { error: true, message: "O status deve ser 1 ou 0" } : { error: false, message: "" };

    setFieldError({
      start_date: startDateValidate.error,
      end_date: endDateValidate.error,
      pilot_id: pilotNameValidate.error,
      client_id: clientNameValidate.error,
      observation: observationValidate.error,
      flight_plans: fligthPlansValidate.error,
      status: statusValidate.error
    });

    setFieldErrorMessage({
      start_date: startDateValidate.message,
      end_date: endDateValidate.message,
      pilot_id: pilotNameValidate.message,
      client_id: clientNameValidate.message,
      observation: observationValidate.message,
      flight_plans: fligthPlansValidate.message,
      status: statusValidate.message
    });

    return !(startDateValidate.error || endDateValidate.error || pilotNameValidate.error || clientNameValidate.error || observationValidate.error || fligthPlansValidate.error || statusValidate.error);

  };

  function verifyDateInterval() {

    return moment(controlledInput.start_date).format('YYYY-MM-DD') < moment(controlledInput.end_date).format('YYYY-MM-DD');

  }

  const requestServerOperation = () => {

    AxiosApi.post(`/api/orders-module`, {
      start_date: controlledInput.start_date,
      end_date: controlledInput.end_date,
      pilot_id: controlledInput.pilot_id,
      client_id: controlledInput.client_id,
      observation: controlledInput.observation,
      status: controlledInput.status,
      flight_plans: flightPlans
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

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ style: { borderRadius: 15 } }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>CADASTRO DE ORDEM DE SERVIÇO</DialogTitle>

        <Box component="form" noValidate onSubmit={handleRegistrationSubmit} >
          <DialogContent>

            <Box sx={{ display: "flex", mb: 2 }}>
              <Box sx={{ mr: 1 }}>
                <DatePicker
                  setControlledInput={setControlledInput}
                  controlledInput={controlledInput}
                  name={"start_date"}
                  label={"Data inicial"}
                  error={fieldError.start_date}
                  value={controlledInput.start_date}
                  operation={"create"}
                  read_only={false}
                />
                <FormHelperText error>{fieldErrorMessage.start_date}</FormHelperText>
              </Box>
              <Box>
                <DatePicker
                  setControlledInput={setControlledInput}
                  controlledInput={controlledInput}
                  name={"end_date"}
                  label={"Data final"}
                  error={fieldError.end_date}
                  value={controlledInput.end_date}
                  operation={"create"}
                  read_only={false}
                />
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <SelectAttributeControl
                label_text="Piloto"
                data_source={"/api/load-users?where=profile_id.3"}
                primary_key={"id"}
                key_content={"name"}
                setControlledInput={setControlledInput}
                controlledInput={controlledInput}
                error={fieldError.pilot_id}
                value={controlledInput.pilot_id}
                name={"pilot_id"}
              />
              <FormHelperText error>{fieldErrorMessage.pilot_id}</FormHelperText>
            </Box>

            <Box sx={{ mb: 1 }}>
              <SelectAttributeControl
                label_text="Cliente"
                data_source={"/api/load-users?where=profile_id.4"}
                primary_key={"id"}
                key_content={"name"}
                setControlledInput={setControlledInput}
                controlledInput={controlledInput}
                error={fieldError.client_id}
                value={controlledInput.client_id}
                name={"client_id"}
              />
              <FormHelperText error>{fieldErrorMessage.client_id}</FormHelperText>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Box>
                <FlightPlansForServiceOrderModal
                  setFlightPlans={setFlightPlans}
                  flightPlans={flightPlans}
                  serviceOrderId={null}
                />
              </Box>
              {flightPlans.length > 0 &&
                <List
                  dense={true}
                  sx={{
                    maxWidth: '100%',
                    minWidth: '100%',
                    bgcolor: '#F5F5F5',
                    position: 'relative',
                    overflow: 'auto',
                    maxHeight: 200,
                    '& ul': { padding: 0 },
                    mt: 2
                  }}
                  subheader={<li />}
                >
                  <ul>
                    <ListSubheader sx={{ bgcolor: '#1976D2', color: '#fff', fontWeight: 'bold' }}>{"Selecionados: " + flightPlans.length}</ListSubheader>
                    {flightPlans.map((flight_plan, index) => (
                      <ListItem
                        key={index}
                        secondaryAction={
                          <IconButton edge="end" aria-label="comments">
                            <SettingsIcon />
                          </IconButton>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar>
                            <MapIcon style={{ color: '#007937' }} />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`ID: ${flight_plan.id}`}
                          secondary={`Nome: ${flight_plan.name}`}
                        />
                      </ListItem>
                    ))}
                  </ul>
                </List>
              }
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