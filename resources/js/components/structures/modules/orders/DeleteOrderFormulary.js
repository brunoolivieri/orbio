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
// Custom
import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';
import AxiosApi from '../../../../services/AxiosApi';
// Fontsawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

export function DeleteOrderFormulary({ ...props }) {

  // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

  // Utilizador do state global de autenticação
  const { AuthData } = useAuthentication();

  // States do formulário
  const [open, setOpen] = React.useState(false);

  // State da mensagem do alerta
  const [displayAlert, setDisplayAlert] = React.useState({ display: false, type: "", message: "" });

  // State da acessibilidade do botão de executar o registro
  const [disabledButton, setDisabledButton] = React.useState(false);

  // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

  // Função para abrir o modal
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Função para fechar o modal
  const handleClose = () => {

    props.record_setter(null);
    setDisplayAlert({ display: false, type: "", message: "" });
    setDisabledButton(false);

    setOpen(false);

  };

  /*
 * Rotina 1
 * Captura do envio do formulário
 * 
 */
  const handleSubmitOperation = (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    setDisabledButton(true);

    requestServerOperation(data);

  }

  /*
 * Rotina 2
 * Realização da requisição AXIOS
 * Possui dois casos: o Update e o Delete
 * 
 */
  function requestServerOperation(data) {

    AxiosApi.delete(`/api/orders-module/${data.get("order_id")}`)
      .then(function () {

        successServerResponseTreatment();

      })
      .catch(function (error) {

        errorServerResponseTreatment(error.response.data);

      });

  }

  /*
  * Rotina 5A
  * Tratamento da resposta de uma requisição bem sucedida
  */
  function successServerResponseTreatment() {

    setDisplayAlert({ display: true, type: "success", message: "Operação realizada com sucesso!" });

    setTimeout(() => {

      //  Deselecionar registro na tabela
      props.record_setter(null);
      // Outros
      props.reload_table();
      setDisabledButton(false);
      handleClose();

    }, 2000);

  }

  /*
  * Rotina 5B
  * Tratamento da resposta de uma requisição falha
  */
  function errorServerResponseTreatment(response_data) {

    setDisabledButton(false);

    let error_message = (response_data.message != "" && response_data.message != undefined) ? response_data.message : "Houve um erro na realização da operação!";
    setDisplayAlert({ display: true, type: "error", message: error_message });

  }

  // ============================================================================== ESTRUTURAÇÃO DA PÁGINA ============================================================================== //

  return (
    <>

      <Tooltip title="Deletar">
        <IconButton disabled={AuthData.data.user_powers["3"].profile_powers.escrever == 1 ? false : true} onClick={handleClickOpen}>
          <FontAwesomeIcon icon={faTrashCan} color={AuthData.data.user_powers["3"].profile_powers.escrever == 1 ? "#007937" : "#808991"} size="sm" />
        </IconButton>
      </Tooltip>

      {(props.record != null && open) &&
        <Dialog open={open} onClose={handleClose} PaperProps = {{style: { borderRadius: 15 }}}>
          <DialogTitle>DELEÇÃO | ORDEM DE SERVIÇO (ID: {props.record.order_id})</DialogTitle>

          <Box component="form" noValidate onSubmit={handleSubmitOperation} >

            <DialogContent>

              <TextField
                type="text"
                margin="dense"
                label="ID da ordem de serviço"
                fullWidth
                variant="outlined"
                required
                id="order_id"
                name="order_id"
                defaultValue={props.record.order_id}
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
                id="order_numos"
                name="order_numos"
                defaultValue={props.record.numOS}
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
                defaultValue={props.record.creator.name}
                inputProps={{
                  readOnly: true
                }}
              />

            </DialogContent>

            {displayAlert.display &&
              <Alert severity={displayAlert.type}>{displayAlert.message}</Alert>
            }

            <DialogActions>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button type="submit" disabled={disabledButton} variant="contained">Confirmar deleção</Button>
            </DialogActions>

          </Box>


        </Dialog>
      }
    </>

  );


}