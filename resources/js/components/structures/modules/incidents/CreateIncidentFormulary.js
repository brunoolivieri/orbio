// React
import * as React from 'react';
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
import { DateTimeInput } from '../../date_picker/DateTimeInput';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
// Outros
import moment from 'moment';
// Custom
import AxiosApi from '../../../../services/AxiosApi';
import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';
import { FormValidation } from '../../../../utils/FormValidation';

export const CreateIncidentFormulary = React.memo(({...props}) => {

  // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

  // Utilizador do state global de autenticação
  const { AuthData } = useAuthentication();

  // States utilizados nas validações dos campos 
  const [errorDetected, setErrorDetected] = React.useState({ incident_date: false, incident_type: false, description: false });
  const [errorMessage, setErrorMessage] = React.useState({ incident_date: "", incident_type: "", description: "" });

  // State da mensagem do alerta
  const [displayAlert, setDisplayAlert] = React.useState({ display: false, type: "", message: "" });

  // State da acessibilidade do botão de executar o registro
  const [disabledButton, setDisabledButton] = React.useState(false);

  // States do formulário
  const [open, setOpen] = React.useState(false);

  // States dos inputs de data
  const [incidentDate, setIncidentDate] = React.useState(moment());

  // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

  // Função para abrir o modal
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Função para fechar o modal
  const handleClose = () => {

    setErrorDetected({ incident_date: false, incident_type: false, description: false });
    setErrorMessage({ incident_date: "", incident_type: "", description: "" });
    setDisplayAlert({ display: false, type: "", message: "" });
    setDisabledButton(false);

    setOpen(false);

  };

  /*
  * Rotina 1
  * Ponto inicial do processamento do envio do formulário de registro
  * Recebe os dados do formulário, e transforma em um objeto da classe FormData
  * A próxima rotina, 2, validará esses dados
  */
  function handleRegistrationSubmit(event) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    if (dataValidate(data)) {

      setDisabledButton(true);

      requestServerOperation(data);

    }

  }

  /*
* Rotina 2
* Validação dos dados no frontend
* Recebe o objeto da classe FormData criado na rotina 1
* Se a validação não falhar, a próxima rotina, 3, é a da comunicação com o Laravel 
*/
  function dataValidate(formData) {

    const incidentDateValidate = incidentDate != null ? { error: false, message: "" } : { error: true, message: "Selecione a data inicial" };
    const incidentTypeValidate = FormValidation(formData.get("incident_type"), 2, null, null, null);
    const incidentNoteValidate = FormValidation(formData.get("description"), 3, null, null, null);

    setErrorDetected({ incident_date: incidentDateValidate.error, incident_type: incidentTypeValidate.error, description: incidentNoteValidate.error });
    setErrorMessage({ incident_date: incidentDateValidate.message, incident_type: incidentTypeValidate.message, description: incidentNoteValidate.message });

    if (incidentDateValidate.error || incidentTypeValidate.error || incidentNoteValidate.error) {

      return false;

    } else {

      return true;

    }

  }


  /*
  * Rotina 3
  * Comunicação AJAX com o Laravel utilizando AXIOS
  * Após o recebimento da resposta, é chamada próxima rotina, 4, de tratamento da resposta do servidor
  */
  function requestServerOperation(data) {

    AxiosApi.post(`/api/incidents-module`, {
      incident_date: moment(incidentDate).format('YYYY-MM-DD hh:mm:ss'),
      incident_type: data.get("incident_type"),
      description: data.get("description"),
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
  * Rotina 4B
  * Tratamento da resposta de uma requisição falha
  * Os erros relacionados aos parâmetros enviados são recuperados com o for in
  */
  function errorServerResponseTreatment(response_data) {

    setDisabledButton(false);

    let error_message = (response_data.message != "" && response_data.message != undefined) ? response_data.message : "Houve um erro na realização da operação!";
    setDisplayAlert({ display: true, type: "error", message: error_message });

    // Definição dos objetos de erro possíveis de serem retornados pelo validation do Laravel
    let input_errors = {
      incident_date: { error: false, message: null },
      incident_type: { error: false, message: null },
      description: { error: false, message: null }
    }

    // Coleta dos objetos de erro existentes na response
    for (let prop in response_data.errors) {

      input_errors[prop] = {
        error: true,
        message: response_data.errors[prop][0]
      }

    }

    setErrorDetected({
      incident_date: input_errors.incident_date.error,
      incident_type: input_errors.incident_type.error,
      description: input_errors.description.error
    });

    setErrorMessage({
      incident_date: input_errors.incident_date.message,
      incident_type: input_errors.incident_type.message,
      description: input_errors.description.message
    });

  }

  // ============================================================================== ESTRUTURAÇÃO DA PÁGINA - MATERIAL UI ============================================================================== //

  return (
    <>

      <Tooltip title="Novo incidente">
        <IconButton onClick={handleClickOpen} disabled={AuthData.data.user_powers["5"].profile_powers.escrever == 1 ? false : true}>
          <FontAwesomeIcon icon={faPlus} color={AuthData.data.user_powers["5"].profile_powers.escrever == 1 ? "#00713A" : "#808991"} size="sm" />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} PaperProps = {{style: { borderRadius: 15 }}}>
        <DialogTitle>CADASTRO DE INCIDENTE</DialogTitle>

        {/* Formulário da criação/registro do usuário - Componente Box do tipo "form" */}
        <Box component="form" noValidate onSubmit={handleRegistrationSubmit} >

          <DialogContent>

            <DialogContentText sx={{ mb: 3 }}>
              Formulário para criação de um registro de incidente.
            </DialogContentText>

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <DateTimeInput
                event={setIncidentDate}
                label={"Data do incidente"}
                helperText={errorMessage.incident_date}
                error={errorDetected.incident_date}
                defaultValue={moment()}
                operation={"create"}
                read_only={false}
              />
            </Box>

            <TextField
              type="text"
              margin="dense"
              label="Tipo do incidente"
              fullWidth
              variant="outlined"
              required
              id="incident_type"
              name="incident_type"
              helperText={errorMessage.incident_type}
              error={errorDetected.incident_type}
              sx={{ mb: 2 }}
            />

            <TextField
              type="text"
              margin="dense"
              label="Descrição"
              fullWidth
              variant="outlined"
              required
              id="description"
              name="description"
              helperText={errorMessage.description}
              error={errorDetected.description}
            />

          </DialogContent>

          {displayAlert.display &&
            <Alert severity={displayAlert.type}>{displayAlert.message}</Alert>
          }

          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={disabledButton} variant="contained">Criar incidente</Button>
          </DialogActions>

        </Box>

      </Dialog>

    </>
  )

});