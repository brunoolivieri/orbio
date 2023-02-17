import * as React from 'react';
// Material UI
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton, Alert, LinearProgress, TextField, Grid, Divider, DialogContentText } from '@mui/material';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
// Custom
import { useAuth } from '../../../../../context/Auth';
import { FormValidation } from '../../../../../../utils/FormValidation';
import axios from '../../../../../../services/AxiosApi';

const fieldError = { error: false, message: "" }

const initialFormError = {
  name: fieldError,
  observation: fieldError
}

const initialDisplayAlert = { display: false, type: "", message: "" };

export const UpdateReport = React.memo((props) => {

  // ============================================================================== STATES ============================================================================== //

  const { user } = useAuth();

  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({ id: props.record.id, name: props.record.name, observation: props.record.observation });
  const [formError, setFormError] = React.useState(initialFormError);
  const [displayAlert, setDisplayAlert] = React.useState(initialDisplayAlert);
  const [loading, setLoading] = React.useState(false);

  // ============================================================================== FUNCTIONS ============================================================================== //

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setFormError(initialFormError);
    setDisplayAlert({ display: false, type: "", message: "" });
    setOpen(false);
    setLoading(false);
  }

  function handleSubmit() {
    if (!formSubmissionValidation()) return '';
    setLoading(true);
    requestServer();

  }

  function formSubmissionValidation() {

    let validation = Object.assign({}, formError);

    validation["name"] = FormValidation(formData.name, 3);

    setFormError(validation);

    return !(validation.name.error || validation.observation.error);

  }

  async function requestServer() {

    try {

      const response = await axios.patch(`/api/module/reports/${formData.id}`, formData);
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
    if (response.status === 422) {
      setDisplayAlert({ display: true, type: "error", message: "Dados inválidos!" });
      let response_errors = {}
      for (let field in response.data.errors) {
        response_errors[field] = {
          error: true,
          message: response.data.errors[field][0]
        }
      }
      setFormError(response_errors);
    } else {
      setDisplayAlert({ display: true, type: "error", message: "Erro do servidor!" });
    }
  }

  function handleInputChange(event) {
    setFormData({ ...formData, [event.target.name]: event.currentTarget.value });
  }

  // ============================================================================== STRUCTURES - MUI ============================================================================== //

  return (
    <>
      <Tooltip title="Editar">
        <IconButton disabled={!user.user_powers["4"].profile_powers.write == 1} onClick={handleClickOpen}>
          <FontAwesomeIcon icon={faPen} color={user.user_powers["4"].profile_powers.write == 1 ? "#007937" : "#E0E0E0"} size="sm" />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ style: { borderRadius: 15 } }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>ATUALIZAÇÃO DE RELATÓRIO</DialogTitle>
        <Divider />

        <DialogContent>

          <DialogContentText sx={{ mb: 2 }}>
            Preencha todos os dados requisitados no formulário para a atualização do relatório.
          </DialogContentText>

          <Grid container spacing={1}>

            <Grid item xs={12}>
              <TextField
                margin="dense"
                label="Nome"
                type="text"
                fullWidth
                name="name"
                variant="outlined"
                value={formData.name}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                margin="dense"
                id="observation"
                name="observation"
                label="Observação"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.observation}
                helperText={formError.observation.message}
                error={formError.observation.error}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>

        </DialogContent>

        {displayAlert.display &&
          <Alert severity={displayAlert.type}>{displayAlert.message}</Alert>
        }

        {loading && <LinearProgress />}

        <Divider />
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button disabled={loading} variant="contained" onClick={handleSubmit}>Confirmar</Button>
        </DialogActions>

      </Dialog>
    </>
  );
});