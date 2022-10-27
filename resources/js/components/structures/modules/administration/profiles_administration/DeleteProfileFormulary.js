import * as React from 'react';
// Material UI
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Box, Alert, IconButton, Tooltip, LinearProgress } from '@mui/material/';
// Custom
import { useAuthentication } from '../../../../context/InternalRoutesAuth/AuthenticationContext';
import axios from '../../../../../services/AxiosApi';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

const initialDisplayAlert = { display: false, type: "", message: "" };

export const DeleteProfileFormulary = React.memo(({ ...props }) => {

  // ============================================================================== STATES ============================================================================== //

  const { AuthData } = useAuthentication();
  const [controlledInput] = React.useState({ id: props.record.profile_id });
  const [displayAlert, setDisplayAlert] = React.useState(initialDisplayAlert);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  // ============================================================================== FUNCTIONS ============================================================================== //

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setDisplayAlert(initialDisplayAlert);
    setLoading(false);
    setOpen(false);
  }

  function handleSubmitOperation(event) {
    event.preventDefault();
    setLoading(true);
    requestServerOperation();
  }

  function requestServerOperation() {
    axios.delete(`/api/admin-module-profile/${controlledInput.id}`)
      .then(function (response) {
        setLoading(false);
        successResponse(response);
      })
      .catch(function (error) {
        setLoading(false);
        errorResponse(error.response);
      });
  }

  function successResponse(response) {
    setDisplayAlert({ display: true, type: "success", message: response.data.message });
    setTimeout(() => {
      props.record_setter(null);
      props.reload_table();
      setLoading(false);
      handleClose();
    }, 2000);
  }

  function errorResponse(response) {
    setDisplayAlert({ display: true, type: "error", message: response.data.message });
  }

  // ============================================================================== STRUCTURES - MUI ============================================================================== //

  return (
    <>
      <Tooltip title="Deletar">
        <IconButton disabled={AuthData.data.user_powers["1"].profile_powers.write == 1 ? false : true} onClick={handleClickOpen}>
          <FontAwesomeIcon icon={faTrashCan} color={AuthData.data.user_powers["1"].profile_powers.write == 1 ? "#007937" : "#808991"} size="sm" />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ style: { borderRadius: 15 } }}
        fullWidth
        maxWidth="md"
      >
        <>
          <DialogTitle>DELEÇÃO | PERFIL (ID: {props.record.profile_id})</DialogTitle>

          <Box component="form" noValidate onSubmit={handleSubmitOperation} >

            <DialogContent>

              <TextField
                margin="dense"
                defaultValue={props.record.profile_id}
                id="id"
                name="id"
                label="ID do perfil"
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
                InputProps={{
                  readOnly: true
                }}
              />

              <TextField
                margin="dense"
                defaultValue={props.record.profile_name}
                id="name"
                name="name"
                label="Nome do perfil"
                fullWidth
                variant="outlined"
                InputProps={{
                  readOnly: true
                }}
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
        </>
      </Dialog>
    </>
  );
});