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
import { Switch } from '@mui/material';
import { FormGroup } from '@mui/material';
import { FormControlLabel } from '@mui/material';
// Custom
import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';
import { FormValidation } from '../../../../utils/FormValidation';
import AxiosApi from '../../../../services/AxiosApi';
import { DateTimeInput } from '../../date_picker/DateTimeInput';
import { GenericSelect } from '../../input_select/GenericSelect';
import {ModalTransferList} from "../../modal_with_transfer_list/ModalTransferList";
// Fontsawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
// Libs
import moment from 'moment';

export const UpdateOrderFormulary = React.memo(({...props}) => {

// ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

    // Utilizador do state global de autenticação
    const {AuthData, setAuthData} = useAuthentication();

    // States do formulário
    const [open, setOpen] = React.useState(false);

    // States utilizados nas validações dos campos 
    const [errorDetected, setErrorDetected] = React.useState({order_start_date: false, order_end_date: false, creator_name: false, pilot_name: false, client_name: false, order_note: false, flight_plan: false, status: false}); 
    const [errorMessage, setErrorMessage] = React.useState({order_start_date: "", order_end_date: "", creator_name: "", pilot_name: "", client_name: "", order_note: "", flight_plan: "", status: ""}); 

    // State da mensagem do alerta
    const [displayAlert, setDisplayAlert] = React.useState({display: false, type: "", message: ""});

    // State da acessibilidade do botão de executar o registro
    const [disabledButton, setDisabledButton] = React.useState(false);

    // States dos inputs de data
    const [startDate, setStartDate] = React.useState(null);
    const [endDate, setEndDate] = React.useState(null);

    // State dos planos de vôo selecionados
    const [flightPlansSelected, setFlightPlansSelected] = React.useState([]);

    // Switch state
    const [isChecked, setIsChecked] = React.useState(props.record.order_status == 1 ? true : false);

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
      setErrorDetected({order_start_date: false, order_end_date: false, creator_name: false, pilot_name: false, client_name: false, order_note: false, flight_plan: false, status: false});
      setErrorMessage({order_start_date: false, order_end_date: false, creator_name: false, pilot_name: false, client_name: false, order_note: false, flight_plan: false, status: false});
      setDisplayAlert({display: false, type: "", message: ""});
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

        if(submitedDataValidate(data)){

          if(verifyDateInterval()){

            setDisabledButton(true);

            requestServerOperation(data);

          }else{
          
            setDisplayAlert({display: false, type: "", message: "Erro! A data inicial não pode anteceder a final."});

          }

      }

    }

     /*
    * Rotina 2
    * Validação dos dados no frontend
    * Recebe o objeto da classe FormData criado na rotina 1
    * Se a validação não falhar, a próxima rotina, 3, é a da comunicação com o Laravel 
    */
     function submitedDataValidate(formData){

      // Se o atributo "erro" for true, um erro foi detectado, e o atributo "message" terá a mensagem sobre a natureza do erro
      const startDateValidate = startDate != null ? {error: false, message: ""} : {error: true, message: "Selecione a data inicial"};
      const endDateValidate = endDate != null ? {error: false, message: ""} : {error: true, message: "Selecione a data final"};
      const pilotNameValidate = formData.get("select_pilot_name") != 0 ? {error: false, message: ""} : {error: true, message: "O piloto deve ser selecionado"};
      const clientNameValidate = formData.get("select_client_name") != 0 ? {error: false, message: ""} : {error: true, message: "O cliente deve ser selecionado"};
      const orderNoteValidate = FormValidation(formData.get("order_note"), 3, null, null, null);
      const fligthPlansValidate = flightPlansSelected != null ? {error: false, message: ""} : {error: true, message: ""};
      const statusValidate = Number(isChecked) != 0 && Number(isChecked) != 1 ? {error: true, message: "O status deve ser 1 ou 0"} : {error: false, message: ""}; 

      setErrorDetected({
        order_start_date: startDateValidate.error, 
        order_end_date: endDateValidate.error, 
        pilot_name: pilotNameValidate.error, 
        client_name: clientNameValidate.error, 
        order_note: orderNoteValidate.error, 
        flight_plan: fligthPlansValidate.error,
        status: statusValidate.error
      });

      setErrorMessage({
        order_start_date: startDateValidate.message, 
        order_end_date: endDateValidate.message, 
        pilot_name: pilotNameValidate.message, 
        client_name: clientNameValidate.message, 
        order_note: orderNoteValidate.message, 
        flight_plan: fligthPlansValidate.message,
        status: statusValidate.message
      });
    
      if(startDateValidate.error || endDateValidate.error || pilotNameValidate.error || clientNameValidate.error || orderNoteValidate.error || fligthPlansValidate.error || statusValidate.error){

        return false;

      }else{
    
          return true;

      }

    }

     /*
    * Rotina 3
    * Ocorre a verificação do intervalo de tempo entre as datas
    * As datas retornadas do componente DateTimePicker do Material UI são formatadas
    * A formatação ocorre com a biblioteca Moment.js - https://momentjs.com/
    * 
    */ 
     function verifyDateInterval(){

      // Verificação da diferença das datas
      if(moment(startDate).format('YYYY-MM-DD hh:mm:ss') < moment(endDate).format('YYYY-MM-DD hh:mm:ss')){

        return true;
        
      }else{

        return false;

      }

    }

     /*
    * Rotina 4
    * Realização da requisição AXIOS
    * Possui dois casos: o Update e o Delete
    * 
    */ 
    function requestServerOperation(data){

        // Dados para o middleware de autenticação 
        let logged_user_id = AuthData.data.id;
        let module_id = 3;
        let module_action = "escrever";

        // Para recuperar os ids dos planos selecionados
        let arr = [];
        let obj_with_arr_of_ids = {};

        flightPlansSelected.map((flight_plan, index) => {
          arr[index] = flight_plan.id;
        });

        obj_with_arr_of_ids["flight_plans_ids"] = arr;

        AxiosApi.patch(`/api/orders-module/${data.get("order_id")}`, {
          auth: `${logged_user_id}.${module_id}.${module_action}`,
          initial_date: moment(startDate).format('YYYY-MM-DD hh:mm:ss'),
          final_date: moment(endDate).format('YYYY-MM-DD hh:mm:ss'),
          pilot_id: data.get("select_pilot_name"),
          client_id: data.get("select_client_name"),
          observation: data.get("order_note"),
          status: isChecked,
          fligth_plans_ids: JSON.stringify(obj_with_arr_of_ids)
        })
        .then(function (response) {

            successServerResponseTreatment();

        })
        .catch(function (error) {
            
            errorServerResponseTreatment(error.response.data);

        });

    }

    /*
    * Rotina 5A
    * Tratamento da resposta de uma requisição bem sucedida
    */
    function successServerResponseTreatment(){

      setDisplayAlert({display: true, type: "success", message: "Operação realizada com sucesso!"});

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
    * Tratamento da resposta de uma requisição falha
    */
    function errorServerResponseTreatment(response_data){

      setDisabledButton(false);

      let error_message = (response_data.message != "" && response_data.message != undefined) ? response_data.message : "Houve um erro na realização da operação!";
      setDisplayAlert({display: true, type: "error", message: error_message});

      // Definição dos objetos de erro possíveis de serem retornados pelo validation do Laravel
      let input_errors = {
        initial_date: {error: false, message: null},
        final_date: {error: false, message: null},
        creator_name: {error: false, message: null},
        pilot_name: {error: false, message: null},
        client_name: {error: false, message: null},
        observation: {error: false, message: null},
        status: {error: false, message: null},
        fligth_plans_ids: {error: false, message: null}
      }

      // Coleta dos objetos de erro existentes na response
      for(let prop in response_data.errors){

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
        order_note: input_errors.observation.error,
        flight_plans: input_errors.fligth_plans_ids.error,
        status: input_errors.status.error
      });

      setErrorMessage({
        order_start_date: input_errors.initial_date.message, 
        order_end_date: input_errors.final_date.message, 
        creator_name: input_errors.creator_name.message, 
        pilot_name: input_errors.pilot_name.message, 
        client_name: input_errors.client_name.message, 
        order_note: input_errors.observation.message,
        flight_plans: input_errors.fligth_plans_ids.message,
        status: input_errors.status.message
      });

    }

// ============================================================================== ESTRUTURAÇÃO DA PÁGINA - COMPONENTES DO MATERIAL UI ============================================================================== //

    return (
        <>
        
        <Tooltip title="Editar">
            <IconButton disabled={AuthData.data.user_powers["3"].profile_powers.escrever == 1 ? false : true} onClick={handleClickOpen}>
                <FontAwesomeIcon icon={faPenToSquare} color={AuthData.data.user_powers["3"].profile_powers.escrever == 1 ? "#007937" : "#808991"} size = "sm"/>
            </IconButton>
        </Tooltip>

        {(props.record != null && open) && 
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>ATUALIZAÇÃO | ORDEM DE SERVIÇO (ID: {props.record.order_id})</DialogTitle>
    
            <Box component="form" noValidate onSubmit={handleSubmitOperation} >
    
              <DialogContent>

                <TextField
                type = "text"
                margin="dense"
                label="ID da ordem de serviço"
                fullWidth
                variant="outlined"
                required
                id="order_id"
                name="order_id"
                defaultValue = {props.record.order_id}
                sx={{mb: 2}}
                />

                <Box sx={{display: "flex", justifyContent: "space-between", mb: 2}}>
                  <DateTimeInput 
                  event = {setStartDate}
                  label = {"Inicio da ordem de serviço"} 
                  helperText = {errorMessage.order_start_date} 
                  error = {errorDetected.order_start_date} 
                  defaultValue = {props.record.order_start_date}
                  operation = {"update"}
                  read_only = {false}
                  />
                  <DateTimeInput
                  event = {setEndDate}
                  label = {"Fim da ordem de serviço"} 
                  helperText = {errorMessage.order_start_date} 
                  error = {errorDetected.order_start_date} 
                  defaultValue = {props.record.order_end_date}
                  operation = {"update"}
                  read_only = {false}
                  />
                </Box>

                <Box sx={{mb: 2}}>
                  <GenericSelect 
                  label_text = "Piloto"
                  data_source = {"/api/orders-module/create?table=users&where=id_perfil.3&select_columns=id.nome&auth=none"} 
                  primary_key={"id"} 
                  key_content={"nome"} 
                  helperText = {errorMessage.pilot_name}
                  error = {errorDetected.pilot_name} 
                  default = {props.record.pilot.id} 
                  name = {"select_pilot_name"}  
                  />
                </Box>

                <Box sx={{mb: 2}}>
                  <GenericSelect 
                  label_text = "Cliente"
                  data_source = {"/api/orders-module/create?table=users&where=id_perfil.4&select_columns=id.nome&auth=none"} 
                  primary_key={"id"} 
                  key_content={"nome"} 
                  helperText = {errorMessage.client_name}
                  error = {errorDetected.client_name} 
                  default = {props.record.client.id} 
                  name = {"select_client_name"}  
                  />
                </Box>

                <Box sx={{mb: 2}}>

                  <ModalTransferList 
                  open_button = {"Selecionar planos de vôo"} 
                  modal_title = {"Seleção de Planos de Vôo"} 
                  data_source = {"/api/orders-module/create?table=flight_plans&select_columns=id.arquivo.status&auth=none"} 
                  set_selected_items = {setFlightPlansSelected} 
                  selected_items = {props.record.flight_plans} 
                  />
                  
                </Box>

                <TextField
                type = "text"
                margin="dense"
                label="Observação"
                fullWidth
                variant="outlined"
                required
                id="order_note"
                name="order_note"
                helperText = {errorMessage.order_note}
                error = {errorDetected.order_note}
                defaultValue = {props.record.order_note}
                sx={{mb: 2}}
                />

                <Box sx={{marginTop: 3}}>
                  <FormGroup>
                    <FormControlLabel control={<Switch defaultChecked={isChecked} onChange={(event) => {setIsChecked(event.currentTarget.checked)}} />} label = {isChecked ? "Ativo" : "Inativo"} />
                  </FormGroup>
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