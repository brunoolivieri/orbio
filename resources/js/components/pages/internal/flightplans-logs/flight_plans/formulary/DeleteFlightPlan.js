import * as React from 'react';
// Material UI
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton, Alert, LinearProgress, Divider, DialogContentText, Typography } from '@mui/material';
// Custom
import { useAuth } from '../../../../../context/Auth';
import axios from '../../../../../../services/AxiosApi';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

const initialDisplatAlert = { display: false, type: "", message: "" };

export const DeleteFlightPlan = React.memo((props) => {

  // ============================================================================== STATES ============================================================================== //

  const { user } = useAuth();
  const [selectedIds, setSelectedIds] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [displayAlert, setDisplayAlert] = React.useState(initialDisplatAlert);
  const [loading, setLoading] = React.useState(false);

  // ============================================================================== FUNCTIONS ============================================================================== //

  function handleClickOpen() {
    setOpen(true);
    const ids = props.records.map((item) => item.id);
    setSelectedIds(ids);
  }

  function handleClose() {
    setDisplayAlert({ display: false, type: "", message: "" });
    setLoading(false);
    setOpen(false);
  }

  function handleSubmit() {
    setLoading(true);
    requestServer();
  }

  async function requestServer() {
    try {
      const response = await axios.delete("api/module/flight-plans/delete", {
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

  const successResponse = (response) => {
    setDisplayAlert({ display: true, type: "success", message: response.data.message });
    setTimeout(() => {
      props.reloadTable((old) => !old);
      setLoading(false);
      handleClose();
    }, 2000);
  }

  const errorResponse = (response) => {
    setDisplayAlert({ display: true, type: "error", message: response.data.message });
  }

  // ============================================================================== JSX ============================================================================== //

  return (
    <>
      <Tooltip title="Deletar">
        <IconButton disabled={!user.user_powers["2"].profile_powers.read == 1} onClick={handleClickOpen}>
          <FontAwesomeIcon icon={faTrashCan} color={user.user_powers["2"].profile_powers.write == 1 ? "#007937" : "#E0E0E0"} size="sm" />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ style: { borderRadius: 15 } }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>DELEÇÃO DE PLANO DE VOO</DialogTitle>
        <Divider />

        <DialogContent>

          <DialogContentText mb={2}>
            <Typography>{selectedIds.length > 1 ? `Os ${selectedIds.length} planos de voo selecionados serão deletados` : `O plano de voo selecionado será deletado`}. A remoção, no entanto, não é permanente e pode ser desfeita. </Typography>
          </DialogContentText>

          <DialogContentText mb={2}>
            <Typography>Certifique-se de que os planos de voo selecionados não possuem vínculos com ordens de serviço ativas.</Typography>
          </DialogContentText>

        </DialogContent>

        {displayAlert.display &&
          <Alert severity={displayAlert.type}>{displayAlert.message}</Alert>
        }

        {loading && <LinearProgress />}

        <Divider />
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit" disabled={loading} variant="contained" color="error" onClick={handleSubmit}>Confirmar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
});