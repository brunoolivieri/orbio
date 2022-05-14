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
import { Tooltip } from "@mui/material";
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
// Outros
import moment from 'moment';
// Custom
import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';
import { FormValidation } from '../../../../utils/FormValidation';
import AxiosApi from '../../../../services/AxiosApi';
import { DateTimeInput } from '../../date_picker/DateTimeInput';

export function UpdateIncidentFormulary({ ...props }) {

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
  const [incidentDate, setIncidentDate] = React.useState(null);

  // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

  // Função para abrir o modal
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Função para fechar o modal
  const handleClose = () => {

    // Deselecionar registro na tabela
    props.record_setter(null);
    // Outros
    setErrorDetected({ incident_date: false, incident_type: false, description: false });
    setErrorMessage({ incident_date: "", incident_type: "", description: "" });
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

    if (submitedDataValidate(data)) {

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
  function submitedDataValidate(formData) {

    // Se o atributo "erro" for true, um erro foi detectado, e o atributo "message" terá a mensagem sobre a natureza do erro
    const incidentDateValidate = incidentDate != null ? { error: false, message: "" } : { error: true, message: "Selecione a data inicial" };
    const incidentTypeValidate = FormValidation(formData.get("incident_type"), 2, null, null, null);
    const incidentNoteValidate = FormValidation(formData.get("description"), 3, null, null, null);

    // Atualização dos estados responsáveis por manipular os inputs
    setErrorDetected({ incident_date: incidentDateValidate.error, incident_type: incidentTypeValidate.error, description: incidentNoteValidate.error });
    setErrorMessage({ incident_date: incidentDateValidate.message, incident_type: incidentTypeValidate.message, description: incidentNoteValidate.message });

    if (incidentDateValidate.error || incidentTypeValidate.error || incidentNoteValidate.error) {

      return false;

    } else {

      return true;

    }

  }

  /*
 * Rotina 4
 * Realização da requisição AXIOS
 * Possui dois casos: o Update e o Delete
 * 
 */
  function requestServerOperation(data) {

    // Dados para o middleware de autenticação 
    let logged_user_id = AuthData.data.id;
    let module_id = 5;
    let module_action = "escrever";

    AxiosApi.patch(`/api/incidents-module/${data.get("incident_id")}`, {
      auth: `${logged_user_id}.${module_id}.${module_action}`,
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
      <Tooltip title="Editar">
        <IconButton disabled={AuthData.data.user_powers["5"].profile_powers.escrever == 1 ? false : true} onClick={handleClickOpen}>
          <FontAwesomeIcon icon={faPen} color={AuthData.data.user_powers["5"].profile_powers.escrever == 1 ? "#007937" : "#808991"} size="sm" />
        </IconButton>
      </Tooltip>

      {(props.record != null && open) &&

        <Dialog open={open} onClose={handleClose} PaperProps = {{style: { borderRadius: 15 }}}>
          <DialogTitle>ATUALIZAÇÃO | INCIDENTE (ID: {props.record.incident_id})</DialogTitle>

          {/* Formulário da criação/registro do usuário - Componente Box do tipo "form" */}
          <Box component="form" noValidate onSubmit={handleSubmitOperation} >

            <DialogContent>

              <TextField
                type="text"
                margin="dense"
                label="ID do incidente"
                fullWidth
                variant="outlined"
                required
                id="incident_id"
                name="incident_id"
                InputProps={{
                  readOnly: true
                }}
                defaultValue={props.record.incident_id}
                sx={{ mb: 2 }}
              />

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <DateTimeInput
                  event={setIncidentDate}
                  label={"Data do incidente"}
                  helperText={errorMessage.incident_date}
                  error={errorDetected.incident_date}
                  defaultValue={props.record.incident_date}
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
                defaultValue={props.record.incident_type}
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
                defaultValue={props.record.description}
              />

            </DialogContent>

            {displayAlert.display &&
              <Alert severity={displayAlert.type}>{displayAlert.message}</Alert>
            }

            <DialogActions>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button type="submit" disabled={disabledButton}>Confirmar atualização</Button>
            </DialogActions>

          </Box>

        </Dialog>
      }
    </>
  )

}