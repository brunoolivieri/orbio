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
import { Tooltip } from '@mui/material';
import { IconButton } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
// Custom
import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';
import AxiosApi from '../../../../services/AxiosApi';

export const DeleteReportFormulary = React.memo((props) => {

  // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

  const { AuthData } = useAuthentication();
  const [open, setOpen] = React.useState(false);
  const [displayAlert, setDisplayAlert] = React.useState({ display: false, type: "", message: "" });
  const [loading, setLoading] = React.useState(false);

  // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

  const handleClickOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    props.record_setter(null);
    setDisplayAlert({ display: false, type: "", message: "" });
    setOpen(false);
  };

  const handleSubmitOperation = (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    requestServerOperation(data);

  }

  function requestServerOperation(data) {

    AxiosApi.delete(`/api/reports-module/${data.get("id")}`)
      .then(function () {

        setLoading(false);
        successServerResponseTreatment();

      })
      .catch(function (error) {

        setLoading(false);
        errorServerResponseTreatment(error.response.data);

      });

  }

  function successServerResponseTreatment() {

    setDisplayAlert({ display: true, type: "success", message: "Operação realizada com sucesso!" });

    setTimeout(() => {

      props.record_setter(null);
      props.reload_table();
      handleClose();

    }, 2000);

  }

  function errorServerResponseTreatment(response_data) {
    let error_message = (response_data.message != "" && response_data.message != undefined) ? response_data.message : "Erro do servidor!";
    setDisplayAlert({ display: true, type: "error", message: error_message });
  }

  // ============================================================================== ESTRUTURAÇÃO DA PÁGINA ============================================================================== //


  return (
    <>

      <Tooltip title="Deletar">
        <IconButton disabled={AuthData.data.user_powers["4"].profile_powers.write == 1 ? false : true} onClick={handleClickOpen}>
          <FontAwesomeIcon icon={faTrashCan} color={AuthData.data.user_powers["4"].profile_powers.write == 1 ? "#007937" : "#808991"} size="sm" />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} PaperProps={{ style: { borderRadius: 15 } }} fullWidth>
        <DialogTitle>DELEÇÃO | RELATÓRIO (ID: {props.record.id})</DialogTitle>

        {/* Formulário da criação/registro do usuário - Componente Box do tipo "form" */}
        <Box component="form" noValidate onSubmit={handleSubmitOperation} >

          <DialogContent>

            <TextField
              margin="dense"
              id="id"
              name="id"
              label="ID"
              type="text"
              fullWidth
              variant="outlined"
              defaultValue={props.record.id}
              InputProps={{
                readOnly: true,
              }}
            />

            <TextField
              margin="dense"
              label="Log do vôo"
              type="text"
              fullWidth
              variant="outlined"
              defaultValue={props.record.log.name}
              InputProps={{
                inputProps: { min: 0, max: 1 },
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
            <Button type="submit" disabled={loading}>Confirmar deleção</Button>
          </DialogActions>

        </Box>


      </Dialog>
    </>

  );

});