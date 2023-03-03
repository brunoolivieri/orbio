import * as React from 'react';
// Material UI
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip, IconButton, Alert, LinearProgress, Divider } from '@mui/material';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
// Custom
import axios from '../../../../../../services/AxiosApi';

const initialDisplayAlert = { display: false, type: "", message: "" };

export const DeleteIncident = React.memo((props) => {

  /// ============================================================================== STATES ============================================================================== //

  const [selectedIds, setSelectedIds] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [displayAlert, setDisplayAlert] = React.useState(initialDisplayAlert);
  const [loading, setLoading] = React.useState(false);

  // ============================================================================== FUNCTIONS ============================================================================== //

  function handleClickOpen() {
    setOpen(true);
    const ids = props.records.map((item) => item.id);
    setSelectedIds(ids);
  }

  function handleClose() {
    setDisplayAlert(initialDisplayAlert);
    setLoading(false);
    setOpen(false);
  }

  function handleSubmit() {
    setLoading(false);
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
      errorResponse(error.response);
    } finally {
      setLoading(false);
    }

  }

  function successResponse(response) {
    setDisplayAlert({ display: true, type: "success", message: response.data.message });
    setTimeout(() => {
      props.reloadTable((old) => !old);
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
        <IconButton onClick={handleClickOpen}>
          <FontAwesomeIcon icon={faTrashCan} color="#007937" size="sm" />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ style: { borderRadius: 15 } }}
        fullWidth
        fullScreen
      >
        <DialogTitle>DELEÇÃO DE INCIDENTES</DialogTitle>
        <Divider />

        <DialogContent>

          <DialogContentText mb={2}>
            {selectedIds.length > 1 ? `Os ${selectedIds.length} incidentes selecionados serão deletados` : "O incidente selecionado será deletado"}. A remoção, no entanto, não é permanente e pode ser desfeita.
          </DialogContentText>

        </DialogContent>

        {displayAlert.display &&
          <Alert severity={displayAlert.type}>{displayAlert.message}</Alert>
        }

        {loading && <LinearProgress />}

        <Divider />
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button disabled={loading} variant="contained" color="error" onClick={handleSubmit}>Confirmar</Button>
        </DialogActions>

      </Dialog>
    </>
  )
});