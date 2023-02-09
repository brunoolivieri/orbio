import * as React from 'react';
// Material UI
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip, IconButton, Box, Alert, LinearProgress, TextField, FormHelperText, List, ListItem, ListItemText, ListSubheader, Avatar, ListItemAvatar, Grid, Divider } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
// Custom
import { FormValidation } from '../../../../../../utils/FormValidation';
import axios from '../../../../../../services/AxiosApi';
import { useAuth } from '../../../../../context/Auth';
import { FetchedDataSelection } from '../../../../../shared/input_select/FetchedDataSelection';
import { DatePicker } from '../../../../../shared/date_picker/DatePicker';
import { FlightPlansForServiceOrderModal } from '../modal/FlightPlansForServiceOrderModal';
import { ServiceOrderFlightPlanEquipmentSelection } from '../modal/ServiceOrderFlightPlanEquipmentSelectionModal';
// Fontsawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
// Libs
import moment from 'moment';

const initialFormData = { pilot_id: "0", client_id: "0", observation: "", start_date: moment(), end_date: moment() };
const fieldError = { error: false, message: "" }
const initialFormError = { pilot_id: fieldError, client_id: fieldError, observation: fieldError, start_date: fieldError, flight_plans: fieldError };
const initialDisplayAlert = { display: false, type: "", message: "" };

export const CreateOrder = React.memo((props) => {

  // ============================================================================== STATES ============================================================================== //

  const { user } = useAuth();

  const [formData, setFormData] = React.useState(initialFormData);
  const [formError, setFormError] = React.useState(initialFormError);
  const [displayAlert, setDisplayAlert] = React.useState(initialDisplayAlert);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [selectedFlightPlans, setSelectedFlightPlans] = React.useState([]);
  const [canSave, setCanSave] = React.useState(false);

  // ============================================================================== FUNCTIONS ============================================================================== //

  // Verify if data is completed
  React.useEffect(() => {

    setCanSave(() => {

      if (selectedFlightPlans.length === 0) {
        return false;
      }

      // Will be an array with one and/or zeros
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

      // If the array has 0, exists invalid data
      return !selections_check.includes(0);

    });

  }, [selectedFlightPlans]);

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setLoading(false);
    setDisplayAlert(initialDisplayAlert);
    setFormError(initialFormError);
    setFormData(formData);
    setSelectedFlightPlans([]);
  }

  function handleSubmit() {
    if (!formSubmissionValidation()) return '';

    setLoading(true);
    requestServer();
  }

  function formSubmissionValidation() {

    let validation = Object.assign({}, formError);

    validation["start_date"] = moment(formData.start_date) < moment(formData.end_date) ? { error: false, message: '' } : { error: true, message: 'A data inicial deve anteceder a final' };
    validation["pilot_id"] = Number(formData.pilot_id) != 0 ? { error: false, message: "" } : { error: true, message: "O piloto deve ser selecionado" };
    validation["client_id"] = Number(formData.client_id) != 0 ? { error: false, message: "" } : { error: true, message: "O cliente deve ser selecionado" };
    validation["observation"] = FormValidation(formData.observation, 3, 255);
    validation["flight_plans"] = selectedFlightPlans != null ? { error: false, message: "" } : { error: true, message: "" };

    setFormError(validation);

    return !(validation.start_date.error || validation.client_id.error || validation.pilot_id.error || validation.observation.error || validation.flight_plans.error);


  }

  async function requestServer() {

    try {

      const response = await axios.post("/api/orders-module", {
        start_date: formData.start_date,
        end_date: formData.end_date,
        pilot_id: formData.pilot_id,
        client_id: formData.client_id,
        observation: formData.observation,
        flight_plans: selectedFlightPlans
      });

      successResponse(response);

    } catch (error) {
      errorResponse(error.response);
    } finally {
      setLoading(false);
    }

  }

  function successResponse(response) {
    setDisplayAlert({ display: true, type: "success", message: response.data.message });
    setTimeout(() => {
      props.reloadTable((old) => !old);
      handleClose();
    }, 2000);
  }

  function errorResponse(response) {
    const error_message = response.data.message ? response.data.message : "Erro do servidor";
    setDisplayAlert({ display: true, type: "error", message: error_message });

    if (response.data.errors) {
      let response_errors = {}
      for (let field in response.data.errors) {
        response_errors[field] = {
          error: true,
          message: response.data.errors[field][0]
        }
      }
      setFormError(response_errors);
    }
  }

  function handleInputChange(event) {
    setFormData({ ...formData, [event.target.name]: event.currentTarget.value });
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

  // ============================================================================== STRUCTURES - MUI ============================================================================== //

  return (
    <>
      <Tooltip title="Nova ordem de serviço">
        <IconButton onClick={handleClickOpen} disabled={!user.user_powers["3"].profile_powers.write == 1}>
          <FontAwesomeIcon icon={faPlus} color={user.user_powers["3"].profile_powers.write == 1 ? "#00713A" : "#E0E0E0"} size="sm" />
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

          <DialogContentText mb={3}>
            Preencha todos os dados requisitados no formulário para a criação da ordem de serviço.
          </DialogContentText>

          <Grid container spacing={1}>

            <Grid item sx={6}>
              <DatePicker
                label={"Início"}
                name={"start_date"}
                value={formData.start_date}
                setFormData={setFormData}
                formData={formData}
                errorMessage={formError.start_date.message}
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
                fetch_from={"/api/load-users?where=profile_id.3"}
                primary_key={"id"}
                key_content={"name"}
                name={"pilot_id"}
                error={formError.pilot_id.error}
                errorMessage={formError.pilot_id.message}
                selected={formData.pilot_id}
                handleChange={handleInputChange}
              />
              <FormHelperText error>{formError.pilot_id.message}</FormHelperText>
            </Grid>

            <Grid item xs={6}>
              <FetchedDataSelection
                label_text="Cliente"
                fetch_from={"/api/load-users?where=profile_id.4"}
                primary_key={"id"}
                key_content={"name"}
                name={"client_id"}
                error={formError.client_id.error}
                errorMessage={formError.client_id.message}
                selected={formData.client_id}
                handleChange={handleInputChange}
              />
              <FormHelperText error>{formError.client_id.message}</FormHelperText>
            </Grid>

            <Grid item xs={12}>
              <TextField
                type="text"
                margin="dense"
                label="Observação"
                fullWidth
                variant="outlined"
                name="observation"
                value={formData.observation}
                onChange={handleInputChange}
                helperText={formError.observation.message}
                error={formError.observation.error}
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
                          <ServiceOrderFlightPlanEquipmentSelection
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
          {canSave &&
            <Button variant="contained" startIcon={<LockOpenIcon />} onClick={handleSubmit} disabled={loading}>
              Confirmar
            </Button >
          }

          {!canSave &&
            <Button variant="contained" startIcon={<LockIcon />} disabled>
              Confirmar
            </Button >
          }
        </DialogActions>
      </Dialog>
    </>
  );
});