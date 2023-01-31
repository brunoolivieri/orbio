import * as React from 'react';
// Material UI
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Box, Alert, IconButton, Tooltip, Grid, TextField, LinearProgress, List, ListItem, ListItemText, ListSubheader, ListItemAvatar, Avatar, Divider, DialogContentText } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
// Custom
import { FlightPlanDataForReport } from '../modal/FlightPlanDataForReport';
import { ServiceOrderForReport } from '../modal/ServiceOrderForReport';
import { useAuth } from '../../../../../context/Auth';
import { ReportVisualization, DownloadReport } from '../modal/ReportBuilder';
// Lib
import axios from '../../../../../../services/AxiosApi';

const initialControlledInput = {
  name: '',
  client: '0',
  state: '',
  city: '',
  farm: ''
}

const initialFieldError = {
  name: false,
  client: false,
  state: false,
  city: false,
  farm: false
}

const initialFieldErrorMessage = {
  name: '',
  client: '',
  state: '',
  city: '',
  farm: ''
}

const initialDisplayAlert = { display: false, type: "", message: "" };

export const CreateReport = (props) => {

  // ============================================================================== STATES  ============================================================================== //

  const { user } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [displayAlert, setDisplayAlert] = React.useState(initialDisplayAlert);
  const [fieldError, setFieldError] = React.useState(initialFieldError);
  const [fieldErrorMessage, setFieldErrorMessage] = React.useState(initialFieldErrorMessage);
  const [controlledInput, setControlledInput] = React.useState(initialControlledInput);
  const [serviceOrder, setServiceOrder] = React.useState(null);
  const [flightPlans, setFlightPlans] = React.useState(null);
  const [canSave, setCanSave] = React.useState(false);

  // ============================================================================== FUNCTIONS ============================================================================== //

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setServiceOrder(null);
    setFlightPlans(null);
    setDisplayAlert(initialDisplayAlert);
  }

  function handleSubmit(report_blob) {

    if (formValidation()) {
      setLoading(true);

      const report_file = new File([report_blob], `${controlledInput.name}.pdf`, { type: 'application/pdf' });

      const formData = new FormData();
      formData.append('name', controlledInput.name);
      formData.append('file', report_file);
      formData.append('blob', report_blob);
      formData.append('service_order_id', serviceOrder.id)

      axios.post("/api/reports-module", formData, {
        headers: {
          'Content-Type': 'application/pdf'
        }
      })
        .then((response) => {
          successResponse(response);
        })
        .catch(function (error) {
          errorResponse(error.response);
        })
        .finally(() => {
          setLoading(false);
        })
    }
  }

  function formValidation() {

    let inputs_validate = [];
    let controlledInputErrors = {};
    for (let field in controlledInput) {
      let is_invalid = (controlledInput[field] == null || controlledInput[field].length == 0);
      controlledInputErrors[field] = is_invalid;
      inputs_validate.push(is_invalid ? 0 : 1);
    }

    setFieldError(controlledInputErrors);

    // If includes 0, form is invalid, an the true result turns into false
    return !inputs_validate.includes(0);
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

    let request_errors = {};
    let request_messages = {};

    for (let prop in response.data.errors) {
      request_errors[prop] = true;
      request_messages[prop] = response.data.errors[prop][0];
    }

    setFieldError(request_errors);
    setFieldErrorMessage(request_messages);
  }

  React.useEffect(() => {
    if (flightPlans) {
      const is_data_completed = flightPlans.length == flightPlans.reduce((acm, current) => {
        return acm += current.completed ? 1 : 0
      }, 0);
      setCanSave(is_data_completed);
    }
  }, [flightPlans]);

  function handleInputChange(event) {
    setControlledInput({ ...controlledInput, [event.target.name]: event.currentTarget.value });
  }

  // ============================================================================== STRUCTURES - MUI ============================================================================== //

  return (
    <>

      <Tooltip title="Gerar relatório">
        <IconButton disabled={!user.user_powers["4"].profile_powers.write == 1} onClick={handleClickOpen}>
          <FontAwesomeIcon icon={faPlus} size="sm" color={user.user_powers["4"].profile_powers.write == 1 ? "#007937" : "#E0E0E0"} />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ style: { borderRadius: 15 } }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>GERAÇÃO DE RELATÓRIO</DialogTitle>
        <Divider />

        <DialogContent>

          <DialogContentText sx={{ mb: 2 }}>
            Preencha todos os dados requisitados no formulário para a criação do relatório.
          </DialogContentText>

          <Box mb={3}>
            <ServiceOrderForReport
              serviceOrder={serviceOrder}
              setControlledInput={setControlledInput}
              setServiceOrder={setServiceOrder}
              serviceOrderId={null}
              setFlightPlans={setFlightPlans}
            />
          </Box>

          {serviceOrder &&
            <>
              <Grid container spacing={2} mb={2}>

                <Grid item xs={6}>
                  <TextField
                    id="responsible"
                    name="responsible"
                    label="Responsável (piloto)"
                    fullWidth
                    variant="outlined"
                    value={serviceOrder.users.pilot.name}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    id="name"
                    name="name"
                    label="Nome do relatório"
                    fullWidth
                    variant="outlined"
                    onChange={handleInputChange}
                    value={controlledInput.name}
                    error={fieldError.name}
                    helperText={fieldErrorMessage.name}
                  />
                </Grid>

                {/* State and city are updated on ServiceOrderForReport modal */}
                <Grid item xs={6}>
                  <TextField
                    id="name"
                    name="state"
                    label="Estado"
                    fullWidth
                    variant="outlined"
                    onChange={handleInputChange}
                    value={controlledInput.state}
                    error={fieldError.state}
                    helperText={fieldErrorMessage.state}
                    inputProps={{
                      readOnly: true
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    id="name"
                    name="city"
                    label="Cidade"
                    fullWidth
                    variant="outlined"
                    onChange={handleInputChange}
                    value={controlledInput.city}
                    error={fieldError.city}
                    helperText={fieldErrorMessage.city}
                    inputProps={{
                      readOnly: true
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={12}>
                  <TextField
                    name="farm"
                    label="Fazenda"
                    fullWidth
                    variant="outlined"
                    onChange={handleInputChange}
                    helperText={fieldErrorMessage.farm}
                    error={fieldError.farm}
                    value={controlledInput.farm}
                  />
                </Grid>
              </Grid>

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
                    <ListSubheader sx={{ bgcolor: '#1976D2', color: '#fff', fontWeight: 'bold' }}>{`PLANOS DE VOO: ${serviceOrder.flight_plans.length}`}</ListSubheader>
                    {flightPlans.map((flight_plan, index) => (
                      <ListItem
                        key={index}
                        secondaryAction={
                          <FlightPlanDataForReport
                            flightPlans={flightPlans}
                            setFlightPlans={setFlightPlans}
                            current={{ array_index: index, data: flight_plan }}
                          />
                        }
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: flight_plan.completed ? '#4CAF50' : '' }}>
                            <CheckCircleIcon />
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
            </>
          }
        </DialogContent>

        {displayAlert.display &&
          <Alert severity={displayAlert.type}>{displayAlert.message}</Alert>
        }

        {loading && <LinearProgress />}

        <Divider />
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          {serviceOrder && <ReportVisualization basicData={controlledInput} flightPlans={flightPlans} />}
          {flightPlans && <DownloadReport data={controlledInput} flightPlans={flightPlans} canSave={canSave} handleRequestServerToSaveReport={handleSubmit} />}
        </DialogActions>

      </Dialog >
    </>
  );
}