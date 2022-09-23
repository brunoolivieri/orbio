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
import { Tooltip } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
// Custom
import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';
import { FormValidation } from '../../../../utils/FormValidation';
import AxiosApi from '../../../../services/AxiosApi';

export const UpdateReportFormulary = React.memo((props) => {

  // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

  const { AuthData } = useAuthentication();
  const [open, setOpen] = React.useState(false);
  const [controlledInput, setControlledInput] = React.useState({ id: props.record.id, observation: props.record.observation });
  const [fieldError, setFieldError] = React.useState({ observation: false });
  const [fieldErrorMessage, setFieldErrorMessage] = React.useState({ observation: "" });
  const [displayAlert, setDisplayAlert] = React.useState({ display: false, type: "", message: "" });
  const [loading, setLoading] = React.useState(false);

  // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

  const handleClickOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setFieldError({ observation: false });
    setFieldErrorMessage({ observation: "" });
    setDisplayAlert({ display: false, type: "", message: "" });
    setOpen(false);
    setLoading(false);
  };

  const handleSubmitOperation = (event) => {
    event.preventDefault();

    if (submitedDataValidate()) {

      setLoading(true);
      requestServerOperation();

    }

  }

  function submitedDataValidate() {

    const observationValidate = FormValidation(controlledInput.observation, 3, null, null, null);

    setFieldError({ observation: observationValidate.error });
    setFieldErrorMessage({ observation: observationValidate.message });

    return !observationValidate.error;

  }

  function requestServerOperation(data) {

    AxiosApi.patch(`/api/reports-module/${data.get("id")}`, controlledInput)
      .then(function () {

        setLoading(false);
        successServerResponseTreatment();

      })
      .catch(function (error) {

        setLoading(false);
        errorServerResponseTreatment(error.response.data);

      });

  }

  function successServerResponseTreatment() {

    setDisplayAlert({ display: true, type: "success", message: "Operação realizada com sucesso!" });

    setTimeout(() => {

      props.record_setter(null);
      props.reload_table();
      setLoading(false);
      handleClose();

    }, 2000);

  }

  function errorServerResponseTreatment(response_data) {

    let error_message = (response_data.message != "" && response_data.message != undefined) ? response_data.message : "Erro do servidor!";
    setDisplayAlert({ display: true, type: "error", message: error_message });

    // Definição dos objetos de erro possíveis de serem retornados pelo validation do Laravel
    let input_errors = {
      observation: { error: false, message: null },
    }

    // Coleta dos objetos de erro existentes na response
    for (let prop in response_data.errors) {

      input_errors[prop] = {
        error: true,
        message: response_data.errors[prop][0]
      }

    }

    setFieldError({
      observation: input_errors.observation.error
    });

    setFieldErrorMessage({
      observation: input_errors.observation.message
    });

  }

  const handleInputChange = (event) => {
    setControlledInput({ ...controlledInput, [event.target.name]: event.currentTarget.value });
  }

  // ============================================================================== ESTRUTURAÇÃO DA PÁGINA ============================================================================== //

  return (
    <>

      <Tooltip title="Editar">
        <IconButton disabled={AuthData.data.user_powers["4"].profile_powers.write == 1 ? false : true} onClick={handleClickOpen}>
          <FontAwesomeIcon icon={faPen} color={AuthData.data.user_powers["4"].profile_powers.write == 1 ? "#007937" : "#808991"} size="sm" />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} PaperProps={{ style: { borderRadius: 15 } }}>
        <DialogTitle>ATUALIZAÇÃO | RELATÓRIO (ID: {props.record.report_id})</DialogTitle>

        {/* Formulário da criação/registro do usuário - Componente Box do tipo "form" */}
        <Box component="form" noValidate onSubmit={handleSubmitOperation} >

          <DialogContent>

            <TextField
              margin="dense"
              id="id"
              name="id"
              label="ID"
              type="text"
              fullWidth
              variant="outlined"
              value={controlledInput.id}
              defaultValue={props.record.id}
              InputProps={{
                readOnly: true,
              }}
            />

            <TextField
              margin="dense"
              label="Log do vôo"
              type="text"
              fullWidth
              variant="outlined"
              defaultValue={props.record.log.name}
              InputProps={{
                inputProps: { min: 0, max: 1 },
                readOnly: true
              }}
            />

            <TextField
              margin="dense"
              id="observation"
              name="observation"
              label="Observação"
              type="text"
              fullWidth
              variant="outlined"
              value={controlledInput.observation}
              defaultValue={props.record.observation}
              helperText={fieldErrorMessage.observation}
              error={fieldError.observation}
              onChange={handleInputChange}
            />

          </DialogContent>

          {displayAlert.display &&
            <Alert severity={displayAlert.type}>{displayAlert.message}</Alert>
          }

          {loading && <LinearProgress />}

          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={loading}>Confirmar</Button>
          </DialogActions>

        </Box>

      </Dialog>

    </>

  );

});