// IMPORTAÇÃO DOS COMPONENTES REACT
import { useState } from 'react';
import * as React from 'react';

// IMPORTAÇÃO DOS COMPONENTES MATERIALUI
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

// IMPORTAÇÃO DOS COMPONENTES CUSTOMIZADOS
import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';
import { FormValidation } from '../../../../utils/FormValidation';
import AxiosApi from '../../../../services/AxiosApi';
import { DateTimeInput } from '../../date_picker/DateTimeInput';
import { GenericSelect } from '../../input_select/GenericSelect';

// IMPORTAÇÃO DOS ÍCONES DO FONTS AWESOME
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';

import moment from 'moment';

export function UpdateOrderFormulary({...props}){

// ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

    // Utilizador do state global de autenticação
    const {AuthData, setAuthData} = useAuthentication();

    // States do formulário
    const [open, setOpen] = useState(false);

    // States utilizados nas validações dos campos 
    const [errorDetected, setErrorDetected] = useState({order_start_date: false, order_end_date: false, numOS: false, creator_name: false, pilot_name: false, client_name: false, order_note: false, flight_plan: false, status: false}); 
    const [errorMessage, setErrorMessage] = useState({order_start_date: "", order_end_date: "", numOS: "", creator_name: "", pilot_name: "", client_name: "", order_note: "", flight_plan: "", status: ""}); 

    // State da mensagem do alerta
    const [displayAlert, setDisplayAlert] = useState({display: false, type: "", message: ""});

    // State da acessibilidade do botão de executar o registro
    const [disabledButton, setDisabledButton] = useState(false);

    // States dos inputs de data
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

// ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

    // Função para abrir o modal
    const handleClickOpen = () => {
      if(props.selected_record.dom != null){
          setOpen(true);
      }
    };

    // Função para fechar o modal
    const handleClose = () => {

      setErrorDetected({order_start_date: false, order_end_date: false, numOS: false, creator_name: false, pilot_name: false, client_name: false, order_note: false, flight_plan: false, status: false});
      setErrorMessage({order_start_date: false, order_end_date: false, numOS: false, creator_name: false, pilot_name: false, client_name: false, order_note: false, flight_plan: false, status: false});
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

        if(dataValidate(data)){

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
     function dataValidate(formData){

      // Se o atributo "erro" for true, um erro foi detectado, e o atributo "message" terá a mensagem sobre a natureza do erro
      const startDateValidate = startDate != null ? {error: false, message: ""} : {error: true, message: "Selecione a data inicial"};
      const endDateValidate = endDate != null ? {error: false, message: ""} : {error: true, message: "Selecione a data final"};
      const numOsValidate = FormValidation(formData.get("order_numos"), 3, null, null, null);
      const creatorNameValidate = FormValidation(formData.get("creator_name"), 3, null, null, null);
      const pilotNameValidate = FormValidation(formData.get("pilot_name"), 3, null, null, null);
      const clientNameValidate = FormValidation(formData.get("client_name"), 3, null, null, null);
      const orderNoteValidate = FormValidation(formData.get("order_note"), 3, null, null, null);
      const fligthPlanValidate = formData.get("select_flight_plan") != "0" ? {error: false, message: ""} : {error: true, message: ""};
      const statusValidate = (formData.get("status") == 0 || formData.get("status") == 1) ? {error: false, message: ""} : {error: true, message: "O status deve ser 1 ou 0"};

      setErrorDetected({
        order_start_date: startDateValidate.error, 
        order_end_date: endDateValidate.error, 
        numOS: numOsValidate.error, 
        creator_name: creatorNameValidate.error, 
        pilot_name: pilotNameValidate.error, 
        client_name: clientNameValidate.error, 
        order_note: orderNoteValidate.error, 
        flight_plan: fligthPlanValidate.error,
        status: statusValidate.error
      });

      setErrorMessage({
        order_start_date: startDateValidate.message, 
        order_end_date: endDateValidate.message, 
        numOS: numOsValidate.message, 
        creator_name: creatorNameValidate.message, 
        pilot_name: pilotNameValidate.message, 
        client_name: clientNameValidate.message, 
        order_note: orderNoteValidate.message, 
        flight_plan: fligthPlanValidate.message,
        status: statusValidate.message
      });
    
      if(startDateValidate.error || endDateValidate.error || numOsValidate.error || creatorNameValidate.error || pilotNameValidate.error || clientNameValidate.error || orderNoteValidate.error || fligthPlanValidate.error || statusValidate.error){

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

        AxiosApi.patch(`/api/orders-module/${data.get("order_id")}`, {
            auth: `${logged_user_id}.${module_id}.${module_action}`,
            initial_date: moment(startDate).format('YYYY-MM-DD hh:mm:ss'),
            final_date: moment(endDate).format('YYYY-MM-DD hh:mm:ss'),
            numOS: data.get("order_numos"),
            creator_name: data.get("creator_name"),
            pilot_name: data.get("pilot_name"),
            client_name: data.get("client_name"),
            observation: data.get("order_note"),
            status: data.get("status"),
            fligth_plan_id: data.get("select_flight_plan")
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

        setDisabledButton(false);

        handleClose();

      }, 2000);

    }

    /*
    * Rotina 5B
    * Tratamento da resposta de uma requisição falha
    */
    function errorServerResponseTreatment(response_data){

      let error_message = (response_data.message != "" && response_data.message != undefined) ? response_data.message : "Houve um erro na realização da operação!";
      setDisplayAlert({display: true, type: "error", message: error_message});

      // Definição dos objetos de erro possíveis de serem retornados pelo validation do Laravel
      let input_errors = {
        initial_date: {error: false, message: null},
        final_date: {error: false, message: null},
        numOS: {error: false, message: null},
        creator_name: {error: false, message: null},
        pilot_name: {error: false, message: null},
        client_name: {error: false, message: null},
        observation: {error: false, message: null},
        status: {error: false, message: null},
        fligth_plan_id: {error: false, message: null}
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
        numOS: input_errors.numOS.error, 
        creator_name: input_errors.creator_name.error, 
        pilot_name: input_errors.pilot_name.error, 
        client_name: input_errors.client_name.error, 
        order_note: input_errors.observation.error,
        flight_plan: input_errors.fligth_plan_id.error,
        status: input_errors.status.error
      });

      setErrorMessage({
        order_start_date: input_errors.initial_date.message, 
        order_end_date: input_errors.final_date.message, 
        numOS: input_errors.numOS.message, 
        creator_name: input_errors.creator_name.message, 
        pilot_name: input_errors.pilot_name.message, 
        client_name: input_errors.client_name.message, 
        order_note: input_errors.observation.message,
        flight_plan: input_errors.fligth_plan_id.message,
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

        {(props.selected_record.dom != null && open) && 

          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>ATUALIZAÇÃO | ORDEM DE SERVIÇO (ID: {props.selected_record.data_cells.order_id})</DialogTitle>
    
            {/* Formulário da criação/registro do usuário - Componente Box do tipo "form" */}
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
                  defaultValue = {props.selected_record.data_cells.order_id}
                  sx={{mb: 2}}
                />

                <Box sx={{display: "flex", justifyContent: "space-between", mb: 2}}>
                  <DateTimeInput 
                    event = {setStartDate}
                    label = {"Inicio da ordem de serviço"} 
                    helperText = {errorMessage.order_start_date} 
                    error = {errorDetected.order_start_date} 
                    defaultValue = {props.selected_record.data_cells.order_start_date}
                    operation = {"update"}
                    read_only = {false}
                    />
                    <DateTimeInput
                    event = {setEndDate}
                    label = {"Fim da ordem de serviço"} 
                    helperText = {errorMessage.order_start_date} 
                    error = {errorDetected.order_start_date} 
                    defaultValue = {props.selected_record.data_cells.order_end_date}
                    operation = {"update"}
                    read_only = {false}
                  />
                </Box>

                <TextField
                  type = "text"
                  margin="dense"
                  label="numOS"
                  fullWidth
                  variant="outlined"
                  required
                  id="order_numos"
                  name="order_numos"
                  helperText = {errorMessage.numOS}
                  error = {errorDetected.numOS}
                  defaultValue = {props.selected_record.data_cells.numOS}
                  sx={{mb: 2}}
                />

                <TextField
                  type = "text"
                  margin="dense"
                  label="Nome do criador"
                  fullWidth
                  variant="outlined"
                  required
                  id="creator_name"
                  name="creator_name"
                  helperText = {errorMessage.creator_name}
                  error = {errorDetected.creator_name}
                  defaultValue = {props.selected_record.data_cells.creator_name}
                  sx={{mb: 2}}
                />

                <TextField
                  type = "text"
                  margin="dense"
                  label="Nome do piloto"
                  fullWidth
                  variant="outlined"
                  required
                  id="pilot_name"
                  name="pilot_name"
                  helperText = {errorMessage.pilot_name}
                  error = {errorDetected.pilot_name}
                  defaultValue = {props.selected_record.data_cells.pilot_name}
                  sx={{mb: 2}}
                />

                <TextField
                  type = "text"
                  margin="dense"
                  label="Nome do cliente"
                  fullWidth
                  variant="outlined"
                  required
                  id="client_name"
                  name="client_name"
                  helperText = {errorMessage.client_name}
                  error = {errorDetected.client_name}
                  defaultValue = {props.selected_record.data_cells.client_name}
                  sx={{mb: 2}}
                />

                <Box sx={{mb: 2}}>
                  <GenericSelect 
                    label_text = {"Plano de vôo vinculado"} 
                    data_source = {"/api/orders-module/create?data_source=flight_plans&auth=none"} 
                    primary_key={"id"} 
                    key_content={"id"} 
                    error = {errorDetected.flight_plan} 
                    default = {props.selected_record.data_cells.flight_plan_id != null ? props.selected_record.data_cells.flight_plan_id : 0}
                    name = {"select_flight_plan"}  
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
                  defaultValue = {props.selected_record.data_cells.order_note}
                  sx={{mb: 2}}
                />

                <TextField
                  margin="dense"
                  id="status"
                  name="status"
                  label="Status"
                  type="number"
                  fullWidth
                  variant="outlined"
                  defaultValue={props.selected_record.data_cells.order_status}
                  error = {errorDetected.status}
                  helperText = {errorMessage.status}
                  InputProps={{
                      inputProps: { min: 0, max: 1 },
                  }}
                />
    
              </DialogContent>
    
              {displayAlert.display && 
                  <Alert severity={displayAlert.type} variant="filled">{displayAlert.message}</Alert> 
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

    
}