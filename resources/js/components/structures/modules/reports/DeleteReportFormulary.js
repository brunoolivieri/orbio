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
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
// Custom
import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';
import AxiosApi from '../../../../services/AxiosApi';

export const DeleteReportFormulary = React.memo(({ ...props }) => {

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
    if (props.selected_record.dom != null) {
      setOpen(true);
    }
  };

  // Função para fechar o modal
  const handleClose = () => {

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

    // Instância da classe JS FormData - para trabalhar os dados do formulário
    const data = new FormData(event.currentTarget);

    setDisabledButton(true);

    // Inicialização da requisição para o servidor
    requestServerOperation(data);


  }


  /*
 * Rotina 2
 * Realização da requisição AXIOS
 * Possui dois casos: o Update e o Delete
 * 
 */
  function requestServerOperation(data) {

    // Dados para o middleware de autenticação 
    let logged_user_id = AuthData.data.id;
    let module_id = 4;
    let module_action = "escrever";

    AxiosApi.delete(`/api/reports-module/${data.get("id_input")}?auth=${logged_user_id}.${module_id}.${module_action}`)
      .then(function () {

        successServerResponseTreatment();

      })
      .catch(function (error) {

        errorServerResponseTreatment(error.response.data);

      });

  }

  /*
  * Rotina 3A
  * Tratamento da resposta de uma requisição bem sucedida
  */
  function successServerResponseTreatment() {

    setDisplayAlert({ display: true, type: "success", message: "Operação realizada com sucesso!" });

    setTimeout(() => {

      props.reload_table();
      setDisabledButton(false);
      handleClose();

    }, 2000);

  }

  /*
  * Rotina 3B
  * Tratamento da resposta de uma requisição falha
  */
  function errorServerResponseTreatment(response_data) {

    let error_message = (response_data.message != "" && response_data.message != undefined) ? response_data.message : "Houve um erro na realização da operação!";
    setDisplayAlert({ display: true, type: "error", message: error_message });

  }

  // ============================================================================== ESTRUTURAÇÃO DA PÁGINA ============================================================================== //


  return (
    <>

      <Tooltip title="Deletar">
        <IconButton disabled={AuthData.data.user_powers["4"].profile_powers.escrever == 1 ? false : true} onClick={handleClickOpen}>
          <FontAwesomeIcon icon={faTrashCan} color={AuthData.data.user_powers["4"].profile_powers.escrever == 1 ? "#007937" : "#808991"} size="sm" />
        </IconButton>
      </Tooltip>

      {(props.selected_record.dom != null && open) &&

        <Dialog open={open} onClose={handleClose} PaperProps = {{style: { borderRadius: 15 }}}>
          <DialogTitle>DELEÇÃO | RELATÓRIO (ID: {props.selected_record.data_cells.report_id})</DialogTitle>

          {/* Formulário da criação/registro do usuário - Componente Box do tipo "form" */}
          <Box component="form" noValidate onSubmit={handleSubmitOperation} >

            <DialogContent>

              <TextField
                margin="dense"
                id="id_input"
                name="id_input"
                label="ID"
                type="text"
                fullWidth
                variant="outlined"
                defaultValue={props.selected_record.data_cells.report_id}
                InputProps={{
                  readOnly: true,
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                margin="dense"
                id="flight_log"
                name="flight_log"
                label="Log do vôo"
                type="text"
                fullWidth
                variant="outlined"
                defaultValue={props.selected_record.data_cells.flight_log}
                InputProps={{
                  inputProps: { min: 0, max: 1 },
                  readOnly: true
                }}
              />

            </DialogContent>

            {displayAlert.display &&
              <Alert severity={displayAlert.type}>{displayAlert.message}</Alert>
            }

            <DialogActions>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button type="submit" disabled={disabledButton}>Confirmar deleção</Button>
            </DialogActions>

          </Box>


        </Dialog>
      }
    </>

  );

});