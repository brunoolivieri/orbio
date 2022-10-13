// React
import * as React from 'react';
// MaterialUI
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import { Alert } from '@mui/material';
import { IconButton } from '@mui/material';
import { Tooltip } from '@mui/material';
import FormHelperText from '@mui/material/FormHelperText';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Avatar from '@mui/material/Avatar';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import MapIcon from '@mui/icons-material/Map';
// Custom
import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';
import { FormValidation } from '../../../../utils/FormValidation';
import AxiosApi from '../../../../services/AxiosApi';
import { DatePicker } from '../../date_picker/DatePicker';
import { SelectAttributeControl } from '../../input_select/SelectAttributeControl';
import { StatusRadio } from '../../radio_group/StatusRadio';
import { FlightPlansForServiceOrderModal } from '../../modals/fullscreen/FlightPlansForServiceOrderModal';
import LinearProgress from '@mui/material/LinearProgress';
import { FlightPlanEquipmentSelection } from '../../modals/dialog/FlightPlanEquipmentSelection';
// Fontsawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
// Libs
import moment from 'moment';

export const UpdateOrderFormulary = React.memo((props) => {

  // ============================================================================== STATES ============================================================================== //

  const { AuthData } = useAuthentication();
  const [controlledInput, setControlledInput] = React.useState({ id: "", pilot_id: "", client_id: "", observation: "", status: "", start_date: "", end_date: "" });
  const [fieldError, setFieldError] = React.useState({ start_date: false, end_date: false, creator_name: false, pilot_id: false, client_id: false, observation: false, flight_plan: false, status: false });
  const [fieldErrorMessage, setFieldErrorMessage] = React.useState({ start_date: "", end_date: "", creator_name: "", pilot_id: "", client_id: "", observation: "", flight_plan: "", status: "" });
  const [displayAlert, setDisplayAlert] = React.useState({ display: false, type: "", message: "" });
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [flightPlans, setFlightPlans] = React.useState([]);

  // ============================================================================== FUNCTIONS ============================================================================== //

  const handleClickOpen = () => {
    setOpen(true);
    setLoading(false);
    setControlledInput({ id: props.record.id, pilot_id: props.record.users.pilot.id, client_id: props.record.users.client.id, observation: props.record.observation, status: props.record.status, start_date: props.record.start_date, end_date: props.record.end_date });
    setFieldError({ start_date: false, end_date: false, creator_name: false, pilot_id: false, client_id: false, observation: false, flight_plan: false, status: false });
    setFieldErrorMessage({ start_date: "", end_date: "", creator_name: "", pilot_id: "", client_id: "", observation: "", flight_plan: "", status: "" });
    setDisplayAlert({ display: false, type: "", message: "" });
    setFlightPlans(props.record.flight_plans.map((flight_plan) => {
      return {
        id: flight_plan.id,
        name: flight_plan.name,
        drone_id: flight_plan.drone_id,
        battery_id: flight_plan.battery_id,
        equipment_id: flight_plan.equipment_id
      }
    }));
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleSubmitOperation = (event) => {
    event.preventDefault();

    if (formularyDataValidate()) {

      if (verifyDateInterval()) {

        setLoading(true);
        requestServerOperation();

      } else {

        setLoading(false);
        setDisplayAlert({ display: false, type: "", message: "Erro! A data inicial não pode anteceder a final." });

      }

    }

  }

  const formularyDataValidate = () => {

    const startDateValidate = controlledInput.start_date != null ? { error: false, message: "" } : { error: true, message: "Selecione a data inicial" };
    const endDateValidate = controlledInput.end_date != null ? { error: false, message: "" } : { error: true, message: "Selecione a data final" };
    const pilotNameValidate = Number(controlledInput.pilot_id) != 0 ? { error: false, message: "" } : { error: true, message: "O piloto deve ser selecionado" };
    const clientNameValidate = Number(controlledInput.client_id) != 0 ? { error: false, message: "" } : { error: true, message: "O cliente deve ser selecionado" };
    const observationValidate = FormValidation(controlledInput.observation, 3, null, null, "observação");
    const fligthPlansValidate = flightPlans != null ? { error: false, message: "" } : { error: true, message: "" };
    const statusValidate = Number(controlledInput.status) != 0 && Number(controlledInput.status) != 1 ? { error: true, message: "O status deve ser 1 ou 0" } : { error: false, message: "" };

    setFieldError({
      start_date: startDateValidate.error,
      end_date: endDateValidate.error,
      pilot_id: pilotNameValidate.error,
      client_id: clientNameValidate.error,
      observation: observationValidate.error,
      flight_plan: fligthPlansValidate.error,
      status: statusValidate.error
    });

    setFieldErrorMessage({
      start_date: startDateValidate.message,
      end_date: endDateValidate.message,
      pilot_id: pilotNameValidate.message,
      client_id: clientNameValidate.message,
      observation: observationValidate.message,
      flight_plan: fligthPlansValidate.message,
      status: statusValidate.message
    });

    return !(startDateValidate.error || endDateValidate.error || pilotNameValidate.error || clientNameValidate.error || observationValidate.error || fligthPlansValidate.error || statusValidate.error);

  }

  function verifyDateInterval() {

    return moment(controlledInput.start_date).format('YYYY-MM-DD hh:mm:ss') < moment(controlledInput.end_date).format('YYYY-MM-DD hh:mm:ss');

  }

  const requestServerOperation = () => {

    AxiosApi.patch(`/api/orders-module/${controlledInput.id}`, {
      start_date: moment(controlledInput.start_date).format('YYYY-MM-DD hh:mm:ss'),
      end_date: moment(controlledInput.end_date).format('YYYY-MM-DD hh:mm:ss'),
      pilot_id: controlledInput.pilot_id,
      client_id: controlledInput.client_id,
      creator_id: props.record.users.creator.id,
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
      props.record_setter(null);
      props.reload_table();
      setLoading(false);
      handleClose();
    }, 2000);

  }

  function errorServerResponseTreatment(response) {

    const error_message = response.data.message ? response.data.message : "Erro do servidor";
    setDisplayAlert({ display: true, type: "error", message: error_message });

    // Definição dos objetos de erro possíveis de serem retornados pelo validation do Laravel
    let request_errors = {
      start_date: { error: false, message: null },
      end_date: { error: false, message: null },
      creator_name: { error: false, message: null },
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
      creator_name: request_errors.creator_name.error,
      pilot_id: request_errors.pilot_id.error,
      client_id: request_errors.client_id.error,
      observation: request_errors.observation.error,
      flight_plans: request_errors.fligth_plans_ids.error,
      status: request_errors.status.error
    });

    setFieldErrorMessage({
      start_date: request_errors.start_date.message,
      end_date: request_errors.end_date.message,
      creator_name: request_errors.creator_name.message,
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

      <Tooltip title="Editar">
        <IconButton disabled={AuthData.data.user_powers["3"].profile_powers.read == 1 ? false : true} onClick={handleClickOpen}>
          <FontAwesomeIcon icon={faPen} color={AuthData.data.user_powers["3"].profile_powers.read == 1 ? "#007937" : "#808991"} size="sm" />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ style: { borderRadius: 15 } }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>ATUALIZAÇÃO | ORDEM DE SERVIÇO (ID: {props.record.id})</DialogTitle>

        <Box component="form" noValidate onSubmit={handleSubmitOperation} >

          <DialogContent>

            <TextField
              type="text"
              margin="dense"
              label="ID da ordem de serviço"
              fullWidth
              variant="outlined"
              required
              id="id"
              name="id"
              defaultValue={props.record.id}
              sx={{ mb: 2 }}
              InputProps={{
                readOnly: true
              }}
            />

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
                helperText={fieldErrorMessage.pilot_id}
                error={fieldError.pilot_id}
                name={"pilot_id"}
                value={controlledInput.pilot_id}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <SelectAttributeControl
                label_text="Cliente"
                data_source={"/api/load-users?where=profile_id.4"}
                primary_key={"id"}
                key_content={"name"}
                setControlledInput={setControlledInput}
                controlledInput={controlledInput}
                error={fieldError.client_id}
                name={"client_id"}
                value={controlledInput.client_id}
              />
              <FormHelperText>{fieldErrorMessage.client_id}</FormHelperText>
            </Box>

            <Box sx={{ mb: 1 }}>
              <Box>
                <FlightPlansForServiceOrderModal
                  setFlightPlans={setFlightPlans}
                  flightPlans={flightPlans}
                  serviceOrderId={controlledInput.id}
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
                          <FlightPlanEquipmentSelection
                            flightPlans={flightPlans}
                            setFlightPlans={setFlightPlans}
                            current={{ array_index: index, data: flight_plan }}
                          />
                        }
                      >
                        <ListItemAvatar>
                          <Avatar>
                            <MapIcon />
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
              required
              name="observation"
              onChange={handleInputChange}
              helperText={fieldErrorMessage.observation}
              error={fieldError.observation}
              defaultValue={props.record.observation}
              sx={{ mb: 2 }}
            />

            <Box>
              <StatusRadio
                default={props.record.status == 1 ? 1 : 0}
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
            <Button type="submit" variant='contained' disabled={loading}>Confirmar</Button>
          </DialogActions>

        </Box>

      </Dialog>

    </>

  );
});