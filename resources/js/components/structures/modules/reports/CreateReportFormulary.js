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
import { styled } from '@mui/material/styles';
// Custom
import AxiosApi from '../../../../services/AxiosApi';
import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';
import { FormValidation } from '../../../../utils/FormValidation';
// Fonts awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faFile } from '@fortawesome/free-solid-svg-icons';
// Outros
import moment from 'moment';
import { DateTimeSingle } from '../../date_picker/DateTimeSingle';

const Input = styled('input')({
  display: 'none',
});

export const CreateReportFormulary = React.memo(({ ...props }) => {

  // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

  // Utilizador do state global de autenticação
  const { AuthData } = useAuthentication();

  // States utilizados nas validações dos campos 
  const [errorDetected, setErrorDetected] = React.useState({ flight_start_date: false, flight_end_date: false, flight_log: false, report_note: false }); // State para o efeito de erro - true ou false
  const [errorMessage, setErrorMessage] = React.useState({ flight_start_date: "", flight_end_date: "", flight_log: "", report_note: "" }); // State para a mensagem do erro - objeto com mensagens para cada campo

  // State da mensagem do alerta
  const [displayAlert, setDisplayAlert] = React.useState({ display: false, type: "", message: "" });

  // State da acessibilidade do botão de executar o registro
  const [disabledButton, setDisabledButton] = React.useState(true);

  // States do formulário
  const [open, setOpen] = React.useState(false);

  // States dos inputs de data
  const [startDate, setStartDate] = React.useState(moment());
  const [endDate, setEndDate] = React.useState(moment());

  // State do upload do log
  const [logUploaded, setLogUploaded] = React.useState({ status: false, file: null });

  // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

  // Function por open the modal
  const handleClickOpen = () => {
    setOpen(true);
  }

  // Function for close the modal
  const handleClose = () => {
    setErrorDetected({ flight_start_date: false, flight_end_date: false, flight_log: false, report_note: false });
    setErrorMessage({ flight_start_date: "", flight_end_date: "", flight_log: "", report_note: "" });
    setDisplayAlert({ display: false, type: "", message: "" });
    setDisabledButton(false);
    setOpen(false);
  }

  /*
  * Rotina 1
  */
  function handleFileUploadedValidateItAndReleaseFormulary(event) {

    let file_uploaded = event.target.files[0];
    let file_extension = event.target.files[0].name.split('.').pop().toLowerCase();

    if (file_uploaded && file_extension == 'txt') {

      // EXTRAÇÃO DOS DADOS RELEVANTES DO ARQUIVO PARA O STATE
      // LIBERAÇÃO DO FORMULÁRIO DE GERAÇÃO DO RELATÓRIO

      setLogUploaded({ status: true, file: file_uploaded });

    } else {

      setLogUploaded({ status: false, file: null });

      setErrorDetected({ flight_start_date: false, flight_end_date: false, flight_log: true, report_note: false });
      setErrorMessage({ flight_start_date: "", flight_end_date: "", flight_log: "Arquivo inválido", report_note: "" });

    }

  }

  /*
  * Rotina 2
  */
  function handleRegistrationSubmit(event) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    if (dataValidate(data)) {

      if (verifyDateInterval()) {

        setDisabledButton(true);

        requestServerOperation(data);

      } else {

        setDisplayAlert({ display: true, type: "error", message: "Erro! A data inicial deve anteceder a final." });

      }

    }

  }

  /*
  * Rotina 2
  */
  function dataValidate(formData) {

    // Se o atributo "erro" for true, um erro foi detectado, e o atributo "message" terá a mensagem sobre a natureza do erro
    const startDateValidate = startDate != null ? { error: false, message: "" } : { error: true, message: "Selecione a data inicial" };
    const endDateValidate = endDate != null ? { error: false, message: "" } : { error: true, message: "Selecione a data final" };
    const noteValidate = FormValidation(formData.get("report_note"), 3, null, null, null);

    // Atualização dos estados responsáveis por manipular os inputs
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

    // Verificação da diferença das datas
    if (moment(startDate).format('YYYY-MM-DD hh:mm:ss') < moment(endDate).format('YYYY-MM-DD hh:mm:ss')) {

      return true;

    } else {

      return false;

    }

  }

  /*
  * Rotina 4
  */
  function requestServerOperation(data) {

    AxiosApi.post(`/api/reports-module?`, {
      flight_initial_date: moment(startDate).format('YYYY-MM-DD hh:mm:ss'),
      flight_final_date: moment(endDate).format('YYYY-MM-DD hh:mm:ss'),
      flight_log_file: data.get("flight_log_file"),
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

      <Tooltip title="Novo relatório">
        <IconButton onClick={handleClickOpen} disabled={AuthData.data.user_powers["4"].profile_powers.write == 1 ? false : true}>
          <FontAwesomeIcon icon={faPlus} color={AuthData.data.user_powers["4"].profile_powers.write == 1 ? "#00713A" : "#808991"} size="sm" />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} PaperProps={{ style: { borderRadius: 15 } }}>
        <DialogTitle>CADASTRO DE RELATÓRIO</DialogTitle>

        <Box component="form" noValidate onSubmit={handleRegistrationSubmit} >

          <DialogContent>

            <DialogContentText sx={{ mb: 3 }}>
              Faça o upload do log do drone para armazená-lo no sistema e também gerar um registro correspondente. A partir do seu registro que poderão ser gerados os relatórios.
            </DialogContentText>

            <Box sx={{ mb: 3 }}>
              <label htmlFor="contained-button-file">
                <Input accept=".txt" id="contained-button-file" multiple type="file" name="flight_log_file" onChange={handleFileUploadedValidateItAndReleaseFormulary} />
                <Button variant="contained" component="span" color={errorDetected.flight_log ? "error" : "primary"} startIcon={<FontAwesomeIcon icon={faFile} color={"#fff"} size="sm" />}>
                  {errorDetected.flight_log ? errorDetected.flight_log : "UPLOAD DO LOG"}
                </Button>
              </label>
            </Box>

            {logUploaded.status &&
              <>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <DateTimeSingle
                    event={setStartDate}
                    label={"Inicio do vôo"}
                    helperText={errorMessage.flight_start_date}
                    error={errorDetected.flight_start_date}
                    defaultValue={moment()}
                    operation={"create"}
                    read_only={true}
                  />
                  <DateTimeSingle
                    event={setEndDate}
                    name={"report_end_flight"}
                    label={"Fim do vôo"}
                    helperText={errorMessage.flight_end_date}
                    error={errorDetected.flight_end_date}
                    defaultValue={moment()}
                    operation={"create"}
                    read_only={true}
                  />
                </Box>

                <TextField
                  type="text"
                  margin="dense"
                  label="Observação"
                  fullWidth
                  variant="outlined"
                  required
                  id="report_note"
                  name="report_note"
                  helperText={errorMessage.report_note}
                  error={errorDetected.report_note}
                  sx={{ mb: 3 }}
                />
              </>
            }


          </DialogContent>

          {displayAlert.display &&
            <Alert severity={displayAlert.type} variant="filled">{displayAlert.message}</Alert>
          }

          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={disabledButton} variant="contained">Gerar relatório</Button>
          </DialogActions>

        </Box>

      </Dialog>
    </>
  );
});
