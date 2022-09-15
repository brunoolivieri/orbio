// React
import *  as React from 'react';
// Custom
import { useAuthentication } from '../../../../context/InternalRoutesAuth/AuthenticationContext';
import AxiosApi from '../../../../../services/AxiosApi';
import { FormValidation } from '../../../../../utils/FormValidation';
// Material UI
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Tooltip } from '@mui/material';
import { IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import { Alert } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export const CreateProfileFormulary = React.memo(({ ...props }) => {

  // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

  const { AuthData } = useAuthentication();
  const [controlledInput, setControlledInput] = React.useState({ name: "" });
  const [fieldError, setFieldError] = React.useState({ name: false });
  const [fiedlErrorMessage, setFieldErrorMessage] = React.useState({ name: "" });
  const [open, setOpen] = React.useState(false);
  const [displayAlert, setDisplayAlert] = React.useState({ display: false, type: "", message: "" });
  const [loading, setLoading] = React.useState(false);

  // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

  const handleClickOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setFieldError({ name: false });
    setFieldErrorMessage({ name: null });
    setDisplayAlert({ display: false, type: "", message: "" });
    setControlledInput({ name: "" });
    setLoading(false);
    setOpen(false);
  }

  const handleRegistrationProfile = (event) => {
    event.preventDefault();

    if (formularyDataValidate()) {

      setLoading(true);
      requestServerOperation();

    }

  }

  const formularyDataValidate = () => {

    const nameValidate = FormValidation(controlledInput.name, 3, null, null, "nome");

    setFieldError({ name: nameValidate.error });
    setFieldErrorMessage({ name: nameValidate.message });

    return !(nameValidate.error);

  }

  const requestServerOperation = () => {

    AxiosApi.post("/api/admin-module-profile", {
      name: controlledInput.name
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
      props.reload_table();
      setLoading(false);
      handleClose();
    }, 2000);

  }

  const errorServerResponseTreatment = (response) => {

    const error_message = response.data.message ? response.data.message : "Erro do servidor";
    setDisplayAlert({ display: true, type: "error", message: error_message });

    // Erros retornáveis como erros na response
    let request_errors = {
      name: { error: false, message: null }
    }

    // Coleta dos objetos de erro existentes na response
    for (let prop in response.data.errors) {

      request_errors[prop] = {
        error: true,
        message: response.data.errors[prop][0]
      }

    }

    setFieldError({ name: request_errors.name.error });
    setFieldErrorMessage({ name: request_errors.name.message });

  }

  const handleInputChange = (event) => {
    setControlledInput({ ...controlledInput, [event.target.name]: event.currentTarget.value });
  }

  // ============================================================================== ESTRUTURAÇÃO DA PÁGINA - MATERIAL UI ============================================================================== //

  return (
    <>
      <Tooltip title="Novo Perfil">
        <IconButton onClick={handleClickOpen} disabled={AuthData.data.user_powers["1"].profile_powers.write == 1 ? false : true}>
          <FontAwesomeIcon icon={faPlus} color={AuthData.data.user_powers["1"].profile_powers.write == 1 ? "#00713A" : "#808991"} size="sm" />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} PaperProps={{ style: { borderRadius: 15 } }}>
        <DialogTitle>CADASTRO DE PERFIL</DialogTitle>

        <Box component="form" noValidate onSubmit={handleRegistrationProfile} >

          <DialogContent>

            <DialogContentText>
              Perfis criados são diferentes dos perfis nativos do sistema. Um novo perfil deve ser criado apenas sob demanda, e, com a mesma condição, editado e excluído.
            </DialogContentText>

            <TextField
              margin="dense"
              name="name"
              label="Nome do perfil"
              fullWidth
              variant="outlined"
              onChange={handleInputChange}
              helperText={fiedlErrorMessage.name}
              error={fieldError.name}
              sx={{ mt: 3 }}
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
    </>
  );
});
