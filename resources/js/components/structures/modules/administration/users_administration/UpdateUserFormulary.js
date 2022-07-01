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
import { useAuthentication } from '../../../../context/InternalRoutesAuth/AuthenticationContext';
import { FormValidation } from '../../../../../utils/FormValidation';
import { GenericSelect } from '../../../input_select/GenericSelect';
import AxiosApi from '../../../../../services/AxiosApi';
import { RadioInput } from '../../../radio_group/RadioInput';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

export const UpdateUserFormulary = React.memo(({ ...props }) => {

  // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

  const { AuthData } = useAuthentication();

  const [controlledInput, setControlledInput] = React.useState({ id: props.record.id, name: props.record.name, email: props.record.email, profile: props.record.profile_id, status: props.record.status });

  const [fieldError, setFieldError] = React.useState({ name: false, email: false, profile: false });
  const [fieldErrorMessage, setFieldErrorMessage] = React.useState({ name: "", email: "", profile: "" });

  const [displayAlert, setDisplayAlert] = React.useState({ display: false, type: "", message: "" });

  const [loading, setLoading] = React.useState(false);

  const [open, setOpen] = React.useState(false);

  // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

  const handleClickOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setFieldError({ email: false, name: false, profile: false, status: false });
    setFieldErrorMessage({ email: "", name: "", profile: "", status: "" });
    setDisplayAlert({ display: false, type: "", message: "" });
    setLoading(false);
    setOpen(false);
  }

  const handleSubmitOperation = (event) => {
    event.preventDefault();

    if (submitedDataValidate()) {

      setLoading(true);
      requestServerOperation();

    }

  }

  const submitedDataValidate = () => {

    const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    const emailValidate = FormValidation(controlledInput.email, null, null, emailPattern, "e-mail");
    const nameValidate = FormValidation(controlledInput.name, 3, null, null, null);
    const profileValidate = Number(controlledInput.profile) === 0 ? { error: true, message: "Selecione um perfil" } : { error: false, message: "" };
    const statusValidate = Number(controlledInput.status) != 0 && Number(controlledInput.status) != 1 ? { error: true, message: "O status deve ser 1 ou 0" } : { error: false, message: "" };

    setFieldError({ email: emailValidate.error, name: nameValidate.error, profile: profileValidate.error, status: statusValidate.error });
    setFieldErrorMessage({ email: emailValidate.message, name: nameValidate.message, profile: profileValidate.message, status: statusValidate.message });

    return !(emailValidate.error === true || nameValidate.error === true || profileValidate.error || statusValidate.error);

  }

  const requestServerOperation = () => {

    AxiosApi.patch(`/api/admin-module-user/${controlledInput.id}`, {
      name: controlledInput.name,
      email: controlledInput.email,
      status: controlledInput.status,
      profile_id: controlledInput.profile
    })
      .then((response) => {

        setLoading(false);
        successServerResponseTreatment(response);

      })
      .catch((error) => {

        setLoading(false);
        errorServerResponseTreatment(error.response);

      });

  }

  const successServerResponseTreatment = (response) => {

    setDisplayAlert({ display: true, type: "success", message: response.data.message });

    setTimeout(() => {

      props.reload_table();
      setLoading(false);
      handleClose();

    }, 2000);

  }

  const errorServerResponseTreatment = (response) => {

    const error_message = response.data.message ? response.data.message : "Erro do servidor";
    setDisplayAlert({ display: true, type: "error", message: error_message });

    // Errors by key that can be returned from backend validation 
    let request_errors = {
      email: { error: false, message: null },
      name: { error: false, message: null },
      profile_id: { error: false, message: null },
      status: { error: false, message: null },
    }

    // Get errors by their key 
    for (let prop in response.data.errors) {

      request_errors[prop] = {
        error: true,
        message: response.data.errors[prop][0]
      }

    }

    setFieldError({
      email: request_errors.email.error,
      name: request_errors.name.error,
      profile: request_errors.profile_id.error,
      status: request_errors.status.error
    });

    setFieldErrorMessage({
      email: request_errors.email.message,
      name: request_errors.name.message,
      profile: request_errors.profile_id.message,
      status: request_errors.status.message
    });

  }

  const handleInputChange = (event) => {
    setControlledInput({ ...controlledInput, [event.target.name]: event.currentTarget.value });
  }

  // ============================================================================== ESTRUTURAÇÃO DA PÁGINA ============================================================================== //

  return (
    <>

      <Tooltip title="Editar">
        <IconButton disabled={AuthData.data.user_powers["1"].profile_powers.write == 1 ? false : true} onClick={handleClickOpen}>
          <FontAwesomeIcon icon={faPen} color={AuthData.data.user_powers["1"].profile_powers.write == 1 ? "#007937" : "#808991"} size="sm" />
        </IconButton>
      </Tooltip>

      {(props.record != null && open) &&

        <Dialog open={open} onClose={handleClose} PaperProps={{ style: { borderRadius: 15 } }}>
          <DialogTitle>ATUALIZAÇÃO | USUÁRIO (ID: {props.record.id})</DialogTitle>

          <Box component="form" noValidate onSubmit={handleSubmitOperation} >

            <DialogContent>

              <TextField
                margin="dense"
                name="id"
                label="ID"
                type="email"
                fullWidth
                variant="outlined"
                value={controlledInput.id}
                inputProps={{
                  readOnly: true
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                margin="dense"
                name="name"
                label="Nome completo"
                fullWidth
                variant="outlined"
                onChange={handleInputChange}
                value={controlledInput.name}
                helperText={fieldErrorMessage.name}
                error={fieldError.name}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                name="email"
                label="Endereço de email"
                type="email"
                fullWidth
                variant="outlined"
                onChange={handleInputChange}
                defaultValue={props.record.email}
                helperText={fieldErrorMessage.email}
                error={fieldError.email}
                sx={{ mb: 2 }}
              />

              <Box sx={{ width: "auto", mb: 2 }}>
                <GenericSelect
                  label_text={"Perfil"}
                  data_source={"/api/load-profiles"}
                  primary_key={"id"}
                  key_content={"name"}
                  name={"profile"}
                  default={props.record.profile_id}
                  onChange={handleInputChange}
                  error={fieldError.profile}
                  value={controlledInput.profile}
                  setControlledInput={setControlledInput}
                  controlledInput={controlledInput}
                />
              </Box>

              <Box>
                <RadioInput
                  title={"Status"}
                  name={"status"}
                  default={props.record.status}
                  options={[{ label: "Ativo", value: "1" }, { label: "Inativo", value: "0" }]}
                  setControlledInput={setControlledInput}
                  controlledInput={controlledInput}
                />
              </Box>

            </DialogContent>

            {displayAlert.display &&
              <Alert severity={displayAlert.type}>{displayAlert.message}</Alert>
            }

            {loading && <LinearProgress />}

            <DialogActions>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button type="submit" disabled={loading} variant="contained">Confirmar atualização</Button>
            </DialogActions>

          </Box>

        </Dialog>
      }
    </>
  );

});