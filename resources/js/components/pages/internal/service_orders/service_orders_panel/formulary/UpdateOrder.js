import * as React from 'react';
// Material UI
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton, Box, Alert, LinearProgress, TextField, FormHelperText, List, ListItem, ListItemText, ListSubheader, Avatar, ListItemAvatar, Grid, Divider, DialogContentText } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
// Custom
import { useAuth } from '../../../../../context/Auth';
import { FormValidation } from '../../../../../../utils/FormValidation';
import axios from '../../../../../../services/AxiosApi';
import { DatePicker } from '../../../../../shared/date_picker/DatePicker';
import { SelectAttributeControl } from '../../../../../shared/input_select/SelectAttributeControl';
import { StatusRadio } from '../../../../../shared/radio_group/StatusRadio';
import { FlightPlansForServiceOrderModal } from '../modal/FlightPlansForServiceOrderModal';
import { FlightPlanEquipmentSelection } from '../modal/FlightPlanEquipmentSelection';
// Fontsawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
// Libs
import moment from 'moment';

const initialFieldError = { start_date: false, end_date: false, creator_name: false, pilot_id: false, client_id: false, observation: false, status: false };
const initialFieldErrorMessage = { start_date: "", end_date: "", creator_name: "", pilot_id: "", client_id: "", observation: "", flight_plan: "", status: "" };
const initialDisplayAlert = { display: false, type: "", message: "" };
const regexForSelectedFlightPlan = /^[1-9]\d*$/;

export const UpdateOrder = React.memo((props) => {

  // ============================================================================== STATES ============================================================================== //

  const { user } = useAuth();
  const [controlledInput, setControlledInput] = React.useState({
    id: props.record.id,
    start_date: props.record.start_date,
    end_date: props.record.end_date,
    creator_name: props.record.users.creator.name,
    pilot_id: props.record.users.pilot.id,
    client_id: props.record.users.client.id,
    observation: props.record.observation,
    status: props.record.status
  });
  const [fieldError, setFieldError] = React.useState(initialFieldError);
  const [fieldErrorMessage, setFieldErrorMessage] = React.useState(initialFieldErrorMessage);
  const [displayAlert, setDisplayAlert] = React.useState(initialDisplayAlert);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [selectedFlightPlans, setSelectedFlightPlans] = React.useState([]);
  const [canSave, setCanSave] = React.useState(false);

  // ============================================================================== FUNCTIONS ============================================================================== //

  React.useEffect(() => {

    setCanSave(() => {

      if (selectedFlightPlans.length === 0) {
        return false;
      }

      let selections_check = selectedFlightPlans.map((selected_flight_plan) => {

        let current_check = 1;
        for (let key in selected_flight_plan) {
          if (key != "name" && !regexForSelectedFlightPlan.test(selected_flight_plan[key].toString())) {
            current_check = 0;
          }
        }

        return current_check;
      });

      return !selections_check.includes(0);

    });

  }, [selectedFlightPlans])

  function handleClickOpen() {
    setOpen(true);

    setSelectedFlightPlans(props.record.flight_plans.map((flight_plan) => {
      return {
        id: flight_plan.id,
        name: flight_plan.name,
        drone_id: flight_plan.drone_id,
        battery_id: flight_plan.battery_id,
        equipment_id: flight_plan.equipment_id
      }
    }));
  }

  function handleClose() {
    setFieldError(initialFieldError);
    setFieldErrorMessage(initialFieldErrorMessage);
    setDisplayAlert(initialDisplayAlert);
    setLoading(false);
    setOpen(false);
  }

  function handleSubmit() {
    if (formValidation()) {
      setLoading(true);
      requestServer();
    }
  }

  function formValidation() {

    const dateValidate = verifyDateInterval();
    const pilotNameValidate = Number(controlledInput.pilot_id) != 0 ? { error: false, message: "" } : { error: true, message: "O piloto deve ser selecionado" };
    const clientNameValidate = Number(controlledInput.client_id) != 0 ? { error: false, message: "" } : { error: true, message: "O cliente deve ser selecionado" };
    const observationValidate = FormValidation(controlledInput.observation, 3, null, null, "observação");
    const fligthPlansValidate = selectedFlightPlans != null ? { error: false, message: "" } : { error: true, message: "" };
    const statusValidate = Number(controlledInput.status) != 0 && Number(controlledInput.status) != 1 ? { error: true, message: "O status deve ser 1 ou 0" } : { error: false, message: "" };

    setFieldError({
      date_interval: dateValidate.error,
      pilot_id: pilotNameValidate.error,
      client_id: clientNameValidate.error,
      observation: observationValidate.error,
      flight_plan: fligthPlansValidate.error,
      status: statusValidate.error
    });

    setFieldErrorMessage({
      date_interval: dateValidate.error,
      pilot_id: pilotNameValidate.message,
      client_id: clientNameValidate.message,
      observation: observationValidate.message,
      flight_plan: fligthPlansValidate.message,
      status: statusValidate.message
    });

    return !(dateValidate.error || pilotNameValidate.error || clientNameValidate.error || observationValidate.error || fligthPlansValidate.error || statusValidate.error);
  }

  function verifyDateInterval() {
    return moment(controlledInput.start_date).format('YYYY-MM-DD hh:mm:ss') < moment(controlledInput.end_date).format('YYYY-MM-DD hh:mm:ss');
  }

  function requestServer() {
    axios.patch(`/api/orders-module/${controlledInput.id}`, {
      start_date: moment(controlledInput.start_date).format('YYYY-MM-DD hh:mm:ss'),
      end_date: moment(controlledInput.end_date).format('YYYY-MM-DD hh:mm:ss'),
      pilot_id: controlledInput.pilot_id,
      client_id: controlledInput.client_id,
      creator_id: props.record.users.creator.id,
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
      });
  }

  function successResponse(response) {
    setDisplayAlert({ display: true, type: "success", message: response.data.message });
    setTimeout(() => {
      props.reloadTable((old) => !old);
      setLoading(false);
      handleClose();
    }, 2000);
  }

  function errorResponse(response) {
    setDisplayAlert({ display: true, type: "error", message: response.data.message });

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

  function handleInputChange(event) {
    setControlledInput({ ...controlledInput, [event.target.name]: event.currentTarget.value });
  }

  function avatarSelectionStyle(selected_flight_plan) {

    let is_completed = true;

    for (let key in selected_flight_plan) {
      if (key != "name" && !regexForSelectedFlightPlan.test(selected_flight_plan[key].toString())) {
        is_completed = false;
      }
    }

    return is_completed ? { bgcolor: "#4CAF50" } : { bgcolor: "#E0E0E0" };

  }

  // ============================================================================== STRUCTURES - MUI ============================================================================== //

  return (
    <>
      <Tooltip title="Editar">
        <IconButton disabled={!user.data.user_powers["3"].profile_powers.read == 1} onClick={handleClickOpen}>
          <FontAwesomeIcon icon={faPen} color={user.data.user_powers["3"].profile_powers.read == 1 ? "#007937" : "#E0E0E0"} size="sm" />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ style: { borderRadius: 15 } }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>ATUALIZAÇÃO DE ORDEM DE SERVIÇO</DialogTitle>
        <Divider />

        <DialogContent>

          <DialogContentText mb={3}>
            Preencha todos os dados requisitados no formulário para a criação da ordem de serviço.
          </DialogContentText>

          <Grid container spacing={1} mt={1}>

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
                value={controlledInput.observation}
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
                            current={flight_plan}
                          />
                        }
                      >
                        <ListItemAvatar>
                          <Avatar sx={avatarSelectionStyle(flight_plan)}>
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

        {(!loading && displayAlert.display) &&
          <Alert severity={displayAlert.type}>{displayAlert.message}</Alert>
        }

        {loading && <LinearProgress />}

        <Divider />
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          {canSave &&
            <Button variant="contained" startIcon={<LockOpenIcon />} onClick={handleSubmit} disabled={loading}>
              Confirmar
            </Button >
          }

          {!canSave &&
            <Button variant="contained" startIcon={<LockIcon />} disabled>
              Salvar
            </Button >
          }
        </DialogActions>
      </Dialog>
    </>
  );
});