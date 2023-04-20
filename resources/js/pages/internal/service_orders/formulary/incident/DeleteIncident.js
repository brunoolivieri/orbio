import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip, IconButton, Alert, LinearProgress, Divider } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import axios from '../../../../../services/AxiosApi';

const initialDisplayAlert = { display: false, type: "", message: "" };

export const DeleteIncident = React.memo((props) => {

  /// ============================================================================== STATES ============================================================================== //

  const [selectedIds, setSelectedIds] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [alert, setAlert] = React.useState(initialDisplayAlert);
  const [loading, setLoading] = React.useState(false);
  const [canSave, setCanSave] = React.useState(true);

  // ============================================================================== FUNCTIONS ============================================================================== //

  function handleClickOpen() {
    setOpen(true);
    const ids = props.records.map((item) => item.id);
    setSelectedIds(ids);
  }

  function handleClose() {
    setAlert(initialDisplayAlert);
    setLoading(false);
    setCanSave(true);
    setOpen(false);
  }

  function handleSubmit() {
    setLoading(true);
    setCanSave(false);
    requestServer();
  }

  async function requestServer() {
    try {

      const response = await axios.delete("api/action/service-order/incidents/delete", {
        data: {
          ids: selectedIds
        }
      });

      successResponse(response);

    } catch (error) {
      console.log(error);
      setCanSave(true);
      errorResponse(error.response);
    } finally {
      setLoading(false);
    }

  }

  function successResponse(response) {
    setAlert({ display: true, type: "success", message: response.data.message });
    setTimeout(() => {
      props.reloadTable((old) => !old);
      setLoading(false);
      handleClose();
    }, 2000);
  }

  function errorResponse(response) {
    setAlert({ display: true, type: "error", message: response.data.message });
  }

  // ============================================================================== STRUCTURES - MUI ============================================================================== //

  return (
    <>
      <Tooltip title="Deletar">
        <IconButton onClick={handleClickOpen}>
          <FontAwesomeIcon icon={faTrashCan} color="#007937" size="sm" />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ style: { borderRadius: 15 } }}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>DELEÇÃO DE INCIDENTES</DialogTitle>
        <Divider />

        <DialogContent>

          <DialogContentText mb={2}>
            Os incidentes selecionados serão deletados. A remoção não é permanente e pode ser desfeita.
          </DialogContentText>

        </DialogContent>

        {alert.display &&
          <Alert severity={alert.type}>{alert.message}</Alert>
        }

        {loading && <LinearProgress />}

        <Divider />
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button disabled={!canSave} variant="contained" color="error" onClick={handleSubmit}>Confirmar</Button>
        </DialogActions>

      </Dialog>
    </>
  )
});