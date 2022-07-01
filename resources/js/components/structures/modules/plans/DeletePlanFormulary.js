// React
import * as React from 'react';
// Material UI
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import { Alert } from '@mui/material';
import { IconButton } from '@mui/material';
import { Tooltip } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
// Custom
import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';
import AxiosApi from '../../../../services/AxiosApi';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

export const DeletePlanFormulary = React.memo(({ ...props }) => {

  // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

  const { AuthData } = useAuthentication();

  const [controlledInput] = React.useState({ id: props.record.id });

  const [displayAlert, setDisplayAlert] = React.useState({ display: false, type: "", message: "" });

  const [loading, setLoading] = React.useState(false);

  const [open, setOpen] = React.useState(false);

  // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

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

    setLoading(true);
    requestServerOperation();

  }

  const requestServerOperation = () => {

    AxiosApi.delete(`/api/plans-module/${controlledInput.id}`)
      .then(function (response) {

        setLoading(false);
        successServerResponseTreatment(response);

      })
      .catch(function (error) {

        setLoading(false);
        errorServerResponseTreatment(error.response.data);

      });

  }

  const successServerResponseTreatment = (response) => {

    setDisplayAlert({ display: true, type: "success", message: response.data.message });

    setTimeout(() => {
      props.record_setter(null);
      props.reload_table();
      setLoading(false);
      handleClose();
    }, 2000);

  }

  const errorServerResponseTreatment = (response) => {

    const error_message = response.data.message ? response.data.message : "Erro do servidor";
    setDisplayAlert({ display: true, type: "error", message: error_message });

  }

  // ============================================================================== ESTRUTURAÇÃO DA PÁGINA ============================================================================== //

  return (
    <>
      <Tooltip title="Deletar">
        <IconButton disabled={AuthData.data.user_powers["2"].profile_powers.read == 1 ? false : true} onClick={handleClickOpen}>
          <FontAwesomeIcon icon={faTrashCan} color={AuthData.data.user_powers["2"].profile_powers.read == 1 ? "#007937" : "#808991"} size="sm" />
        </IconButton>
      </Tooltip>

      {(props.record != null && open) &&
        <Dialog open={open} onClose={handleClose} PaperProps={{ style: { borderRadius: 15 } }}>
          <DialogTitle>DELEÇÃO | PLANO DE VÔO (ID: {props.record.id})</DialogTitle>

          <Box component="form" noValidate onSubmit={handleSubmitOperation} >

            <DialogContent>

              <TextField
                margin="dense"
                id="id"
                name="id"
                label="ID do plano"
                type="text"
                fullWidth
                variant="outlined"
                inputProps={{
                  readOnly: true
                }}
                value={props.record.id}
                sx={{ mb: 2 }}
              />

              <TextField
                margin="dense"
                label="Arquivo"
                type="text"
                fullWidth
                variant="outlined"
                inputProps={{
                  readOnly: true
                }}
                defaultValue={props.record.coordinates}
              />

            </DialogContent>

            {(!loading && displayAlert.display) &&
              <Alert severity={displayAlert.type}>{displayAlert.message}</Alert>
            }

            {loading && <LinearProgress />}

            <DialogActions>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button type="submit" disabled={loading} variant="contained">Confirmar deleção</Button>
            </DialogActions>

          </Box>
        </Dialog>
      }
    </>

  );

});