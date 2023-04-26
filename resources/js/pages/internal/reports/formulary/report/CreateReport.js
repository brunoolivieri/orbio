import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Box, Alert, IconButton, Tooltip, Grid, TextField, LinearProgress, List, ListItem, ListItemText, ListSubheader, ListItemAvatar, Avatar, Divider, DialogContentText } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FlightPlanDataForReport } from '../flight-plan/FlightPlanDataForReport';
import { ServiceOrderForReport } from '../../table-selection/ServiceOrderForReport';
import { useAuth } from '../../../../../context/Auth';
import { ReportVisualization, UploadReport } from "../../modal/ReportBuilder";
import axios from '../../../../../services/AxiosApi';

const initialFormData = {
  name: '',
  client: '0',
  state: '',
  city: '',
  farm: ''
}

const fieldError = { error: false, message: "" };
const initialFormError = { name: fieldError, client: fieldError, state: fieldError, city: fieldError, farm: fieldError };
const initialAlert = { display: false, type: "", message: "" };

export const CreateReport = (props) => {

  // ============================================================================== STATES  ============================================================================== //

  const { user } = useAuth();
  const [formError, setFormError] = React.useState(initialFormError);
  const [formData, setFormData] = React.useState(initialFormData);
  const [serviceOrder, setServiceOrder] = React.useState(null);
  const [flightPlans, setFlightPlans] = React.useState(null);
  const [canSave, setCanSave] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [alert, setAlert] = React.useState(initialAlert);

  const is_authorized = !!user.user_powers["4"].profile_powers.write;

  // ============================================================================== FUNCTIONS ============================================================================== //

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setServiceOrder(null);
    setFlightPlans(null);
    setAlert(initialAlert);
  }

  React.useEffect(() => {
    if (flightPlans) {
      const is_data_completed = flightPlans.length == flightPlans.reduce((acm, current) => {
        return acm += current.completed ? 1 : 0
      }, 0);
      setCanSave(is_data_completed);
    }
  }, [flightPlans]);

  async function handleSubmit(report_blob) {

    if (!formSubmissionValidation()) {
      return;
    }

    setLoading(true);

    try {

      const report_file = new File([report_blob], `${formData.name}.pdf`, { type: 'application/pdf' });

      const formData_ = new FormData();
      formData_.append('name', formData.name);
      formData_.append('file', report_file);
      formData_.append('blob', report_blob);
      formData_.append('service_order_id', serviceOrder.id);

      const response = await axios.post("api/module/reports", formData_, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      successResponse(response);

    } catch (error) {
      console.log(error.message)
      errorResponse(error.response);
    } finally {
      setLoading(false);
    }

  }

  function formSubmissionValidation() {

    let validation = Object.assign({}, formError);

    for (let field in formData) {
      if (formData[field] === null || formData[field].length === 0) {
        validation[field] = { error: true, message: "O campo deve ser preenchido" }
      }
    }

    setFormError(validation);

    return !(validation.name.error || validation.city.error || validation.state.error || validation.farm.error || validation.farm.error);
  }

  function successResponse(response) {
    setAlert({ display: true, type: "success", message: response.data.message });
    setTimeout(() => {
      props.reloadTable((old) => !old);
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
    setFormData({ ...formData, [event.target.name]: event.currentTarget.value });
  }

  // ============================================================================== STRUCTURES - MUI ============================================================================== //

  return (
    <>

      <Tooltip title="Gerar relatório">
        <IconButton disabled={!is_authorized} onClick={handleClickOpen}>
          <FontAwesomeIcon icon={faPlus} size="sm" color={is_authorized ? "#007937" : "#E0E0E0"} />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ style: { borderRadius: 15 } }}
        fullWidth
        maxWidth="xl"
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
              setControlledInput={setFormData}
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
                    name="name"
                    label="Nome do relatório"
                    fullWidth
                    variant="outlined"
                    onChange={handleInputChange}
                    value={formData.name}
                    error={formError.name.error}
                    helperText={formError.name.message}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    name="state"
                    label="Estado"
                    fullWidth
                    variant="outlined"
                    onChange={handleInputChange}
                    value={formData.state}
                    error={formError.state.error}
                    helperText={formError.state.message}
                    inputProps={{
                      readOnly: true
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    name="city"
                    label="Cidade"
                    fullWidth
                    variant="outlined"
                    onChange={handleInputChange}
                    value={formData.city}
                    error={formError.city.error}
                    helperText={formError.city.message}
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
                    helperText={formError.farm.message}
                    error={formError.farm.error}
                    value={formData.farm}
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

        {alert.display &&
          <Alert severity={alert.type}>{alert.message}</Alert>
        }

        {loading && <LinearProgress />}

        <Divider />
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          {serviceOrder && <ReportVisualization basicData={formData} flightPlans={flightPlans} />}
          {flightPlans && <UploadReport data={formData} flightPlans={flightPlans} canSave={canSave} handleRequestServerToSaveReport={handleSubmit} />}
        </DialogActions>

      </Dialog >
    </>
  );
}