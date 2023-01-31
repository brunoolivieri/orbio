import * as React from 'react';
// Material UI
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip, IconButton, Alert, LinearProgress, Divider } from '@mui/material';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
// Custom
import { useAuth } from '../../../../../context/Auth';
import axios from '../../../../../../services/AxiosApi';

const initialDisplayAlert = { display: false, type: "", message: "" };

export const DeleteReport = React.memo((props) => {

  /// ============================================================================== STATES ============================================================================== //

  const { user } = useAuth();
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

  const handleSubmit = () => {
    setLoading(false);
    requestServerOperation();
  }

  function requestServerOperation() {

    axios.delete(`/api/reports-module/delete`, {
      data: {
        ids: selectedIds
      }
    })
      .then(function (response) {
        successResponse(response);
      })
      .catch(function (error) {
        errorResponse(error.response);
      })
      .finally(() => {
        setLoading(false);
      })

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
        <IconButton disabled={!user.data.user_powers["4"].profile_powers.write == 1} onClick={handleClickOpen}>
          <FontAwesomeIcon icon={faTrashCan} color={user.data.user_powers["4"].profile_powers.write == 1 ? "#007937" : "#E0E0E0"} size="sm" />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ style: { borderRadius: 15 } }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>DELEÇÃO DE RELATÓRIOS</DialogTitle>
        <Divider />

        <DialogContent>

          <DialogContentText mb={2}>
            {selectedIds.length > 1 ? `Os ${selectedIds.length} relatórios selecionados serão deletados` : "O relatório selecionado será deletado"}. A remoção, no entanto, não é permanente e pode ser desfeita.
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
  );
});