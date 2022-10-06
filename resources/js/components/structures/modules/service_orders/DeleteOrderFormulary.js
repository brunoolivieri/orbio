// React
import * as React from 'react';
// MaterialUI
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
// Fontsawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

export function DeleteOrderFormulary(props) {

  // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

  const { AuthData } = useAuthentication();
  const [open, setOpen] = React.useState(false);
  const [displayAlert, setDisplayAlert] = React.useState({ display: false, type: "", message: "" });
  const [disabledButton, setDisabledButton] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

  const handleClickOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setDisplayAlert({ display: false, type: "", message: "" });
    setDisabledButton(false);
    setOpen(false);
  }

  const handleSubmitOperation = (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    setDisabledButton(true);
    setLoading(true);
    requestServerOperation(data);

  }

  const requestServerOperation = (data) => {

    AxiosApi.delete(`/api/orders-module/${data.get("id")}`)
      .then(function () {

        setLoading(false);
        successServerResponseTreatment();

      })
      .catch(function (error) {

        setLoading(false);
        errorServerResponseTreatment(error.response.data);

      });

  }

  const successServerResponseTreatment = () => {

    setDisplayAlert({ display: true, type: "success", message: "Operação realizada com sucesso!" });

    setTimeout(() => {

      props.record_setter(null);
      props.reload_table();
      setDisabledButton(false);
      handleClose();

    }, 2000);

  }

  function errorServerResponseTreatment(response_data) {
    setDisabledButton(false);
    let error_message = (response_data.message != "" && response_data.message != undefined) ? response_data.message : "Houve um erro na realização da operação!";
    setDisplayAlert({ display: true, type: "error", message: error_message });
  }

  // ============================================================================== ESTRUTURAÇÃO DA PÁGINA ============================================================================== //

  return (
    <>

      <Tooltip title="Deletar">
        <IconButton disabled={AuthData.data.user_powers["3"].profile_powers.read == 1 ? false : true} onClick={handleClickOpen}>
          <FontAwesomeIcon icon={faTrashCan} color={AuthData.data.user_powers["3"].profile_powers.read == 1 ? "#007937" : "#808991"} size="sm" />
        </IconButton>
      </Tooltip>

      {(props.record != null && open) &&
        <Dialog open={open} onClose={handleClose} PaperProps={{ style: { borderRadius: 15 } }} fullWidth>
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
                defaultValue={props.record.id}
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
      }
    </>

  );


}