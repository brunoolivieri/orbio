import * as React from 'react';
// Material UI
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Alert, IconButton, Tooltip, LinearProgress, Divider, DialogContentText } from '@mui/material/';
// Custom
import { useAuth } from '../../../../../context/Auth';
import axios from '../../../../../../services/AxiosApi';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

const initialDisplayAlert = { display: false, type: "", message: "" };

export const DeleteProfile = React.memo((props) => {

  // ============================================================================== STATES ============================================================================== //

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

  function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    requestServer();
  }

  async function requestServer() {
    try {
      const response = await axios.delete("api/module/administration-profile/delete", {
        data: {
          ids: selectedIds
        }
      });
      successResponse(response);
    } catch (error) {
      console.log(error)
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

  // ============================================================================== STRUCTURES ============================================================================== //

  return (
    <>
      <Tooltip title="Deletar">
        <IconButton disabled={!user.user_powers["1"].profile_powers.write == 1} onClick={handleClickOpen}>
          <FontAwesomeIcon icon={faTrashCan} color={user.user_powers["1"].profile_powers.write == 1 ? "#007937" : "#E0E0E0"} size="sm" />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ style: { borderRadius: 15 } }}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>DELEÇÃO DE PERFIL</DialogTitle>
        <Divider />

        <DialogContent>

          <DialogContentText>
            A remoção dos perfis não é permanente e pode ser desfeita. Além disso, os usuários vinculados se tornarão visitantes.
          </DialogContentText>

        </DialogContent>

        {(!loading && displayAlert.display) &&
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