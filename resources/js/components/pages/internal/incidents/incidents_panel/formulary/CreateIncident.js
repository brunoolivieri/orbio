import * as React from 'react';
// Material UI
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton, Alert, LinearProgress, TextField, Grid, FormHelperText, Divider } from '@mui/material';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
// Custom
import { DatePicker } from '../../../../../shared/date_picker/DatePicker';
import axios from '../../../../../../services/AxiosApi';
import { useAuth } from '../../../../../context/Auth';
import { FormValidation } from '../../../../../../utils/FormValidation';
import { SelectExternalData } from '../../../../../shared/input_select/SelectExternalData';
// Libs
import moment from 'moment';

const initialFormData = { type: "", description: "", date: moment() };
const fieldError = { error: false, message: "" }
const initialFormError = { type: fieldError, description: fieldError, date: fieldError, flight_plan_id: fieldError, service_order_id: fieldError }
const initialDisplayAlert = { display: false, type: "", message: "" };

export const CreateIncident = React.memo((props) => {

  // ============================================================================== STATES ============================================================================== //

  const { user } = useAuth();

  const [formData, setFormData] = React.useState(initialFormData);
  const [formError, setFormError] = React.useState(initialFormError);
  const [displayAlert, setDisplayAlert] = React.useState(initialDisplayAlert);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  // Select Inputs
  const [serviceOrdersByFlightPlan, setServiceOrdersByFlightPlan] = React.useState([]);
  const [flightPlans, setFlightPlans] = React.useState([]);
  const [selectedFlightPlan, setSelectedFlightPlan] = React.useState("0");
  const [selectedServiceOrder, setSelectedServiceOrder] = React.useState("0");

  // ============================================================================== FUNCTIONS ============================================================================== //

  React.useEffect(() => {

    axios.get(`api/load-service-orders/${selectedFlightPlan}`, {
    })
      .then(function (response) {
        setServiceOrdersByFlightPlan(response.data);
      })
      .catch(function (error) {
        setLoading(false);
        errorResponse(error.response);
      });

  }, [selectedFlightPlan]);

  function handleOpen() {
    setOpen(true);

    axios.get("/api/load-flight-plans", {
    })
      .then(function (response) {
        setFlightPlans(response.data);
        setSelectedFlightPlan("0");
        setSelectedServiceOrder("0");
      })
      .catch(function (error) {
        setLoading(false);
        errorResponse(error.response);
      });
  }

  function handleClose() {
    setOpen(false);
    setLoading(false);
    setFormData(initialFormData);
    setFormError(initialFormError);
    setDisplayAlert(initialDisplayAlert);
  }

  function handleSubmit() {
    if (!formSubmissionValidation()) return ''
    setLoading(true);
    requestServer();
  }

  function formSubmissionValidation() {

    let validation = Object.assign({}, initialFormError);

    validation["type"] = FormValidation(formData["type"], 3, 255);
    validation["date"] = formData.date != null ? { error: false, message: "" } : { error: true, message: "Selecione a data inicial" };
    validation["description"] = FormValidation(formData["description"], 3, 255);
    validation["flight_plan_id"] = selectedFlightPlan != "0" ? { error: false, message: "" } : { error: false, message: "Selecione um plano de voo" };
    validation["service_order_id"] = selectedServiceOrder != "0" ? { error: false, message: "" } : { error: false, message: "Selecione uma ordem de serviço" };

    setFormError(validation);

    return !(validation.type.error || validation.date.error || validation.description.error || validation.flight_plan_id.error || validation.service_order_id.error);
  }

  async function requestServer() {

    try {

      const response = await axios.post("/api/incidents-module", {
        date: moment(formData.date).format('YYYY-MM-DD'),
        type: formData.type,
        description: formData.description,
        flight_plan_id: selectedFlightPlan,
        service_order_id: selectedServiceOrder
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
    setDisplayAlert({ display: true, type: "error", message: response.data.message });

    let response_errors = {}

    for (let field in response.data.errors) {
      response_errors[field] = {
        error: true,
        message: response.data.errors[field][0]
      }
    }

    setFormError(response_errors);
  }

  function handleInputChange(event) {
    setFormData({ ...formData, [event.target.name]: event.currentTarget.value });
  }

  // ============================================================================== STRUCTURES ============================================================================== //

  return (
    <>
      <Tooltip title="Novo incidente">
        <IconButton onClick={handleOpen} disabled={!user.user_powers["5"].profile_powers.write == 1}>
          <FontAwesomeIcon icon={faPlus} color={user.user_powers["5"].profile_powers.write == 1 ? "#007937" : "#E0E0E0"} size="sm" />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ style: { borderRadius: 15 } }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>CADASTRO DE INCIDENTE</DialogTitle>
        <Divider />

        <DialogContent>
          <Grid item container spacing={1} mt={1}>

            <Grid item xs={12}>
              <DatePicker
                setControlledInput={setFormData}
                controlledInput={formData}
                name={"date"}
                label={"Data do incidente"}
                error={formError.date.error}
                value={formData.date}
                operation={"create"}
                read_only={false}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                type="text"
                margin="dense"
                label="Tipo"
                fullWidth
                variant="outlined"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                helperText={formError.type.message}
                error={formError.type.error}
              />
            </Grid>

            <Grid item xs={12} mb={1}>
              <TextField
                type="text"
                margin="dense"
                label="Descrição"
                fullWidth
                variant="outlined"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                helperText={formError.description.message}
                error={formError.description.error}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <SelectExternalData
                label_text={"Plano de voo"}
                primary_key={"id"}
                key_content={"name"}
                setter={setSelectedFlightPlan}
                options={flightPlans}
                error={formError.flight_plan_id.error}
                value={selectedFlightPlan}
              />
              <FormHelperText error>{formError.flight_plan_id.message}</FormHelperText>
            </Grid>

            <Grid item xs={12} md={6}>
              <SelectExternalData
                label_text={"Ordem de serviço"}
                primary_key={"id"}
                key_content={"number"}
                setter={setSelectedServiceOrder}
                options={serviceOrdersByFlightPlan}
                error={formError.service_order_id.error}
                value={selectedServiceOrder}
              />
              <FormHelperText error>{formError.service_order_id.message}</FormHelperText>
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
          <Button disabled={loading} variant="contained" onClick={handleSubmit}>Confirmar</Button>
        </DialogActions>
      </Dialog >
    </>
  )
});