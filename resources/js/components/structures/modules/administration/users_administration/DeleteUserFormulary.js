import * as React from 'react';
// Material UI
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip, IconButton, Box, Alert, LinearProgress, Divider } from '@mui/material';
// Custom
import { useAuthentication } from '../../../../context/InternalRoutesAuth/AuthenticationContext';
import axios from '../../../../../services/AxiosApi';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

const initialDisplayAlert = { display: false, type: "", message: "" };

export const DeleteUserFormulary = React.memo((props) => {

  // ============================================================================== STATES ============================================================================== //

  const { AuthData } = useAuthentication();
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
    requestServerOperation();
  }

  function requestServerOperation() {
    axios.delete(`/api/admin-module-user/delete`, {
      ids: selectedIds
    })
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
      props.selectionSetter(null);
      props.reloadTable();
      handleClose();
    }, 2000);
  }

  function errorResponse(response) {
    setDisplayAlert({ display: true, type: "error", message: response.data.message });
  }

  // ============================================================================== STRUCTURES ============================================================================== //

  return (
    <>
      <Tooltip title="Desativar">
        <IconButton disabled={!AuthData.data.user_powers["1"].profile_powers.write == 1} onClick={handleClickOpen}>
          <FontAwesomeIcon icon={faTrashCan} color={AuthData.data.user_powers["1"].profile_powers.write == 1 ? "#007937" : "#E0E0E0"} size="sm" />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ style: { borderRadius: 15 } }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>DELEÇÃO DE USUÁRIOS</DialogTitle>
        <Divider />

        <Box component="form" >
          <DialogContent>

            <DialogContentText mb={2}>
              {selectedIds.length > 1 ? `Os ${selectedIds.length} usuários selecionados perderão o acesso a suas contas` : "O usuário selecionado perderá o acesso a sua conta"}. A remoção, no entanto, não é permanente e pode ser desfeita.
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

        </Box>
      </Dialog>
    </>
  );
});