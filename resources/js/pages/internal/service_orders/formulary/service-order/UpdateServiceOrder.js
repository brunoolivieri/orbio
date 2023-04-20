import * as React from 'react';
import { Button, Stack, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton, Box, Alert, LinearProgress, TextField, List, ListItem, ListItemText, ListSubheader, Avatar, ListItemAvatar, Grid, Divider, DialogContentText, Checkbox, FormControlLabel } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { FlightPlansForServiceOrder } from '../../table-selection/FlightPlansForServiceOrder';
import { LogsForServiceOrderFlightPlan } from '../../table-selection/LogsForServiceOrderFlightPlan';
import { DronesForFlightPlan } from '../../table-selection/DronesForFlightPlan';
import { BatteriesForFlightPlan } from '../../table-selection/BatteriesForFlightPlan';
import { EquipmentsForFlightPlan } from '../../table-selection/EquipmentsForFlightPlan';
import { IncidentsForServiceOrderFlightPlan } from '../../table-selection/IncidentsForServiceOrderFlightPlan';
import { useAuth } from '../../../../../context/Auth';
import { FormValidation } from '../../../../../utils/FormValidation';
import axios from '../../../../../services/AxiosApi';
import { DatePicker } from '../../../../../components/date_picker/DatePicker';
import { FetchedDataSelection } from '../../../../../components/input_select/FetchedDataSelection';

const fieldError = { error: false, message: "" }
const initialFormError = { pilot_id: fieldError, client_id: fieldError, observation: fieldError, status: fieldError, date_interval: fieldError, flight_plans: fieldError };
const initialDisplayAlert = { display: false, type: "", message: "" };

export const UpdateServiceOrder = React.memo((props) => {

  // ============================================================================== STATES ============================================================================== //

  const { user } = useAuth();
  const [formData, setFormData] = React.useState({});
  const [formError, setFormError] = React.useState(initialFormError);
  const [alert, setAlert] = React.useState(initialDisplayAlert);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [selectedFlightPlans, setSelectedFlightPlans] = React.useState([]);
  const [canSave, setCanSave] = React.useState(false);

  const is_authorized = !!user.user_powers["3"].profile_powers.write;

  // ============================================================================== FUNCTIONS ============================================================================== //

  // Verify if data is completed
  React.useEffect(() => {

    setCanSave(() => {

      if (selectedFlightPlans.length === 0) {
        return false;
      }

      let selections_check = selectedFlightPlans.map((selected_flight_plan) => {

        let current_check = 1;
        for (let prop in selected_flight_plan) {
          if (prop != "name" && prop != "log_id") {
            if (!/^[1-9]\d*$/.test(selected_flight_plan[prop].toString())) {
              current_check = 0;
            }
          }

        }

        return current_check;
      });

      return !selections_check.includes(0);

    });

  }, [selectedFlightPlans])

  function handleClickOpen() {
    setOpen(true);
    setFormData({
      id: props.record.id,
      start_date: props.record.start_date,
      end_date: props.record.end_date,
      pilot_id: props.record.users.pilot.id,
      client_id: props.record.users.client.id,
      observation: props.record.observation,
      status: props.record.status,
      undelete: false
    });

    setSelectedFlightPlans(props.record.flight_plans.map((flight_plan) => {
      return {
        id: flight_plan.id,
        name: flight_plan.name,
        drone_id: flight_plan.drone_id,
        battery_id: flight_plan.battery_id,
        equipment_id: flight_plan.equipment_id,
        log_id: flight_plan.log_id
      }
    }));
  }

  function handleClose() {
    setFormError(initialFormError);
    setAlert(initialDisplayAlert);
    setLoading(false);
    setOpen(false);
  }

  function handleSubmit() {
    if (!formSubmissionValidation()) return '';
    setLoading(true);
    requestServer();

  }

  function formSubmissionValidation() {

    let validation = Object.assign({}, formError);

    validation["date_interval"] = moment(formData.start_date).format('YYYY-MM-DD') < moment(formData.end_date).format('YYYY-MM-DD') ? { error: false, message: '' } : { error: true, message: 'A data inicial deve anteceder a final' };
    validation["pilot_id"] = Number(formData.pilot_id) != 0 ? { error: false, message: "" } : { error: true, message: "O piloto deve ser selecionado" };
    validation["client_id"] = Number(formData.client_id) != 0 ? { error: false, message: "" } : { error: true, message: "O cliente deve ser selecionado" };
    validation["observation"] = FormValidation(formData.observation, 3, 255);
    validation["flight_plans"] = selectedFlightPlans != null ? { error: false, message: "" } : { error: true, message: "" };

    setFormError(validation);

    return !(validation.date_interval.error || validation.client_id.error || validation.pilot_id.error || validation.observation.error || validation.flight_plans.error);
  }

  async function requestServer() {

    try {
      setCanSave(false);

      const response = await axios.patch(`api/module/service-orders/${formData.id}`, {
        start_date: moment(formData.start_date).format('YYYY-MM-DD hh:mm:ss'),
        end_date: moment(formData.end_date).format('YYYY-MM-DD hh:mm:ss'),
        pilot_id: formData.pilot_id,
        client_id: formData.client_id,
        creator_id: props.record.users.creator.id,
        status: formData.status,
        observation: formData.observation,
        flight_plans: selectedFlightPlans,
        undelete: formData.undelete
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
      setLoading(false);
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
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  function avatarSelectionStyle(selected_flight_plan) {
    let is_completed = true;
    for (let prop in selected_flight_plan) {
      if (prop != "name" && prop != "log_id") {
        if (!/^[1-9]\d*$/.test(selected_flight_plan[prop])) {
          is_completed = false;
        }
      }
    }

    return is_completed ? { bgcolor: "#4CAF50" } : { bgcolor: "#E0E0E0" };
  }

  // ============================================================================== JSX ============================================================================== //

  return (
    <>
      <Tooltip title="Editar">
        <IconButton disabled={!is_authorized} onClick={handleClickOpen}>
          <FontAwesomeIcon icon={faPen} color={is_authorized ? "#007937" : "#E0E0E0"} size="sm" />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ style: { borderRadius: 15 } }}
        fullWidth
        maxWidth="xl"
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
                label={"Início"}
                name={"start_date"}
                value={formData.start_date}
                setFormData={setFormData}
                formData={formData}
                errorMessage={formError.date_interval.message}
              />
            </Grid>

            <Grid item xs={6}>
              <DatePicker
                label={"Término"}
                name={"end_date"}
                value={formData.end_date}
                setFormData={setFormData}
                formData={formData}
                errorMessage={""}
              />
            </Grid>

            <Grid item xs={6}>
              <FetchedDataSelection
                label_text="Piloto"
                fetch_from={"/api/action/load-users?where=profile_id.3"}
                primary_key={"id"}
                key_content={"name"}
                name={"pilot_id"}
                error={formError.pilot_id.error}
                errorMessage={formError.pilot_id.message}
                selected={formData.pilot_id}
                handleChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={6}>
              <FetchedDataSelection
                label_text="Cliente"
                fetch_from={"/api/action/load-users?where=profile_id.4"}
                primary_key={"id"}
                key_content={"name"}
                name={"client_id"}
                error={formError.client_id.error}
                errorMessage={formError.client_id.message}
                selected={formData.client_id}
                handleChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                type="text"
                margin="dense"
                label="Observação"
                fullWidth
                variant="outlined"
                name="observation"
                onChange={handleInputChange}
                helperText={formError.observation.message}
                error={formError.observation.error}
                value={formData.observation}
                sx={{ mb: 2 }}
              />
            </Grid>

            {props.record.deleted_at &&
              <Grid item xs={12}>
                <FormControlLabel name="undelete" control={<Checkbox />} label="Recuperar" onChange={(e) => setFormData({ ...formData, ["undelete"]: e.target.checked })} />
              </Grid>
            }

            <Grid item xs={6}>
              <Box>
                <FlightPlansForServiceOrder
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
                          <Stack direction="row" spacing={2}>
                            <Stack direction="row">
                              <DronesForFlightPlan
                                selectedFlightPlans={selectedFlightPlans}
                                setSelectedFlightPlans={setSelectedFlightPlans}
                                current={flight_plan}
                              />
                              <BatteriesForFlightPlan
                                selectedFlightPlans={selectedFlightPlans}
                                setSelectedFlightPlans={setSelectedFlightPlans}
                                current={flight_plan}
                              />
                              <EquipmentsForFlightPlan
                                selectedFlightPlans={selectedFlightPlans}
                                setSelectedFlightPlans={setSelectedFlightPlans}
                                current={flight_plan}
                              />
                            </Stack>
                            <Stack direction="row">
                              <IncidentsForServiceOrderFlightPlan
                                serviceOrderId={formData.id}
                                selectedFlightPlans={selectedFlightPlans}
                                setSelectedFlightPlans={setSelectedFlightPlans}
                                current={flight_plan}
                              />
                              <LogsForServiceOrderFlightPlan
                                serviceOrderId={formData.id}
                                selectedFlightPlans={selectedFlightPlans}
                                setSelectedFlightPlans={setSelectedFlightPlans}
                                current={flight_plan}
                              />
                            </Stack>
                          </Stack>
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

          </Grid>
        </DialogContent>

        {(!loading && alert.display) &&
          <Alert severity={alert.type}>{alert.message}</Alert>
        }

        {loading && <LinearProgress />}

        <Divider />
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={!canSave}>
            Confirmar
          </Button >
        </DialogActions>
      </Dialog>
    </>
  );
});