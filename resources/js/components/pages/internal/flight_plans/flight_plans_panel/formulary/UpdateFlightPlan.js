import * as React from 'react';
// Material UI
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton, Alert, LinearProgress, TextField, Divider, Grid, Typography, MenuItem } from '@mui/material';
// Custom
import { useAuth } from '../../../../../context/Auth';
import { FormValidation } from '../../../../../../utils/FormValidation';
import axios from '../../../../../../services/AxiosApi';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

const initialFieldError = { name: { error: false, message: "" }, description: { error: false, message: "" }, service_order_id: { error: false, message: "" }, log_id: { error: false, message: "" } };
const initialDisplatAlert = { display: false, type: "", message: "" };

export const UpdateFlightPlan = React.memo((props) => {

  // ============================================================================== STATES ============================================================================== //

  const { user } = useAuth();

  const [formData, setFormData] = React.useState({ id: props.record.id, name: props.record.name, description: props.record.description });
  const [formError, setFormError] = React.useState(initialFieldError);
  const [serviceOrderId, setServiceOrderId] = React.useState("0");
  const [serviceOrders, setServiceOrders] = React.useState([]);
  const [logId, setLogId] = React.useState("0");
  const [logs, setLogs] = React.useState([]);
  const [displayAlert, setDisplayAlert] = React.useState(initialDisplatAlert);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  // ============================================================================== FUNCTIONS ============================================================================== //

  React.useEffect(() => {

    let is_mounted = true;

    axios.get("api/load-service-orders/" + props.record.id)
      .then((response) => {

        if (is_mounted) {
          setServiceOrders(response.data);
          return axios.get("api/load-logs");
        }

      })
      .then((response) => {
        setLogs(response.data);
      })
      .catch((error) => {
        console.log(error)
      });

    return () => {
      is_mounted = false;
    }

  }, []);

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setFormError(initialFieldError);
    setDisplayAlert({ display: false, type: "", message: "" });
    setLoading(false);
    setOpen(false);
  }

  function handleSubmit() {
    if (formValidation()) {
      setLoading(true);
      requestServerOperation();
    }
  }

  function formValidation() {

    const nameValidate = FormValidation(formData.name, 3, null, null, "nome");
    const descriptionValidate = FormValidation(formData.description, 3, null, null, "descrição");

    setFormError(
      {
        name: { error: nameValidate.error, message: nameValidate.message },
        description: { error: descriptionValidate.error, message: descriptionValidate.message },
        service_order_id: { error: false, message: "" },
        log_id: { error: false, message: "" }
      }
    );

    return !(nameValidate.error || descriptionValidate.error);
  }

  function requestServerOperation() {

    let data = {
      name: formData.name,
      description: formData.description
    };

    if (serviceOrderId != "0" && logId != "0") {
      data["service_order_id"] = serviceOrderId;
      data["log_id"] = logId;
    }

    axios.patch(`/api/plans-module/${formData.id}`, data)
      .then(function (response) {
        successResponse(response);
      })
      .catch(function (error) {
        errorResponse(error.response.data);
      })
      .finally(() => {
        setLoading(false);
      })
  }

  function successResponse(response) {
    setDisplayAlert({ display: true, type: "success", message: response.data.message });
    setTimeout(() => {
      props.reloadTable((old) => !old);
      setLoading(false);
      handleClose();
    }, 2000);
  }

  function errorResponse(response_data) {
    setDisplayAlert({ display: true, type: "error", message: response_data.message });

    let request_errors = {
      name: { error: false, message: null },
      description: { error: false, message: null },
      service_order_id: { error: false, message: null },
      log_id: { error: false, message: null },
    }

    for (let prop in response_data.errors) {
      request_errors[prop] = {
        error: true,
        message: response_data.errors[prop][0]
      }
    }

    setFormError(request_errors);
  }

  function handleInputChange(event) {
    setFormData({ ...formData, [event.target.name]: event.currentTarget.value });
  }

  // ============================================================================== STRUCTURES ============================================================================== //

  return (
    <>
      <Tooltip title="Editar">
        <IconButton disabled={!user.user_powers["2"].profile_powers.write == 1} onClick={handleClickOpen}>
          <FontAwesomeIcon icon={faPen} color={user.user_powers["2"].profile_powers.write == 1 ? "#007937" : "#E0E0E0"} size="sm" />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ style: { borderRadius: 15 } }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>ATUALIZAÇÃO DE PLANO DE VOO</DialogTitle>
        <Divider />

        <DialogContent>
          <Grid container spacing={1}>

            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="name"
                label="Nome do plano"
                type="text"
                fullWidth
                variant="outlined"
                onChange={handleInputChange}
                value={formData.name}
                helperText={formError.name.message}
                error={formError.name.error}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="description"
                label="Descrição"
                type="text"
                fullWidth
                variant="outlined"
                onChange={handleInputChange}
                value={formData.description}
                helperText={formError.description.message}
                error={formError.description.error}
              />
            </Grid>

            {serviceOrders.length > 0 &&
              <>
                <Grid item xs={12} mb={2} mt={1}>
                  <Typography>Este plano de voo está vinculado a ordens de serviço e pode ser vinculado a logs. Primeiro selecione a ordem de serviço em que este plano foi executado, e, em seguida, o log correspondente.</Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    label="Ordem de serviço"
                    value={serviceOrderId}
                    fullWidth
                    onChange={(e) => setServiceOrderId(e.target.value)}
                    error={formError.service_order_id.error}
                    helperText={formError.service_order_id.message}
                  >
                    <MenuItem value={"0"} disabled>
                      Escolha
                    </MenuItem>
                    {serviceOrders.map((service_order) =>
                      <MenuItem value={service_order.id} key={service_order.id}>
                        {service_order.number}
                      </MenuItem>
                    )}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    label="Log"
                    value={logId}
                    fullWidth
                    disabled={serviceOrderId === "0"}
                    onChange={(e) => setLogId(e.target.value)}
                    error={formError.log_id.error}
                    helperText={formError.log_id.message}
                  >
                    <MenuItem value={"0"} disabled>
                      Escolha
                    </MenuItem>
                    {serviceOrderId != "0" && logs.length > 0 && logs.map((log) =>
                      <MenuItem value={log.id} key={log.id}>
                        {log.name}
                      </MenuItem>
                    )}
                  </TextField>
                </Grid>
              </>
            }

          </Grid>
        </DialogContent>

        {(!loading && displayAlert.display) &&
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