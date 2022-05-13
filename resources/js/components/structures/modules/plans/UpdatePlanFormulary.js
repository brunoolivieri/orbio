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
import { Switch } from '@mui/material';
import { FormGroup } from '@mui/material';
import { FormControlLabel } from '@mui/material';
// Custom
import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';
import { FormValidation } from '../../../../utils/FormValidation';
import AxiosApi from '../../../../services/AxiosApi';
import { GenericSelect } from '../../input_select/GenericSelect';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

export const UpdatePlanFormulary = React.memo(({ ...props }) => {

  // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

  // Utilizador do state global de autenticação
  const { AuthData } = useAuthentication();

  const [open, setOpen] = React.useState(false);

  // States utilizados nas validações dos campos 
  const [errorDetected, setErrorDetected] = React.useState({ description: false, status: false }); // State para o efeito de erro - true ou false
  const [errorMessage, setErrorMessage] = React.useState({ description: "", status: "" }); // State para a mensagem do erro - objeto com mensagens para cada campo

  // State da mensagem do alerta
  const [displayAlert, setDisplayAlert] = React.useState({ display: false, type: "", message: "" });

  // State da acessibilidade do botão de executar o registro
  const [disabledButton, setDisabledButton] = React.useState(false);

  // Switch state
  const [isChecked, setIsChecked] = React.useState(props.record.plan_status == 1 ? true : false);

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
    setErrorDetected({ status: false, description: false });
    setErrorMessage({ status: "", description: "" });
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
    const descriptionValidate = FormValidation(formData.get("description"), 3, null, null, null);
    const statusValidate = (Number(isChecked) == 0 || Number(isChecked) == 1) ? { error: false, message: "" } : { error: true, message: "O status deve ser 1 ou 0" };

    setErrorDetected({ description: descriptionValidate.error, status: statusValidate.error });
    setErrorMessage({ description: descriptionValidate.message, status: statusValidate.message });

    if (descriptionValidate.error || statusValidate.error) {

      return false;

    } else {

      return true;

    }

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
    let module_id = 2;
    let module_action = "escrever";

    AxiosApi.patch(`/api/plans-module/${data.get("plan_id")}`, {
      auth: `${logged_user_id}.${module_id}.${module_action}`,
      report_id: data.get("select_report"),
      incident_id: data.get("select_incident"),
      status: isChecked,
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
  */
  function errorServerResponseTreatment(response_data) {

    let error_message = (response_data.message != "" && response_data.message != undefined) ? response_data.message : "Houve um erro na realização da atualização!";
    setDisplayAlert({ display: true, type: "error", message: error_message });

    let input_errors = {
      report_id: { error: false, message: null },
      incident_id: { error: false, message: null },
      status: { error: false, message: null },
      description: { error: false, message: null }
    }

    for (let prop in response_data.errors) {

      input_errors[prop] = {
        error: true,
        message: ""
      }

    }

    setErrorDetected({
      report: input_errors.report_id.error,
      incident: input_errors.incident_id.error,
      status: input_errors.status.error,
      description: input_errors.description.error
    });

    setErrorMessage({
      report: input_errors.report_id.message,
      incident: input_errors.incident_id.message,
      status: input_errors.status.message,
      description: input_errors.description.message
    });

  }

  // ============================================================================== ESTRUTURAÇÃO DA PÁGINA - COMPONENTES DO MATERIAL UI ============================================================================== //

  return (
    <>
      <Tooltip title="Editar">
        <IconButton disabled={AuthData.data.user_powers["2"].profile_powers.escrever == 1 ? false : true} onClick={handleClickOpen}>
          <FontAwesomeIcon icon={faPen} color={AuthData.data.user_powers["2"].profile_powers.escrever == 1 ? "#007937" : "#808991"} size="sm" />
        </IconButton>
      </Tooltip>

      {(props.record != null && open) &&

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>EDIÇÃO | PLANO DE VÔO (ID: {props.record.plan_id})</DialogTitle>

          {/* Formulário da criação/registro do usuário - Componente Box do tipo "form" */}
          <Box component="form" noValidate onSubmit={handleSubmitOperation} >
            <DialogContent>

              <TextField
                margin="dense"
                id="plan_id"
                name="plan_id"
                label="ID do plano"
                type="text"
                fullWidth
                variant="outlined"
                defaultValue={props.record.plan_id}
                inputProps={{
                  readOnly: true
                }}
                sx={{ mb: 2 }}
              />

              <Box sx={{ mb: 2 }}>
                <GenericSelect
                  label_text={"Relatório"}
                  data_source={"/api/plans-module/create?table=reports&auth=none"}
                  primary_key={"id"}
                  key_content={"id"}
                  error={null}
                  default={props.record.report_id != null ? props.record.report_id : 0}
                  name={"select_report"}
                />
                <GenericSelect
                  label_text={"Incidente"}
                  data_source={"/api/plans-module/create?table=incidents&auth=none"}
                  primary_key={"id"}
                  key_content={"id"}
                  error={null}
                  default={props.record.incident_id != null ? props.record.incident_id : 0}
                  name={"select_incident"}
                />
              </Box>

              <TextField
                margin="dense"
                id="description"
                name="description"
                label="Descrição"
                type="text"
                fullWidth
                variant="outlined"
                defaultValue={props.record.plan_description}
                helperText={errorMessage.description}
                error={errorDetected.description}
              />

              <Box sx={{ marginTop: 3 }}>
                <FormGroup>
                  <FormControlLabel control={<Switch defaultChecked={isChecked} onChange={(event) => { setIsChecked(event.currentTarget.checked) }} />} label={isChecked ? "Ativo" : "Inativo"} />
                </FormGroup>
              </Box>

            </DialogContent>

            {displayAlert.display &&
              <Alert severity={displayAlert.type}>{displayAlert.message}</Alert>
            }

            <DialogActions>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button type="submit" disabled={disabledButton} variant="contained">Confirmar atualização</Button>
            </DialogActions>

          </Box>
        </Dialog>
      }
    </>
  );
});