// IMPORTAÇÃO DOS COMPONENTES REACT
import { useState, useEffect } from 'react';
import * as React from 'react';

// IMPORTAÇÃO DOS COMPONENTES MATERIALUI
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

// IMPORTAÇÃO DOS COMPONENTES CUSTOMIZADOS
import AxiosApi from '../../../../services/AxiosApi';
import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';
import { FormValidation } from '../../../../utils/FormValidation';
import { GenericSelect } from '../../input_select/GenericSelect';
import { DateTimeInput } from '../../date_picker/DateTimeInput';

// IMPORTAÇÃO DOS ÍCONES DO FONTS AWESOME
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';

// IMPORTAÇÃO DE BIBLIOTECAS EXTERNAS
import moment from 'moment';

export const CreateOrderFormulary = React.memo(({...props}) => {

  // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

    // Utilizador do state global de autenticação
    const {AuthData, setAuthData} = useAuthentication();

    // States utilizados nas validações dos campos 
    const [errorDetected, setErrorDetected] = useState({order_start_date: false, order_end_date: false, numOS: false, pilot_name: false, client_name: false, order_note: false, flight_plan: false, status: false}); 
    const [errorMessage, setErrorMessage] = useState({order_start_date: "", order_end_date: "", numOS: "", pilot_name: "", client_name: "", order_note: "", flight_plan: "", status: ""}); 

    // State da mensagem do alerta
    const [displayAlert, setDisplayAlert] = useState({display: false, type: "", message: ""});

    // State da acessibilidade do botão de executar o registro
    const [disabledButton, setDisabledButton] = useState(false);

    // States do formulário
    const [open, setOpen] = React.useState(false);

    // States dos inputs de data
    const [startDate, setStartDate] = useState(moment());
    const [endDate, setEndDate] = useState(moment());

  // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

    // Função para abrir o modal
    const handleClickOpen = () => {
        setOpen(true);
    };

    // Função para fechar o modal
    const handleClose = () => {

        setErrorDetected({order_start_date: false, order_end_date: false, numOS: false, pilot_name: false, client_name: false, order_note: false, flight_plan: false, status: false});
        setErrorMessage({order_start_date: "", order_end_date: "", numOS: "", pilot_name: "", client_name: "", order_note: "", flight_plan: "", status: ""});
        setDisplayAlert({display: false, type: "", message: ""});
        setDisabledButton(false);

        setOpen(false);

    };

    /*
    * Rotina 1
    * Ponto inicial do processamento do envio do formulário de registro
    * Recebe os dados do formulário, e transforma em um objeto da classe FormData
    */ 
    function handleRegistrationSubmit(event){
      event.preventDefault();

      const data = new FormData(event.currentTarget);

        if(dataValidate(data)){

          if(verifyDateInterval()){

            setDisabledButton(true);

            requestServerOperation(data);

          }else{
            
            setDisplayAlert({display: true, type: "error", message: "Erro! A data inicial deve anteceder a final."});

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
      const pilotNameValidate = FormValidation(formData.get("select_pilot_name"), 3, null, null, null);
      const clientNameValidate = FormValidation(formData.get("select_client_name"), 3, null, null, null);
      const orderNoteValidate = FormValidation(formData.get("order_note"), 3, null, null, null);
      const fligthPlanValidate = formData.get("select_flight_plan") != "0" ? {error: false, message: ""} : {error: true, message: ""};
      const statusValidate = (formData.get("status") == 0 || formData.get("status") == 1) ? {error: false, message: ""} : {error: true, message: "O status deve ser 1 ou 0"};

      setErrorDetected({
        order_start_date: startDateValidate.error, 
        order_end_date: endDateValidate.error, 
        numOS: numOsValidate.error, 
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
        pilot_name: pilotNameValidate.message, 
        client_name: clientNameValidate.message, 
        order_note: orderNoteValidate.message, 
        flight_plan: fligthPlanValidate.message,
        status: statusValidate.message
      });
    
      if(startDateValidate.error || endDateValidate.error || numOsValidate.error || pilotNameValidate.error || clientNameValidate.error || orderNoteValidate.error || fligthPlanValidate.error || statusValidate.error){

        return false;

      }else{

          return true;

      }

  }

    /*
    * Rotina 3
    * As datas retornadas do componente DateTimePicker do Material UI são formatadas
    * A formatação ocorre com a biblioteca Moment.js - https://momentjs.com/
    * Também ocorre a verificação da diferença entre as datas
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
    * Comunicação AJAX com o Laravel utilizando AXIOS
    * Após o recebimento da resposta, é chamada próxima rotina, 4, de tratamento da resposta do servidor
    */
    function requestServerOperation(data){

      // Dados para o middleware de autenticação 
      let logged_user_id = AuthData.data.id;
      let module_id = 3;
      let module_action = "escrever";

      AxiosApi.post(`/api/orders-module`, {
        auth: `${logged_user_id}.${module_id}.${module_action}`,
        initial_date: moment(startDate).format('YYYY-MM-DD hh:mm:ss'),
        final_date: moment(endDate).format('YYYY-MM-DD hh:mm:ss'),
        numOS: data.get("order_numos"),
        creator_name: AuthData.data.name,
        pilot_name: data.get("select_pilot_name"),
        client_name: data.get("select_client_name"),
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

      setDisabledButton(false);

      let error_message = (response_data.message != "" && response_data.message != undefined) ? response_data.message : "Houve um erro na realização da operação!";
      setDisplayAlert({display: true, type: "error", message: error_message});

      // Definição dos objetos de erro possíveis de serem retornados pelo validation do Laravel
      let input_errors = {
        initial_date: {error: false, message: null},
        final_date: {error: false, message: null},
        numOS: {error: false, message: null},
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
        pilot_name: input_errors.pilot_name.message, 
        client_name: input_errors.client_name.message, 
        order_note: input_errors.observation.message,
        flight_plan: input_errors.fligth_plan_id.message,
        status: input_errors.status.message
      });

    }

// ============================================================================== ESTRUTURAÇÃO DA PÁGINA ============================================================================== //

    return (
        <>
          <Tooltip title="Nova ordem de serviço">
            <IconButton onClick={handleClickOpen} disabled={AuthData.data.user_powers["3"].profile_powers.escrever == 1 ? false : true}>
              <FontAwesomeIcon icon={faSquarePlus} color={AuthData.data.user_powers["3"].profile_powers.escrever == 1 ? "#00713A" : "#808991"} size = "sm"/>
            </IconButton>
          </Tooltip>

          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>CADASTRO DE ORDEM DE SERVIÇO</DialogTitle>
    
            {/* Formulário da criação/registro do usuário - Componente Box do tipo "form" */}
            <Box component="form" noValidate onSubmit={handleRegistrationSubmit} >
    
              <DialogContent>
            
                <DialogContentText sx={{mb: 3}}>
                  Formulário para criação de uma ordem de serviço.
                </DialogContentText>

                <Box sx={{display: "flex", justifyContent: "space-between", mb: 2}}>
                  <DateTimeInput 
                    event = {setStartDate}
                    label = {"Inicio da ordem de serviço"} 
                    helperText = {errorMessage.flight_start_date} 
                    error = {errorDetected.flight_start_date} 
                    defaultValue = {moment()}
                    operation = {"create"}
                    read_only = {false}
                    />
                    <DateTimeInput
                    event = {setEndDate}
                    label = {"Fim da ordem de serviço"} 
                    helperText = {errorMessage.flight_end_date} 
                    error = {errorDetected.flight_end_date} 
                    defaultValue = {moment()}
                    operation = {"create"}
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
                  sx={{mb: 2}}
                />

                <Box sx={{mb: 2}}>
                  <GenericSelect 
                    label_text = "Nome do piloto"
                    data_source = {"/api/orders-module/create?table=users&content=pilots_name&auth=none"} 
                    primary_key={"nome"} 
                    key_content={"nome"} 
                    helperText = {errorMessage.pilot_name}
                    error = {errorDetected.pilot_name} 
                    default = {0} 
                    name = {"select_pilot_name"}  
                  />
                </Box>

                <Box sx={{mb: 2}}>
                  <GenericSelect 
                    label_text = "Nome do cliente"
                    data_source = {"/api/orders-module/create?table=users&content=clients_name&auth=none"} 
                    primary_key={"nome"} 
                    key_content={"nome"} 
                    helperText = {errorMessage.client_name}
                    error = {errorDetected.client_name} 
                    default = {0} 
                    name = {"select_client_name"}  
                  />
                </Box>

                <Box sx={{mb: 2}}>
                  <GenericSelect 
                    label_text = {"Plano de vôo vinculado"} 
                    data_source = {"/api/orders-module/create?table=flight_plans&auth=none"} 
                    primary_key={"id"} 
                    key_content={"arquivo"} 
                    error = {errorDetected.flight_plan} 
                    default = {0} 
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
                  defaultValue={0}
                  error = {errorDetected.status}
                  helperText = {errorMessage.status}
                  InputProps={{
                      inputProps: { min: 0, max: 1 }
                  }}
                />
                  
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