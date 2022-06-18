// React
import *  as React from 'react';
// Custom
import { useAuthentication } from '../../../../context/InternalRoutesAuth/AuthenticationContext';
import AxiosApi from '../../../../../services/AxiosApi';
import { FormValidation } from '../../../../../utils/FormValidation';
// Material UI
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Tooltip } from '@mui/material';
import { IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import { Alert } from '@mui/material';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export const CreateProfileFormulary = React.memo(({ ...props }) => {

  // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

  // Utilizador do state global de autenticação
  const { AuthData } = useAuthentication();

  // States do formulário
  const [open, setOpen] = React.useState(false);

  // States utilizados nas validações dos campos 
  const [errorDetected, setErrorDetected] = React.useState({ name: false }); // State para o efeito de erro - true ou false
  const [errorMessage, setErrorMessage] = React.useState({ name: null }); // State para a mensagem do erro - objeto com mensagens para cada campo

  // State da mensagem do alerta
  const [displayAlert, setDisplayAlert] = React.useState({ display: false, type: "", message: "" });

  // State da acessibilidade do botão de executar o registro
  const [disabledButton, setDisabledButton] = React.useState(false);

  // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

  const handleClickOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {

    setErrorDetected({ name: false });
    setErrorMessage({ name: null });
    setDisplayAlert({ display: false, type: "", message: "" });
    setDisabledButton(false);
    setOpen(false);

  }

  /*
  * Rotina 1
  */
  const handleRegistrationProfile = (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    if (dataValidate(data)) {

      setDisabledButton(true);

      requestServerOperation(data);

    }

  }

  /*
  * Rotina 2
  */
  function dataValidate(formData) {

    const nameValidate = FormValidation(formData.get("name"), 3, null, null, null);

    // Atualização dos estados responsáveis por manipular os inputs
    setErrorDetected({ name: nameValidate.error });
    setErrorMessage({ name: nameValidate.message });

    // Se o nome ou acesso estiverem errados
    if (nameValidate.error) {

      return false;

    } else {

      return true;

    }

  }

  /*
  * Rotina 3
  */
  function requestServerOperation(data) {

    AxiosApi.post("/api/admin-module-profile", {
      name: data.get("name")
    })
      .then(function () {

        successServerResponseTreatment();

      })
      .catch(function (error) {

        errorServerResponseTreatment(error.response.data);

      });

  }

  /*
  * Rotina 4A
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
  * Rotina 4B
  */
  const errorServerResponseTreatment = (response_data) => {

    setDisabledButton(false);

    let error_message = (response_data.message != "" && response_data.message != undefined) ? response_data.message : "Houve um erro na realização da operação!";
    setDisplayAlert({ display: true, type: "error", message: error_message });

    // Definição dos objetos de erro possíveis de serem retornados pelo validation do Laravel
    let input_errors = {
      name: { error: false, message: null }
    }

    // Coleta dos objetos de erro existentes na response
    for (let prop in response_data.errors) {

      input_errors[prop] = {
        error: true,
        message: response_data.errors[prop][0]
      }

    }

    setErrorDetected({ name: input_errors.name.error });
    setErrorMessage({ name: input_errors.name.message });

  }

  // ============================================================================== ESTRUTURAÇÃO DA PÁGINA - MATERIAL UI ============================================================================== //

  return (
    <>
      <Tooltip title="Novo Perfil">
        <IconButton onClick={handleClickOpen} disabled={AuthData.data.user_powers["1"].profile_powers.write == 1 ? false : true}>
          <FontAwesomeIcon icon={faPlus} color={AuthData.data.user_powers["1"].profile_powers.write == 1 ? "#00713A" : "#808991"} size="sm" />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} PaperProps={{ style: { borderRadius: 15 } }}>
        <DialogTitle>CADASTRO DE PERFIL</DialogTitle>

        <Box component="form" noValidate onSubmit={handleRegistrationProfile} >

          <DialogContent>

            <DialogContentText>
              Perfis criados são diferentes dos perfis nativos do sistema. Um novo perfil deve ser criado apenas sob demanda, e, com a mesma condição, editado e excluído.
            </DialogContentText>

            <TextField
              margin="dense"
              id="name"
              name="name"
              label="Nome do perfil"
              fullWidth
              variant="outlined"
              helperText={errorMessage.name}
              error={errorDetected.name}
              sx={{ mt: 3 }}
            />
          </DialogContent>

          {displayAlert.display &&
            <Alert severity={displayAlert.type}>{displayAlert.message}</Alert>
          }

          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={disabledButton} variant="contained">Criar perfil</Button>
          </DialogActions>

        </Box>

      </Dialog>
    </>
  );
});
