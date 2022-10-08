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
// Custom
import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';
import { FormValidation } from '../../../../utils/FormValidation';
import AxiosApi from '../../../../services/AxiosApi';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

export const UpdatePlanFormulary = React.memo(({ ...props }) => {

  // ============================================================================== STATES ============================================================================== //

  const { AuthData } = useAuthentication();
  const [controlledInput, setControlledInput] = React.useState({ id: props.record.id, name: props.record.name, description: props.record.description });
  const [fieldError, setFieldError] = React.useState({ name: false, description: false });
  const [fieldErrorMessage, setFieldErrorMessage] = React.useState({ name: "", description: "" });
  const [displayAlert, setDisplayAlert] = React.useState({ display: false, type: "", message: "" });
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  // ============================================================================== FUNCTIONS ============================================================================== //

  const handleClickOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setFieldError({ description: false });
    setFieldErrorMessage({ description: "" });
    setDisplayAlert({ display: false, type: "", message: "" });
    setLoading(false);
    setOpen(false);
  };

  const handleSubmitOperation = (event) => {
    event.preventDefault();

    if (formularyDataValidate()) {

      setLoading(true);
      requestServerOperation();

    }

  }

  const formularyDataValidate = () => {

    const nameValidate = FormValidation(controlledInput.name, 3, null, null, "nome");
    const descriptionValidate = FormValidation(controlledInput.description, 3, null, null, "descrição");

    console.log(controlledInput)

    setFieldError({ name: nameValidate.error, description: descriptionValidate.error });
    setFieldErrorMessage({ name: nameValidate.message, description: descriptionValidate.message });

    return !(nameValidate.error || descriptionValidate.error);

  }

  const requestServerOperation = () => {

    AxiosApi.patch(`/api/plans-module/${controlledInput.id}`, {
      name: controlledInput.name,
      description: controlledInput.description
    })
      .then(function (response) {

        setLoading(false);
        successServerResponseTreatment(response);

      })
      .catch(function (error) {

        setLoading(false);
        errorServerResponseTreatment(error.response.data);

      });

  }

  const successServerResponseTreatment = (response) => {

    setDisplayAlert({ display: true, type: "success", message: response.data.message });

    setTimeout(() => {
      props.record_setter(null);
      props.reload_table();
      setLoading(false);
      handleClose();
    }, 2000);

  }

  const errorServerResponseTreatment = (response_data) => {
    console.log(response_data)
    const error_message = response_data.message ? response_data.message : "Erro do servidor";

    setDisplayAlert({ display: true, type: "error", message: error_message });

    let request_errors = {
      name: { error: false, message: null },
      description: { error: false, message: null }
    }

    for (let prop in response_data.errors) {

      request_errors[prop] = {
        error: true,
        message: response_data.errors[prop][0]
      }

    }

    setFieldError({
      name: request_errors.name.error,
      description: request_errors.description.error
    });

    setFieldErrorMessage({
      name: request_errors.name.message,
      description: request_errors.description.message
    });

  }

  const handleInputChange = (event) => {
    setControlledInput({ ...controlledInput, [event.target.name]: event.currentTarget.value });
  }

  // ============================================================================== STRUCTURES - MUI ============================================================================== //

  return (
    <>
      <Tooltip title="Editar">
        <IconButton disabled={AuthData.data.user_powers["2"].profile_powers.write == 1 ? false : true} onClick={handleClickOpen}>
          <FontAwesomeIcon icon={faPen} color={AuthData.data.user_powers["2"].profile_powers.write == 1 ? "#007937" : "#808991"} size="sm" />
        </IconButton>
      </Tooltip>

      {(props.record != null && open) &&
        <Dialog open={open} onClose={handleClose} PaperProps={{ style: { borderRadius: 15 } }} fullWidth>
          <DialogTitle>EDIÇÃO | PLANO DE VOO (ID: {props.record.id})</DialogTitle>

          <Box component="form" noValidate onSubmit={handleSubmitOperation} >
            <DialogContent>

              <TextField
                margin="dense"
                id="id"
                name="id"
                label="ID do plano"
                type="text"
                fullWidth
                variant="outlined"
                onChange={handleInputChange}
                defaultValue={props.record.id}
                inputProps={{
                  readOnly: true
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                margin="dense"
                id="name"
                name="name"
                label="Nome do plano"
                type="text"
                fullWidth
                variant="outlined"
                onChange={handleInputChange}
                defaultValue={props.record.name}
                helperText={fieldErrorMessage.name}
                error={fieldError.name}
                sx={{ mb: 2 }}
              />

              <TextField
                margin="dense"
                name="description"
                label="Descrição"
                type="text"
                fullWidth
                variant="outlined"
                onChange={handleInputChange}
                defaultValue={props.record.description}
                helperText={fieldErrorMessage.description}
                error={fieldError.description}
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
  );
});