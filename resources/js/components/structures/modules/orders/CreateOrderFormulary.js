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
// Custom
import AxiosApi from '../../../../services/AxiosApi';
import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';
import { FormValidation } from '../../../../utils/FormValidation';
import { GenericSelect } from '../../input_select/GenericSelect';
import { DateTimeInput } from '../../date_picker/DateTimeInput';
import { ModalTransferList } from "../../modal_with_transfer_list/ModalTransferList";
import { RadioInput } from '../../radio_group/RadioInput';
// Fontsawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
// Libs
import moment from 'moment';

export const CreateOrderFormulary = React.memo(({ ...props }) => {

  // ============================================================================== STATES E OUTROS VALORES ============================================================================== //

  // Utilizador do state global de autenticação
  const { AuthData } = useAuthentication();

  // States do formulário
  const [open, setOpen] = React.useState(false);

  // States utilizados nas validações dos campos 
  const [errorDetected, setErrorDetected] = React.useState({ order_start_date: false, order_end_date: false, pilot_name: false, client_name: false, observation: false, flight_plans: false, status: false });
  const [errorMessage, setErrorMessage] = React.useState({ order_start_date: "", order_end_date: "", pilot_name: "", client_name: "", observation: "", flight_plans: "", status: "" });

  // State da mensagem do alerta
  const [displayAlert, setDisplayAlert] = React.useState({ display: false, type: "", message: "" });

  // State da acessibilidade do botão de executar o registro
  const [disabledButton, setDisabledButton] = React.useState(false);

  // States dos inputs de data
  const [startDate, setStartDate] = React.useState(moment());
  const [endDate, setEndDate] = React.useState(moment());

  // State dos planos de vôo selecionados
  const [flightPlansSelected, setFlightPlansSelected] = React.useState([]);

  // ============================================================================== FUNÇÕES/ROTINAS ============================================================================== //

  const handleClickOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setErrorDetected({ order_start_date: false, order_end_date: false, pilot_name: false, client_name: false, observation: false, flight_plans: false, status: false });
    setErrorMessage({ order_start_date: "", order_end_date: "", pilot_name: "", client_name: "", observation: "", flight_plans: "", status: "" });
    setDisplayAlert({ display: false, type: "", message: "" });
    setDisabledButton(false);
    setOpen(false);
  };

  /*
  * Rotina 1
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
  const dataValidate = (formData) => {

    // Se o atributo "erro" for true, um erro foi detectado, e o atributo "message" terá a mensagem sobre a natureza do erro
    const startDateValidate = startDate != null ? { error: false, message: "" } : { error: true, message: "Selecione a data inicial" };
    const endDateValidate = endDate != null ? { error: false, message: "" } : { error: true, message: "Selecione a data final" };
    const pilotNameValidate = formData.get("pilot_name") != 0 ? { error: false, message: "" } : { error: true, message: "O piloto deve ser selecionado" };
    const clientNameValidate = formData.get("client_name") != 0 ? { error: false, message: "" } : { error: true, message: "O cliente deve ser selecionado" };
    const orderNoteValidate = FormValidation(formData.get("observation"), 3, null, null, null);
    const fligthPlansValidate = flightPlansSelected != null ? { error: false, message: "" } : { error: true, message: "" };
    const statusValidate = Number(formData.get("status")) != 0 && Number(formData.get("status")) != 1 ? { error: true, message: "O status deve ser 1 ou 0" } : { error: false, message: "" };

    setErrorDetected({
      order_start_date: startDateValidate.error,
      order_end_date: endDateValidate.error,
      pilot_name: pilotNameValidate.error,
      client_name: clientNameValidate.error,
      observation: orderNoteValidate.error,
      flight_plans: fligthPlansValidate.error,
      status: statusValidate.error
    });

    setErrorMessage({
      order_start_date: startDateValidate.message,
      order_end_date: endDateValidate.message,
      pilot_name: pilotNameValidate.message,
      client_name: clientNameValidate.message,
      observation: orderNoteValidate.message,
      flight_plans: fligthPlansValidate.message,
      status: statusValidate.message
    });

    if (startDateValidate.error || endDateValidate.error || pilotNameValidate.error || clientNameValidate.error || orderNoteValidate.error || fligthPlansValidate.error || statusValidate.error) {

      return false;

    } else {

      return true;

    }

  };

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
  */
  const requestServerOperation = (data) => {

    let arr = [];
    let obj_with_arr_of_ids = {};

    flightPlansSelected.map((flight_plan, index) => {
      arr[index] = flight_plan.id;
    });

    obj_with_arr_of_ids["flight_plans_ids"] = arr;

    AxiosApi.post(`/api/orders-module`, {
      initial_date: moment(startDate).format('YYYY-MM-DD hh:mm:ss'),
      final_date: moment(endDate).format('YYYY-MM-DD hh:mm:ss'),
      pilot_id: data.get("pilot_name"),
      client_id: data.get("client_name"),
      observation: data.get("observation"),
      status: data.get("status"),
      fligth_plans_ids: JSON.stringify(obj_with_arr_of_ids)
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
  const successServerResponseTreatment = () => {

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
  const errorServerResponseTreatment = (response_data) => {

    setDisabledButton(false);

    let error_message = (response_data.message != "" && response_data.message != undefined) ? response_data.message : "Houve um erro na realização da operação!";
    setDisplayAlert({ display: true, type: "error", message: error_message });

    // Definição dos objetos de erro possíveis de serem retornados pelo validation do Laravel
    let input_errors = {
      initial_date: { error: false, message: null },
      final_date: { error: false, message: null },
      pilot_name: { error: false, message: null },
      client_name: { error: false, message: null },
      observation: { error: false, message: null },
      status: { error: false, message: null },
      fligth_plans_ids: { error: false, message: null }
    }

    // Coleta dos objetos de erro existentes na response
    for (let prop in response_data.errors) {

      input_errors[prop] = {
        error: true,
        message: response_data.errors[prop][0]
      }

    }

    setErrorDetected({
      order_start_date: input_errors.initial_date.error,
      order_end_date: input_errors.final_date.error,
      pilot_name: input_errors.pilot_name.error,
      client_name: input_errors.client_name.error,
      observation: input_errors.observation.error,
      flight_plans: input_errors.fligth_plans_ids.error,
      status: input_errors.status.error
    });

    setErrorMessage({
      order_start_date: input_errors.initial_date.message,
      order_end_date: input_errors.final_date.message,
      pilot_name: input_errors.pilot_name.message,
      client_name: input_errors.client_name.message,
      observation: input_errors.observation.message,
      flight_plans: input_errors.fligth_plans_ids.message,
      status: input_errors.status.message
    });

  }

  // ============================================================================== ESTRUTURAÇÃO ============================================================================== //

  return (
    <>
      <Tooltip title="Nova ordem de serviço">
        <IconButton onClick={handleClickOpen} disabled={AuthData.data.user_powers["3"].profile_powers.read == 1 ? false : true}>
          <FontAwesomeIcon icon={faPlus} color={AuthData.data.user_powers["3"].profile_powers.read == 1 ? "#00713A" : "#808991"} size="sm" />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} PaperProps={{ style: { borderRadius: 15 } }}>
        <DialogTitle>CADASTRO DE ORDEM DE SERVIÇO</DialogTitle>

        <Box component="form" noValidate onSubmit={handleRegistrationSubmit} >

          <DialogContent>

            <DialogContentText sx={{ mb: 3 }}>
              Formulário para criação de uma ordem de serviço.
            </DialogContentText>

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Box sx={{ mr: 1 }}>
                <DateTimeInput
                  event={setStartDate}
                  label={"Inicio da ordem de serviço"}
                  helperText={errorMessage.flight_start_date}
                  error={errorDetected.flight_start_date}
                  defaultValue={moment()}
                  operation={"create"}
                  read_only={false}
                />
              </Box>
              <Box>
                <DateTimeInput
                  event={setEndDate}
                  label={"Término da ordem de serviço"}
                  helperText={errorMessage.flight_end_date}
                  error={errorDetected.flight_end_date}
                  defaultValue={moment()}
                  operation={"create"}
                  read_only={false}
                />
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <GenericSelect
                label_text="Piloto"
                data_source={"/api/orders-module/create?table=users&where=profile_id.3&select_columns=id.name"}
                primary_key={"id"}
                key_content={"name"}
                helperText={errorMessage.pilot_name}
                error={errorDetected.pilot_name}
                default={0}
                name={"pilot_name"}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <GenericSelect
                label_text="Cliente"
                data_source={"/api/orders-module/create?table=users&where=profile_id.4&select_columns=id.name"}
                primary_key={"id"}
                key_content={"name"}
                helperText={errorMessage.client_name}
                error={errorDetected.client_name}
                default={0}
                name={"client_name"}
              />
            </Box>

            <Box sx={{ mb: 2 }}>

              <ModalTransferList
                open_button={"Planos de voo"}
                modal_title={"Seleção de Planos de Voo"}
                data_source={"/api/orders-module/create?table=flight_plans&select_columns=id.file.status"}
                set_selected_items={setFlightPlansSelected}
                selected_items={flightPlansSelected}
              />

            </Box>

            <TextField
              type="text"
              margin="dense"
              label="Observação"
              fullWidth
              variant="outlined"
              id="observation"
              name="observation"
              helperText={errorMessage.observation}
              error={errorDetected.observation}
              sx={{ mb: 2 }}
            />

            <Box>
              <RadioInput title={"Status"} name={"status"} default_value={"1"} options={[{ label: "Ativo", value: "1" }, { label: "Inativo", value: "0" }]} />
            </Box>

          </DialogContent>

          {displayAlert.display &&
            <Alert severity={displayAlert.type}>{displayAlert.message}</Alert>
          }

          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={disabledButton}>Criar ordem de serviço</Button>
          </DialogActions>

        </Box>

      </Dialog>
    </>
  );

});