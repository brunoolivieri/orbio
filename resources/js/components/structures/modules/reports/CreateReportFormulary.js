// React
import * as React from 'react';
// Material UI
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import { Alert, IconButton } from '@mui/material';
import { Tooltip } from '@mui/material';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import LinearProgress from '@mui/material/LinearProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
// Custom
import { FlightPlanDataForReport } from '../../modals/dialog/FlightPlanDataForReport';
import { ServiceOrderForReport } from '../../modals/fullscreen/ServiceOrderForReport';
import { SelectAttributeControl } from '../../input_select/SelectAttributeControl';
import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';
import { ReportVisualization } from '../../modals/fullscreen/ReportVisualization';
// Lib
import AxiosApi from '../../../../services/AxiosApi';

const initialControlledInput = {
  name: '',
  client: '0',
  state: '',
  city: '',
  farm: ''
}

const initialFieldError = {
  service_order: false,
  name: false,
  client: false,
  state: false,
  city: false,
  farm: false
}

const initialFieldErrorMessage = {
  service_order: '',
  name: '',
  client: '',
  state: '',
  city: '',
  farm: ''
}

export const CreateReportFormulary = () => {

  // ============================================================================== STATES  ============================================================================== //

  const { AuthData } = useAuthentication();
  const [loading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [displayAlert, setDisplayAlert] = React.useState({ display: false, type: "", message: "" });
  const [fieldError, setFieldError] = React.useState(initialFieldError);
  const [fieldErrorMessage, setFieldErrorMessage] = React.useState(initialFieldErrorMessage);
  const [controlledInput, setControlledInput] = React.useState(initialControlledInput);
  const [serviceOrder, setServiceOrder] = React.useState(null);
  const [flightPlans, setFlightPlans] = React.useState(null);

  // ============================================================================== FUNCTIONS ============================================================================== //

  const handleClickOpen = () => {
    setOpen(true);
    setServiceOrder(null);
    setFlightPlans(null);
  }

  const handleClose = () => {
    setDisplayAlert({ display: false, type: "", message: "" });
    setOpen(false);
  }

  const handleInputChange = (event) => {
    setControlledInput({ ...controlledInput, [event.target.name]: event.currentTarget.value });
  }

  const handleReportGenerate = (e) => {
    e.preventDefault();

    AxiosApi.post("api/export-report-pdf", controlledInput)
      .then((response) => {

        const base64PDF = response.data;

        //let bin = atob(base64PDF);
        let obj = document.createElement('object');
        obj.style.width = '100%';
        obj.style.height = '842pt';
        obj.type = 'application/pdf';
        obj.data = 'data:application/pdf;base64,' + base64PDF;
        document.body.appendChild(obj);

        // Insert a link that allows the user to download the PDF file
        let link = document.createElement('a');
        link.innerHTML = 'Download PDF file';
        link.download = 'file.pdf';
        link.href = 'data:application/octet-stream;base64,' + base64PDF;
        document.body.appendChild(link);
        link.click();

      })
      .catch(function (error) {

        console.log(error);
        errorServerRequestTreatment(error.response);

      });
  }

  const errorServerRequestTreatment = (response) => {

    const error_message = response.data.message ? response.data.message : "Erro do servidor";
    setDisplayAlert({ display: true, type: "error", message: error_message });

    // Errors by key that can be returned from backend validation
    let request_errors = {
      name: { error: false, message: null },
      client: { error: false, message: null },
      state: { error: false, message: null },
      city: { error: false, message: null },
      farm: { error: false, message: null },
      responsible: { error: false, message: null }
    }

    // Get errors by their key 
    for (let prop in response.data.errors) {

      request_errors[prop] = {
        error: true,
        message: response.data.errors[prop][0]
      }

    }

    setFieldError({
      name: request_errors.name.error,
      client: request_errors.client.error,
      state: request_errors.state.error,
      city: request_errors.city.error,
      farm: request_errors.farm.error,
      responsible: request_errors.responsible.error
    });

    setFieldErrorMessage({
      name: request_errors.name.message,
      client: request_errors.client.message,
      city: request_errors.city.message,
      farm: request_errors.farm.message,
      responsible: request_errors.responsible.message
    });
  }

  // ============================================================================== STRUCTURES - MUI ============================================================================== //

  return (
    <>

      <Tooltip title="Gerar relatório">
        <IconButton disabled={AuthData.data.user_powers["4"].profile_powers.read == 1 ? false : true} onClick={handleClickOpen}>
          <FontAwesomeIcon icon={faPlus} size="sm" color={AuthData.data.user_powers["4"].profile_powers.read == 1 ? "green" : "#808991"} />
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

        <Box component="form" noValidate onSubmit={handleReportGenerate}>
          <DialogContent>

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
                    <SelectAttributeControl
                      label_text={"Responsável (piloto)"}
                      data_source={"/api/load-users?where=profile_id.3"}
                      primary_key={"name"}
                      key_content={"name"}
                      error={fieldError.responsible}
                      name={"responsible"}
                      value={controlledInput.responsible}
                      setControlledInput={setControlledInput}
                      controlledInput={controlledInput}
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

          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            {serviceOrder && <ReportVisualization basicData={controlledInput} flightPlans={flightPlans} />}
            <Button type="submit" variant='contained'>Exportar</Button>
          </DialogActions>

        </Box>


      </Dialog >
    </>

  );

}