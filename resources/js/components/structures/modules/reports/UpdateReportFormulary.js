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

// IMPORTAÇÃO DOS ÍCONES DO FONTS AWESOME
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';

// OUTRAS LIBS
import moment from 'moment';

// IMPORTAÇÃO DOS COMPONENTES CUSTOMIZADOS
import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';
import { FormValidation } from '../../../../utils/FormValidation';
import AxiosApi from '../../../../services/AxiosApi';
import { DateTimeInput } from '../../date_picker/DateTimeInput';

export const UpdateReportFormulary = React.memo(({...props}) => {

// ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

    // Utilizador do state global de autenticação
    const {AuthData} = useAuthentication();

    // States do formulário
    const [open, setOpen] = useState(false);

    // States utilizados nas validações dos campos 
    const [errorDetected, setErrorDetected] = useState({flight_start_date: false, flight_end_date: false, flight_log: false, report_note: false}); // State para o efeito de erro - true ou false
    const [errorMessage, setErrorMessage] = useState({flight_start_date: "", flight_end_date: "", flight_log: "", report_note: ""}); // State para a mensagem do erro - objeto com mensagens para cada campo

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
    }

    // Função para fechar o modal
    const handleClose = () => {

      setErrorDetected({flight_start_date: false, flight_end_date: false, flight_log: false, report_note: false});
      setErrorMessage({flight_start_date: "", flight_end_date: "", flight_log: "", report_note: ""});
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

        // Instância da classe JS FormData - para trabalhar os dados do formulário
        const data = new FormData(event.currentTarget);

        // Validação dos dados do formulário
        // A comunicação com o backend só é realizada se o retorno for true
        if(dataValidate(data)){

          if(verifyDateInterval()){

            // Botão é desabilitado
            setDisabledButton(true);

            // Inicialização da requisição para o servidor
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

      const logPattern = "";

      // Se o atributo "erro" for true, um erro foi detectado, e o atributo "message" terá a mensagem sobre a natureza do erro
      const startDateValidate = startDate != null ? {error: false, message: ""} : {error: true, message: "Selecione a data inicial"};
      const endDateValidate = endDate != null ? {error: false, message: ""} : {error: true, message: "Selecione a data final"};
      const noteValidate = FormValidation(formData.get("report_note"), 3, null, null, null);

      setErrorDetected({flight_start_date: startDateValidate.error, flight_end_date: endDateValidate.error, flight_log: false, report_note: noteValidate.error});
      setErrorMessage({flight_start_date: startDateValidate.message, flight_end_date: endDateValidate.message, flight_log: "", report_note: noteValidate.message});
      
      if(startDateValidate.error || endDateValidate.error || noteValidate.error){

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
        let module_id = 4;
        let module_action = "escrever";

        AxiosApi.patch(`/api/reports-module/${data.get("id_input")}`, {
          auth: `${logged_user_id}.${module_id}.${module_action}`,
          flight_initial_date: moment(startDate).format('YYYY-MM-DD hh:mm:ss'),
          flight_final_date: moment(endDate).format('YYYY-MM-DD hh:mm:ss'),
          flight_log_file: data.get("flight_log"),
          observation: data.get("report_note")
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
        flight_initial_date: {error: false, message: null},
        flight_final_date: {error: false, message: null},
        flight_log_file: {error: false, message: null},
        observation: {error: false, message: null},
      }

      // Coleta dos objetos de erro existentes na response
      for(let prop in response_data.errors){

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
          <IconButton disabled={AuthData.data.user_powers["4"].profile_powers.escrever == 1 ? false : true} onClick={handleClickOpen}>
              <FontAwesomeIcon icon={faPenToSquare} color={AuthData.data.user_powers["4"].profile_powers.escrever == 1 ? "#007937" : "#808991"} size = "sm"/>
          </IconButton>
        </Tooltip>

        {(props.selected_record.dom != null && open) &&

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>ATUALIZAÇÃO | RELATÓRIO (ID: {props.selected_record.data_cells.report_id})</DialogTitle>

        {/* Formulário da criação/registro do usuário - Componente Box do tipo "form" */}
        <Box component="form" noValidate onSubmit={handleSubmitOperation} >

          <DialogContent>
            
            <TextField
              margin="dense"
              id="id_input"
              name="id_input"
              label="ID"
              type="text"
              fullWidth
              variant="outlined"
              defaultValue={props.selected_record.data_cells.report_id}
              InputProps={{
                  readOnly: true,
              }}
              sx={{mb: 3}}
            />
            
            <Box sx={{display: "flex", justifyContent: "space-between", mb: 2}}>
              <DateTimeInput 
                event = {setStartDate}
                label = {"Inicio do vôo"} 
                helperText = {errorMessage.flight_start_date} 
                error = {errorDetected.flight_start_date} 
                defaultValue = {props.selected_record.data_cells.flight_start_date}
                operation = {"update"}
                read_only = {false}
                />
                <DateTimeInput
                event = {setEndDate}
                label = {"Fim do vôo"} 
                helperText = {errorMessage.flight_end_date} 
                error = {errorDetected.flight_end_date} 
                defaultValue = {props.selected_record.data_cells.flight_end_date}
                operation = {"update"}
                read_only = {false}
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
              helperText = {errorMessage.flight_log}
              error = {errorDetected.flight_log}
              sx={{mb: 2}}
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
              helperText = {errorMessage.report_note}
              error = {errorDetected.report_note}
            />

          </DialogContent>

          {displayAlert.display && 
              <Alert severity={displayAlert.type} variant="filled">{displayAlert.message}</Alert> 
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