import * as React from 'react';
// Material UI
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton, Box, Alert, LinearProgress, TextField } from '@mui/material';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
// Custom
import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';
import axios from '../../../../services/AxiosApi';

const initialDisplatAlert = { display: false, type: "", message: "" };

export const DeleteIncidentFormulary = React.memo((props) => {

  // ============================================================================== STATES ============================================================================== //

  const { AuthData } = useAuthentication();
  const [controlledInput] = React.useState({ id: props.record.id });
  const [displayAlert, setDisplayAlert] = React.useState(initialDisplatAlert);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  // ============================================================================== FUNCTIONS ============================================================================== //

  const handleClickOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setDisplayAlert({ display: false, type: "", message: "" });
    setLoading(false);
    setOpen(false);
  }

  const handleSubmitOperation = (event) => {
    event.preventDefault();
    setLoading(false);
    requestServerOperation();
  }

  const requestServerOperation = () => {
    axios.delete(`/api/incidents-module/${controlledInput.id}`)
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
        <IconButton disabled={AuthData.data.user_powers["5"].profile_powers.read == 1 ? false : true} onClick={handleClickOpen}>
          <FontAwesomeIcon icon={faTrashCan} color={AuthData.data.user_powers["5"].profile_powers.read == 1 ? "#007937" : "#808991"} size="sm" />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ style: { borderRadius: 15 } }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>DELEÇÃO | INCIDENTE (ID: {props.record.id})</DialogTitle>
        <Box component="form" noValidate onSubmit={handleSubmitOperation} >
          <DialogContent>

            <TextField
              type="text"
              margin="dense"
              label="ID do incidente"
              fullWidth
              variant="outlined"
              required
              id="id"
              name="id"
              InputProps={{
                readOnly: true
              }}
              defaultValue={props.record.id}
              sx={{ mb: 2 }}
            />

            <TextField
              type="text"
              margin="dense"
              label="Tipo do incidente"
              fullWidth
              variant="outlined"
              required
              id="type"
              name="type"
              defaultValue={props.record.type}
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
      </Dialog>
    </>
  )
});