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

export const UpdateReportFormulary = React.memo(({ ...props }) => {

  // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

  // Utilizador do state global de autenticação
  const { AuthData } = useAuthentication();

  // States do formulário
  const [open, setOpen] = React.useState(false);

  // States utilizados nas validações dos campos 
  const [errorDetected, setErrorDetected] = React.useState({ flight_start_date: false, flight_end_date: false, flight_log: false, report_note: false }); // State para o efeito de erro - true ou false
  const [errorMessage, setErrorMessage] = React.useState({ flight_start_date: "", flight_end_date: "", flight_log: "", report_note: "" }); // State para a mensagem do erro - objeto com mensagens para cada campo

  // State da mensagem do alerta
  const [displayAlert, setDisplayAlert] = React.useState({ display: false, type: "", message: "" });

  // State da acessibilidade do botão de executar o registro
  const [disabledButton, setDisabledButton] = React.useState(false);

  // States dos inputs de data
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);

  // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

  const handleClickOpen = () => {
    setOpen(true);
  }

  // Função para fechar o modal
  const handleClose = () => {
    setErrorDetected({ flight_start_date: false, flight_end_date: false, flight_log: false, report_note: false });
    setErrorMessage({ flight_start_date: "", flight_end_date: "", flight_log: "", report_note: "" });
    setDisplayAlert({ display: false, type: "", message: "" });
    setDisabledButton(false);
    setOpen(false);
  };

  /*
 * Rotina 1
 * 
 */
  const handleSubmitOperation = (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    if (submitedDataValidate(data)) {

      if (verifyDateInterval()) {

        setDisabledButton(true);
        requestServerOperation(data);

      } else {

        setDisplayAlert({ display: false, type: "", message: "Erro! A data inicial não pode anteceder a final." });

      }

    }

  }

  /*
 * Rotina 2
 */
  function submitedDataValidate(formData) {

    const startDateValidate = startDate != null ? { error: false, message: "" } : { error: true, message: "Selecione a data inicial" };
    const endDateValidate = endDate != null ? { error: false, message: "" } : { error: true, message: "Selecione a data final" };
    const noteValidate = FormValidation(formData.get("report_note"), 3, null, null, null);

    setErrorDetected({ flight_start_date: startDateValidate.error, flight_end_date: endDateValidate.error, flight_log: false, report_note: noteValidate.error });
    setErrorMessage({ flight_start_date: startDateValidate.message, flight_end_date: endDateValidate.message, flight_log: "", report_note: noteValidate.message });

    if (startDateValidate.error || endDateValidate.error || noteValidate.error) {

      return false;

    } else {

      return true;

    }

  }

  /*
 * Rotina 3
 * 
 */
  function verifyDateInterval() {

    if (moment(startDate).format('YYYY-MM-DD hh:mm:ss') < moment(endDate).format('YYYY-MM-DD hh:mm:ss')) {

      return true;

    } else {

      return false;

    }

  }

  /*
 * Rotina 4
 * 
 */
  function requestServerOperation(data) {

    AxiosApi.patch(`/api/reports-module/${data.get("id")}`, {
      flight_initial_date: moment(startDate).format('YYYY-MM-DD hh:mm:ss'),
      flight_final_date: moment(endDate).format('YYYY-MM-DD hh:mm:ss'),
      flight_log_file: data.get("flight_log"),
      observation: data.get("report_note")
    })
      .then(function () {

        successServerResponseTreatment();

      })
      .catch(function (error) {

        errorServerResponseTreatment(error.response.data);

      });

  }

  /*
  * Rotina 5A
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
  * Rotina 5B
  */
  function errorServerResponseTreatment(response_data) {

    let error_message = (response_data.message != "" && response_data.message != undefined) ? response_data.message : "Houve um erro na realização da operação!";
    setDisplayAlert({ display: true, type: "error", message: error_message });

    // Definição dos objetos de erro possíveis de serem retornados pelo validation do Laravel
    let input_errors = {
      flight_initial_date: { error: false, message: null },
      flight_final_date: { error: false, message: null },
      flight_log_file: { error: false, message: null },
      observation: { error: false, message: null },
    }

    // Coleta dos objetos de erro existentes na response
    for (let prop in response_data.errors) {

      input_errors[prop] = {
        error: true,
        message: response_data.errors[prop][0]
      }

    }

    setErrorDetected({
      flight_start_date: input_errors.flight_initial_date.error,
      flight_end_date: input_errors.flight_final_date.error,
      flight_log: input_errors.flight_log_file.error,
      report_note: input_errors.observation.error
    });

    setErrorMessage({
      flight_start_date: input_errors.flight_initial_date.message,
      flight_end_date: input_errors.flight_final_date.message,
      flight_log: input_errors.flight_log_file.message,
      report_note: input_errors.observation.message
    });

  }

  // ============================================================================== ESTRUTURAÇÃO DA PÁGINA ============================================================================== //

  return (
    <>

      <Tooltip title="Editar">
        <IconButton disabled={AuthData.data.user_powers["4"].profile_powers.write == 1 ? false : true} onClick={handleClickOpen}>
          <FontAwesomeIcon icon={faPen} color={AuthData.data.user_powers["4"].profile_powers.write == 1 ? "#007937" : "#808991"} size="sm" />
        </IconButton>
      </Tooltip>

      {(props.selected_record.dom != null && open) &&

        <Dialog open={open} onClose={handleClose} PaperProps = {{style: { borderRadius: 15 }}}>
          <DialogTitle>ATUALIZAÇÃO | RELATÓRIO (ID: {props.selected_record.data_cells.report_id})</DialogTitle>

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
                defaultValue={props.selected_record.data_cells.report_id}
                InputProps={{
                  readOnly: true,
                }}
                sx={{ mb: 3 }}
              />

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <DateTimeInput
                  event={setStartDate}
                  label={"Inicio do vôo"}
                  helperText={errorMessage.flight_start_date}
                  error={errorDetected.flight_start_date}
                  defaultValue={props.selected_record.data_cells.flight_start_date}
                  operation={"update"}
                  read_only={false}
                />
                <DateTimeInput
                  event={setEndDate}
                  label={"Fim do vôo"}
                  helperText={errorMessage.flight_end_date}
                  error={errorDetected.flight_end_date}
                  defaultValue={props.selected_record.data_cells.flight_end_date}
                  operation={"update"}
                  read_only={false}
                />
              </Box>

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
                }}
                helperText={errorMessage.flight_log}
                error={errorDetected.flight_log}
                sx={{ mb: 2 }}
              />

              <TextField
                margin="dense"
                id="report_note"
                name="report_note"
                label="Observação"
                type="text"
                fullWidth
                variant="outlined"
                defaultValue={props.selected_record.data_cells.report_note}
                helperText={errorMessage.report_note}
                error={errorDetected.report_note}
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

  );

});