// React
import * as React from 'react';
// Material UI
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton, Box, Alert, LinearProgress, TextField } from '@mui/material';
// Custom
import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';
import axios from '../../../../services/AxiosApi';
// Fontsawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

const initialDisplatAlert = { display: false, type: "", message: "" };

export const DeleteOrderFormulary = React.memo((props) => {

  // ============================================================================== STATES ============================================================================== //

  const { AuthData } = useAuthentication();
  const [open, setOpen] = React.useState(false);
  const [controlledInput] = React.useState({ id: props.record.id, number: props.record.number, creator: props.record.users.creator.name });
  const [displayAlert, setDisplayAlert] = React.useState(initialDisplatAlert);
  const [disabledButton, setDisabledButton] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // ============================================================================== FUNCTIONS ============================================================================== //

  const handleClickOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setDisplayAlert(initialDisplatAlert);
    setDisabledButton(false);
    setOpen(false);
  }

  const handleSubmitOperation = (event) => {
    event.preventDefault();
    setDisabledButton(true);
    setLoading(true);
    requestServerOperation();
  }

  const requestServerOperation = () => {
    axios.delete(`/api/orders-module/${controlledInput.id}`)
      .then(function (response) {
        setLoading(false);
        setDisabledButton(false);
        successResponse(response);
      })
      .catch(function (error) {
        setLoading(false);
        setDisabledButton(false);
        errorResponse(error.response);
      });
  }

  const successResponse = (response) => {
    setDisplayAlert({ display: true, type: "success", message: response.data.message });
    setTimeout(() => {
      props.record_setter(null);
      props.reload_table();
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
        <IconButton disabled={AuthData.data.user_powers["3"].profile_powers.read == 1 ? false : true} onClick={handleClickOpen}>
          <FontAwesomeIcon icon={faTrashCan} color={AuthData.data.user_powers["3"].profile_powers.read == 1 ? "#007937" : "#808991"} size="sm" />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ style: { borderRadius: 15 } }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>DELEÇÃO | ORDEM DE SERVIÇO (ID: {props.record.id})</DialogTitle>
        <Box component="form" noValidate onSubmit={handleSubmitOperation} >
          <DialogContent>

            <TextField
              type="text"
              margin="dense"
              label="ID da ordem de serviço"
              fullWidth
              variant="outlined"
              required
              id="id"
              name="id"
              value={controlledInput.id}
              inputProps={{
                readOnly: true
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              type="text"
              margin="dense"
              label="Número da ordem de serviço"
              fullWidth
              variant="outlined"
              required
              id="numos"
              name="numos"
              defaultValue={props.record.number}
              inputProps={{
                readOnly: true
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              type="text"
              margin="dense"
              label="Nome do criador"
              fullWidth
              variant="outlined"
              required
              id="creator_name"
              name="creator_name"
              defaultValue={props.record.users.creator.name}
              inputProps={{
                readOnly: true
              }}
            />
          </DialogContent>

          {displayAlert.display &&
            <Alert severity={displayAlert.type}>{displayAlert.message}</Alert>
          }

          {loading && <LinearProgress />}

          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={disabledButton} variant="contained">Confirmar</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
});