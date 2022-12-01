import * as React from 'react';
// Material UI
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton, Box, Alert, LinearProgress, TextField, FormHelperText, List, ListItem, ListItemText, ListSubheader, Avatar, ListItemAvatar, Grid, Divider } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
// Custom
import axios from '../../../../services/AxiosApi';
import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';
import { FormValidation } from '../../../../utils/FormValidation';
import { SelectAttributeControl } from '../../input_select/SelectAttributeControl';
import { DatePicker } from '../../date_picker/DatePicker';
import { StatusRadio } from '../../radio_group/StatusRadio';
import { FlightPlansForServiceOrderModal } from '../../modals/fullscreen/FlightPlansForServiceOrderModal';
import { FlightPlanEquipmentSelection } from '../../modals/dialog/FlightPlanEquipmentSelection';
// Fontsawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
// Libs
import moment from 'moment';

const initialControlledInput = { pilot_id: "", client_id: "", observation: "", status: "1", start_date: moment(), end_date: moment() };
const initialFieldError = { start_date: false, end_date: false, pilot_id: false, client_id: false, observation: false, flight_plans: false, status: false };
const initialFieldErrorMessage = { start_date: "", end_date: "", pilot_id: "", client_id: "", observation: "", flight_plans: "", status: "" };
const initialDisplatAlert = { display: false, type: "", message: "" };

export const CreateOrderFormulary = React.memo((props) => {

  // ============================================================================== STATES ============================================================================== //

  const { AuthData } = useAuthentication();
  const [controlledInput, setControlledInput] = React.useState(initialControlledInput);
  const [fieldError, setFieldError] = React.useState(initialFieldError);
  const [fieldErrorMessage, setFieldErrorMessage] = React.useState(initialFieldErrorMessage);
  const [displayAlert, setDisplayAlert] = React.useState(initialDisplatAlert);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [selectedFlightPlans, setSelectedFlightPlans] = React.useState([]);

  // ============================================================================== FUNCTIONS ============================================================================== //

  function handleClickOpen() {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
    setLoading(false);
    setFieldError(initialFieldError);
    setFieldErrorMessage(initialFieldErrorMessage);
    setDisplayAlert(initialDisplatAlert);
    setControlledInput(initialControlledInput);
  }

  function handleSubmit() {
    if (!formValidation()) {
      return '';
    }
    requestServerOperation();
  }

  function formValidation() {

    const dateValidate = verifyDateInterval();
    const pilotNameValidate = Number(controlledInput.pilot_id) != 0 ? { error: false, message: "" } : { error: true, message: "O piloto deve ser selecionado" };
    const clientNameValidate = Number(controlledInput.client_id) != 0 ? { error: false, message: "" } : { error: true, message: "O cliente deve ser selecionado" };
    const observationValidate = FormValidation(controlledInput.observation, 3, null, null, null);
    const fligthPlansValidate = selectedFlightPlans != null ? { error: false, message: "" } : { error: true, message: "" };
    const statusValidate = Number(controlledInput.status) != 0 && Number(controlledInput.status) != 1 ? { error: true, message: "O status deve ser 1 ou 0" } : { error: false, message: "" };

    setFieldError({
      date_interval: dateValidate.error,
      pilot_id: pilotNameValidate.error,
      client_id: clientNameValidate.error,
      observation: observationValidate.error,
      flight_plans: fligthPlansValidate.error,
      status: statusValidate.error
    });

    setFieldErrorMessage({
      date_interval: dateValidate.message,
      pilot_id: pilotNameValidate.message,
      client_id: clientNameValidate.message,
      observation: observationValidate.message,
      flight_plans: fligthPlansValidate.message,
      status: statusValidate.message
    });

    return !(dateValidate.error || pilotNameValidate.error || clientNameValidate.error || observationValidate.error || fligthPlansValidate.error || statusValidate.error);

  }

  function verifyDateInterval() {
    return moment(controlledInput.start_date).format('YYYY-MM-DD') < moment(controlledInput.end_date).format('YYYY-MM-DD') ? { error: false, message: '' } : { error: true, message: 'A data inicial deve anteceder a final' };
  }

  function requestServerOperation() {
    setLoading(true);

    axios.post(`/api/orders-module`, {
      start_date: controlledInput.start_date,
      end_date: controlledInput.end_date,
      pilot_id: controlledInput.pilot_id,
      client_id: controlledInput.client_id,
      observation: controlledInput.observation,
      status: controlledInput.status,
      flight_plans: selectedFlightPlans
    })
      .then(function (response) {
        successResponse(response);
      })
      .catch(function (error) {
        errorResponse(error.response);
      })
      .finally(() => {
        setLoading(false);
      })
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
      start_date: { error: false, message: null },
      end_date: { error: false, message: null },
      pilot_id: { error: false, message: null },
      client_id: { error: false, message: null },
      observation: { error: false, message: null },
      status: { error: false, message: null },
      fligth_plans_ids: { error: false, message: null }
    }

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

  function handleInputChange(event) {
    setControlledInput({ ...controlledInput, [event.target.name]: event.currentTarget.value });
  }

  // ============================================================================== STRUCTURES - MUI ============================================================================== //

  return (
    <>
      <Tooltip title="Nova ordem de serviço">
        <IconButton onClick={handleClickOpen} disabled={!AuthData.data.user_powers["3"].profile_powers.write == 1}>
          <FontAwesomeIcon icon={faPlus} color={AuthData.data.user_powers["3"].profile_powers.write == 1 ? "#00713A" : "#E0E0E0"} size="sm" />
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
        <Divider />

        <DialogContent>
          <Grid container spacing={1}>

            <Grid item sx={6}>
              <DatePicker
                setControlledInput={setControlledInput}
                controlledInput={controlledInput}
                name={"start_date"}
                label={"Data inicial"}
                error={fieldError.date_interval}
                value={controlledInput.start_date}
                read_only={false}
              />
              <FormHelperText error>{fieldErrorMessage.date_interval}</FormHelperText>
            </Grid>

            <Grid item xs={6}>
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
            </Grid>

            <Grid item xs={6}>
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
            </Grid>

            <Grid item xs={6}>
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
            </Grid>

            <Grid item xs={12}>
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
            </Grid>

            <Grid item xs={6}>
              <Box>
                <FlightPlansForServiceOrderModal
                  setSelectedFlightPlans={setSelectedFlightPlans}
                  selectedFlightPlans={selectedFlightPlans}
                  serviceOrderId={null}
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              {selectedFlightPlans.length > 0 &&
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
                    <ListSubheader sx={{ bgcolor: '#1976D2', color: '#fff', fontWeight: 'bold' }}>{"Selecionados: " + selectedFlightPlans.length}</ListSubheader>
                    {selectedFlightPlans.map((flight_plan, index) => (
                      <ListItem
                        key={index}
                        secondaryAction={
                          <FlightPlanEquipmentSelection
                            selectedFlightPlans={selectedFlightPlans}
                            setSelectedFlightPlans={setSelectedFlightPlans}
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
            </Grid>

            <Grid item xs={6}>
              <StatusRadio
                default={1}
                setControlledInput={setControlledInput}
                controlledInput={controlledInput}
              />
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
          <Button type="submit" disabled={loading} variant="contained" onClick={handleSubmit}>Confirmar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
});