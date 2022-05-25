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
// Custom
import { useAuthentication } from '../../../../context/InternalRoutesAuth/AuthenticationContext';
import AxiosApi from '../../../../../services/AxiosApi';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

const native_profiles = [1, 2, 3, 4, 5];

export const DeleteProfileFormulary = React.memo(({ ...props }) => {

  // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

  // Utilizador do state global de autenticação
  const { AuthData } = useAuthentication();

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

    // Instância da classe JS FormData - para trabalhar os dados do formulário
    const data = new FormData(event.currentTarget);

    // Botão é desabilitado
    setDisabledButton(true);

    // Inicialização da requisição para o servidor
    requestServerOperation(data);

  }

  /*
 * Rotina 3
 * Realização da requisição AXIOS
 * Possui dois casos: o Update e o Delete
 * 
 */
  function requestServerOperation(data) {

    // Dados para o middleware de autenticação
    let logged_user_id = AuthData.data.id;
    let module_id = 1;
    let action = "escrever";

    setDisabledButton(false);

    AxiosApi.delete(`/api/admin-module-profile/${data.get("profile_id")}?auth=${logged_user_id}.${module_id}.${action}`)
      .then(function () {

        successServerResponseTreatment();

      })
      .catch(function (error) {

        errorServerResponseTreatment(error.response.data);

      });

  }

  /*
  * Rotina 4A
  * Tratamento da resposta de uma requisição bem sucedida
  */
  function successServerResponseTreatment() {

    setDisplayAlert({ display: true, type: "success", message: "Operação realizada com sucesso!" });

    setTimeout(() => {

      // Deselecionar registro na tabela
      props.record_setter(null);
      // Outros
      props.reload_table();
      setDisabledButton(false);
      handleClose();

    }, 2000);

  }

  /*
  * Rotina 4B
  * Tratamento da resposta de uma requisição falha
  */
  function errorServerResponseTreatment(response_data) {

    let error_message = (response_data.message != "" && response_data.message != undefined) ? response_data.message : "Houve um erro na realização da deleção!";
    setDisplayAlert({ display: true, type: "error", message: error_message });

  }

  // ============================================================================== ESTRUTURAÇÃO DA PÁGINA - COMPONENTES DO MATERIAL UI ============================================================================== //

  return (
    <>
      <Tooltip title="Deletar">
        <IconButton disabled={AuthData.data.user_powers["1"].profile_powers.escrever == 1 ? false : true} onClick={handleClickOpen}>
          <FontAwesomeIcon icon={faTrashCan} color={AuthData.data.user_powers["1"].profile_powers.escrever == 1 ? "#007937" : "#808991"} size="sm" />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} PaperProps = {{style: { borderRadius: 15 }}}>
        {(props.record != null && open) && (native_profiles.indexOf(props.record.profile_id) == -1) &&
          <>
            <DialogTitle>DELEÇÃO | PERFIL (ID: {props.record.profile_id})</DialogTitle>

            <Box component="form" noValidate onSubmit={handleSubmitOperation} >

              <DialogContent>

                <TextField
                  margin="dense"
                  defaultValue={props.record.profile_id}
                  id="profile_id"
                  name="profile_id"
                  label="ID do perfil"
                  fullWidth
                  variant="outlined"
                  sx={{ mb: 2 }}
                  InputProps={{
                    readOnly: true
                  }}
                />

                <TextField
                  margin="dense"
                  defaultValue={props.record.profile_name}
                  id="profile_name"
                  name="profile_name"
                  label="Nome do perfil"
                  fullWidth
                  variant="outlined"
                  InputProps={{
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
          </>
        }

      </Dialog>
    </>

  );

});