// React
import * as React from 'react';
// Material UI
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import { Alert } from '@mui/material';
import { IconButton } from '@mui/material';
import { Tooltip } from "@mui/material";
import LinearProgress from '@mui/material/LinearProgress';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
// Outros
import moment from 'moment';
// Custom
import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';
import { FormValidation } from '../../../../utils/FormValidation';
import AxiosApi from '../../../../services/AxiosApi';
import { DateTimeSingle } from "../../date_picker/DateTimeSingle";

export function UpdateIncidentFormulary({ ...props }) {

  // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

  const { AuthData } = useAuthentication();
  const [controlledInput, setControlledInput] = React.useState({ id: props.record.id, type: props.record.type, description: props.record.description });
  const [fieldError, setFieldError] = React.useState({ date: false, type: false, description: false });
  const [fieldErrorMessage, setFieldErrorMessage] = React.useState({ date: "", type: "", description: "" });
  const [displayAlert, setDisplayAlert] = React.useState({ display: false, type: "", message: "" });
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [incidentDate, setIncidentDate] = React.useState(moment());

  // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

  const handleClickOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setFieldError({ date: false, type: false, description: false });
    setFieldErrorMessage({ date: "", type: "", description: "" });
    setDisplayAlert({ display: false, type: "", message: "" });
    setLoading(false);
    setOpen(false);
  }

  const handleSubmitOperation = (event) => {
    event.preventDefault();

    if (formularyDataValidation()) {

      setLoading(true);
      requestServerOperation();

    }

  }

  const formularyDataValidation = () => {

    const incidentDateValidate = incidentDate != null ? { error: false, message: "" } : { error: true, message: "Selecione a data inicial" };
    const incidentTypeValidate = FormValidation(controlledInput.type, 2, null, null, null);
    const incidentNoteValidate = FormValidation(controlledInput.description, 3, null, null, null);

    setFieldError({ date: incidentDateValidate.error, type: incidentTypeValidate.error, description: incidentNoteValidate.error });
    setFieldErrorMessage({ date: incidentDateValidate.message, type: incidentTypeValidate.message, description: incidentNoteValidate.message });

    return !(incidentDateValidate.error || incidentTypeValidate.error || incidentNoteValidate.error);

  }

  const requestServerOperation = () => {

    AxiosApi.patch(`/api/incidents-module/${controlledInput.id}`, {
      date: moment(incidentDate).format('YYYY-MM-DD hh:mm:ss'),
      type: controlledInput.type,
      description: controlledInput.description,
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
      handleClose();
    }, 2000);

  }

  const errorServerResponseTreatment = (response) => {

    const error_message = response.data.message ? response.data.message : "Erro do servidor";
    setDisplayAlert({ display: true, type: "error", message: error_message });

    // Definição dos objetos de erro possíveis de serem retornados pelo validation do Laravel
    let request_errors = {
      date: { error: false, message: null },
      type: { error: false, message: null },
      description: { error: false, message: null }
    }

    // Coleta dos objetos de erro existentes na response
    for (let prop in response.data.errors) {

      request_errors[prop] = {
        error: true,
        message: response.data.errors[prop][0]
      }

    }

    setFieldError({
      date: request_errors.date.error,
      type: request_errors.type.error,
      description: request_errors.description.error
    });

    setFieldErrorMessage({
      date: request_errors.date.message,
      type: request_errors.type.message,
      description: request_errors.description.message
    });

  }

  const handleInputChange = (event) => {
    setControlledInput({ ...controlledInput, [event.target.name]: event.currentTarget.value });
  }

  // ============================================================================== ESTRUTURAÇÃO DA PÁGINA - MATERIAL UI ============================================================================== //

  return (
    <>
      <Tooltip title="Editar">
        <IconButton disabled={AuthData.data.user_powers["5"].profile_powers.read == 1 ? false : true} onClick={handleClickOpen}>
          <FontAwesomeIcon icon={faPen} color={AuthData.data.user_powers["5"].profile_powers.read == 1 ? "#007937" : "#808991"} size="sm" />
        </IconButton>
      </Tooltip>

      {(props.record != null && open) &&

        <Dialog open={open} onClose={handleClose} PaperProps={{ style: { borderRadius: 15 } }}>
          <DialogTitle>ATUALIZAÇÃO | INCIDENTE (ID: {props.record.id})</DialogTitle>

          <Box component="form" noValidate onSubmit={handleSubmitOperation} >

            <DialogContent>

              <TextField
                type="text"
                margin="dense"
                label="ID do incidente"
                fullWidth
                variant="outlined"
                required
                name="id"
                InputProps={{
                  readOnly: true
                }}
                defaultValue={props.record.id}
                sx={{ mb: 2 }}
              />

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <DateTimeSingle
                  event={setIncidentDate}
                  label={"Data do incidente"}
                  helperText={fieldErrorMessage.date}
                  error={fieldError.date}
                  defaultValue={props.record.date}
                  operation={"create"}
                  read_only={false}
                />
              </Box>

              <TextField
                type="text"
                margin="dense"
                label="Tipo do incidente"
                fullWidth
                variant="outlined"
                required
                name="type"
                onChange={handleInputChange}
                helperText={fieldErrorMessage.type}
                error={fieldError.type}
                defaultValue={props.record.type}
                sx={{ mb: 2 }}
              />

              <TextField
                type="text"
                margin="dense"
                label="Descrição"
                fullWidth
                variant="outlined"
                required
                name="description"
                onChange={handleInputChange}
                helperText={fieldErrorMessage.description}
                error={fieldError.description}
                defaultValue={props.record.description}
              />

            </DialogContent>

            {(!loading && displayAlert.display) &&
              <Alert severity={displayAlert.type}>{displayAlert.message}</Alert>
            }

            {loading && <LinearProgress />}

            <DialogActions>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button type="submit" disabled={loading} variant="contained">Confirmar</Button>
            </DialogActions>

          </Box>

        </Dialog>
      }
    </>
  )

}