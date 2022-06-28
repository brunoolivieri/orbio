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
import { FormValidation } from '../../../../utils/FormValidation';
import AxiosApi from '../../../../services/AxiosApi';
import { DateTimeInput } from '../../date_picker/DateTimeInput';
import { GenericSelect } from '../../input_select/GenericSelect';
import { ModalTransferList } from "../../modal_with_transfer_list/ModalTransferList";
import { RadioInput } from '../../radio_group/RadioInput';
// Fontsawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
// Libs
import moment from 'moment';

export const UpdateOrderFormulary = React.memo(({ ...props }) => {

  // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

  // Utilizador do state global de autenticação
  const { AuthData } = useAuthentication();

  // States do formulário
  const [open, setOpen] = React.useState(false);

  // States utilizados nas validações dos campos 
  const [errorDetected, setErrorDetected] = React.useState({ order_start_date: false, order_end_date: false, creator_name: false, pilot_name: false, client_name: false, observation: false, flight_plan: false, status: false });
  const [errorMessage, setErrorMessage] = React.useState({ order_start_date: "", order_end_date: "", creator_name: "", pilot_name: "", client_name: "", observation: "", flight_plan: "", status: "" });

  // State da mensagem do alerta
  const [displayAlert, setDisplayAlert] = React.useState({ display: false, type: "", message: "" });

  // State da acessibilidade do botão de executar o registro
  const [disabledButton, setDisabledButton] = React.useState(false);

  // States dos inputs de data
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);

  // State dos planos de vôo selecionados
  const [flightPlansSelected, setFlightPlansSelected] = React.useState([]);

  // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

  const handleClickOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setErrorDetected({ order_start_date: false, order_end_date: false, creator_name: false, pilot_name: false, client_name: false, observation: false, flight_plan: false, status: false });
    setErrorMessage({ order_start_date: false, order_end_date: false, creator_name: false, pilot_name: false, client_name: false, observation: false, flight_plan: false, status: false });
    setDisplayAlert({ display: false, type: "", message: "" });
    setDisabledButton(false);
    setOpen(false);
  }

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
  const submitedDataValidate = (formData) => {

    const startDateValidate = startDate != null ? { error: false, message: "" } : { error: true, message: "Selecione a data inicial" };
    const endDateValidate = endDate != null ? { error: false, message: "" } : { error: true, message: "Selecione a data final" };
    const pilotNameValidate = formData.get("select_pilot_name") != 0 ? { error: false, message: "" } : { error: true, message: "O piloto deve ser selecionado" };
    const clientNameValidate = formData.get("select_client_name") != 0 ? { error: false, message: "" } : { error: true, message: "O cliente deve ser selecionado" };
    const orderNoteValidate = FormValidation(formData.get("observation"), 3, null, null, null);
    const fligthPlansValidate = flightPlansSelected != null ? { error: false, message: "" } : { error: true, message: "" };
    const statusValidate = Number(formData.get("status")) != 0 && Number(formData.get("status")) != 1 ? { error: true, message: "O status deve ser 1 ou 0" } : { error: false, message: "" };

    setErrorDetected({
      order_start_date: startDateValidate.error,
      order_end_date: endDateValidate.error,
      pilot_name: pilotNameValidate.error,
      client_name: clientNameValidate.error,
      observation: orderNoteValidate.error,
      flight_plan: fligthPlansValidate.error,
      status: statusValidate.error
    });

    setErrorMessage({
      order_start_date: startDateValidate.message,
      order_end_date: endDateValidate.message,
      pilot_name: pilotNameValidate.message,
      client_name: clientNameValidate.message,
      observation: orderNoteValidate.message,
      flight_plan: fligthPlansValidate.message,
      status: statusValidate.message
    });

    if (startDateValidate.error || endDateValidate.error || pilotNameValidate.error || clientNameValidate.error || orderNoteValidate.error || fligthPlansValidate.error || statusValidate.error) {

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
  const requestServerOperation = (data) => {

    let arr = [];
    let obj_with_arr_of_ids = {};

    flightPlansSelected.map((flight_plan, index) => {
      arr[index] = flight_plan.id;
    });

    obj_with_arr_of_ids["flight_plans_ids"] = arr;

    AxiosApi.patch(`/api/orders-module/${data.get("id")}`, {
      initial_date: moment(startDate).format('YYYY-MM-DD hh:mm:ss'),
      final_date: moment(endDate).format('YYYY-MM-DD hh:mm:ss'),
      pilot_id: data.get("select_pilot_name"),
      client_id: data.get("select_client_name"),
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

      // Deselecionar registro na tabela
      props.record_setter(null);
      // Outros
      props.reload_table();
      setDisabledButton(false);
      handleClose();

    }, 2000);

  }

  /*
  * Rotina 5B
  */
  function errorServerResponseTreatment(response_data) {

    setDisabledButton(false);

    let error_message = (response_data.message != "" && response_data.message != undefined) ? response_data.message : "Houve um erro na realização da operação!";
    setDisplayAlert({ display: true, type: "error", message: error_message });

    // Definição dos objetos de erro possíveis de serem retornados pelo validation do Laravel
    let input_errors = {
      initial_date: { error: false, message: null },
      final_date: { error: false, message: null },
      creator_name: { error: false, message: null },
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
      creator_name: input_errors.creator_name.error,
      pilot_name: input_errors.pilot_name.error,
      client_name: input_errors.client_name.error,
      observation: input_errors.observation.error,
      flight_plans: input_errors.fligth_plans_ids.error,
      status: input_errors.status.error
    });

    setErrorMessage({
      order_start_date: input_errors.initial_date.message,
      order_end_date: input_errors.final_date.message,
      creator_name: input_errors.creator_name.message,
      pilot_name: input_errors.pilot_name.message,
      client_name: input_errors.client_name.message,
      observation: input_errors.observation.message,
      flight_plans: input_errors.fligth_plans_ids.message,
      status: input_errors.status.message
    });

  }

  // ============================================================================== ESTRUTURAÇÃO DA PÁGINA - COMPONENTES DO MATERIAL UI ============================================================================== //

  return (
    <>

      <Tooltip title="Editar">
        <IconButton disabled={AuthData.data.user_powers["3"].profile_powers.read == 1 ? false : true} onClick={handleClickOpen}>
          <FontAwesomeIcon icon={faPen} color={AuthData.data.user_powers["3"].profile_powers.read == 1 ? "#007937" : "#808991"} size="sm" />
        </IconButton>
      </Tooltip>

      {(props.record != null && open) &&
        <Dialog open={open} onClose={handleClose} PaperProps={{ style: { borderRadius: 15 } }}>
          <DialogTitle>ATUALIZAÇÃO | ORDEM DE SERVIÇO (ID: {props.record.id})</DialogTitle>

          <Box component="form" noValidate onSubmit={handleSubmitOperation} >

            <DialogContent>

              <TextField
                type="text"
                margin="dense"
                label="ID da ordem de serviço"
                fullWidth
                variant="outlined"
                required
                id="id"
                name="id"
                defaultValue={props.record.id}
                sx={{ mb: 2 }}
                InputProps={{
                  readOnly: true
                }}
              />

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Box sx={{ mr: 1 }}>
                  <DateTimeInput
                    event={setStartDate}
                    label={"Inicio da ordem de serviço"}
                    helperText={errorMessage.order_start_date}
                    error={errorDetected.order_start_date}
                    defaultValue={props.record.order_start_date}
                    operation={"update"}
                    read_only={false}
                  />
                </Box>
                <Box>
                  <DateTimeInput
                    event={setEndDate}
                    label={"Fim da ordem de serviço"}
                    helperText={errorMessage.order_start_date}
                    error={errorDetected.order_start_date}
                    defaultValue={props.record.order_end_date}
                    operation={"update"}
                    read_only={false}
                  />
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <GenericSelect
                  label_text="Piloto"
                  data_source={"/api/load-users?where=profile_id.3"}
                  primary_key={"id"}
                  key_content={"name"}
                  helperText={errorMessage.pilot_name}
                  error={errorDetected.pilot_name}
                  default={props.record.pilot.id}
                  name={"select_pilot_name"}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <GenericSelect
                  label_text="Cliente"
                  data_source={"/api/load-users?where=profile_id.4"}
                  primary_key={"id"}
                  key_content={"name"}
                  helperText={errorMessage.client_name}
                  error={errorDetected.client_name}
                  default={props.record.client.id}
                  name={"select_client_name"}
                />
              </Box>

              <Box sx={{ mb: 2 }}>

                <ModalTransferList
                  open_button={"Planos de voo"}
                  modal_title={"Seleção de Planos de Voo"}
                  data_source={"/api/load-flight_plans"}
                  set_selected_items={setFlightPlansSelected}
                  selected_items={props.record.flight_plans}
                />

              </Box>

              <TextField
                type="text"
                margin="dense"
                label="Observação"
                fullWidth
                variant="outlined"
                required
                id="observation"
                name="observation"
                helperText={errorMessage.observation}
                error={errorDetected.observation}
                defaultValue={props.record.observation}
                sx={{ mb: 2 }}
              />

              <Box>
                <RadioInput title={"Status"} name={"status"} default_value={props.record.status} options={[{ label: "Ativo", value: "1" }, { label: "Inativo", value: "0" }]} />
              </Box>

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