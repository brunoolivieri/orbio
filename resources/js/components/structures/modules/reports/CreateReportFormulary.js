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
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { DateTimeInput } from '../../date_picker/DateTimeInput';
import { styled } from '@mui/material/styles';

// IMPORTAÇÃO DOS COMPONENTES CUSTOMIZADOS
import AxiosApi from '../../../../services/AxiosApi';
import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';
import { FormValidation } from '../../../../utils/FormValidation';

// IMPORTAÇÃO DOS ÍCONES DO FONTS AWESOME
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';

// IMPORTAÇÃO DE BIBLIOTECAS EXTERNAS
import moment from 'moment';

const Input = styled('input')({
  display: 'none',
});

export const CreateReportFormulary = React.memo(({...props}) => {

    // Utilizador do state global de autenticação
    const {AuthData} = useAuthentication();

    // States utilizados nas validações dos campos 
    const [errorDetected, setErrorDetected] = useState({flight_start_date: false, flight_end_date: false, flight_log: false, report_note: false}); // State para o efeito de erro - true ou false
    const [errorMessage, setErrorMessage] = useState({flight_start_date: "", flight_end_date: "", flight_log: "", report_note: ""}); // State para a mensagem do erro - objeto com mensagens para cada campo

    // State da mensagem do alerta
    const [displayAlert, setDisplayAlert] = useState({display: false, type: "", message: ""});

    // State da acessibilidade do botão de executar o registro
    const [disabledButton, setDisabledButton] = useState(false);

    // States do formulário
    const [open, setOpen] = React.useState(false);

    // States dos inputs de data
    const [startDate, setStartDate] = useState(moment());
    const [endDate, setEndDate] = useState(moment());

    // Função para abrir o modal
    const handleClickOpen = () => {
        setOpen(true);
    };

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

      const logPattern = "";

      // Se o atributo "erro" for true, um erro foi detectado, e o atributo "message" terá a mensagem sobre a natureza do erro
      const startDateValidate = startDate != null ? {error: false, message: ""} : {error: true, message: "Selecione a data inicial"};
      const endDateValidate = endDate != null ? {error: false, message: ""} : {error: true, message: "Selecione a data final"};
      const noteValidate = FormValidation(formData.get("report_note"), 3, null, null, null);

      // Atualização dos estados responsáveis por manipular os inputs
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
    function requestServerOperation(data, formated_dates){

      // Dados para o middleware de autenticação 
      let logged_user_id = AuthData.data.id;
      let module_id = 4;
      let module_action = "escrever";

      AxiosApi.post(`/api/reports-module?`, {
        auth: `${logged_user_id}.${module_id}.${module_action}`,
        flight_initial_date: moment(startDate).format('YYYY-MM-DD hh:mm:ss'),
        flight_final_date: moment(endDate).format('YYYY-MM-DD hh:mm:ss'),
        flight_log_file: data.get("flight_log_file"),
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

  return (
    <>

      {/* Botão para abrir o formulário */}
      <Tooltip title="Novo relatório">
        <IconButton onClick={handleClickOpen} disabled={AuthData.data.user_powers["4"].profile_powers.escrever == 1 ? false : true}>
          <FontAwesomeIcon icon={faSquarePlus} color={AuthData.data.user_powers["4"].profile_powers.ler == 1 ? "#00713A" : "#808991"} size = "sm" />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>CADASTRO DE RELATÓRIO</DialogTitle>

        {/* Formulário da criação/registro do usuário - Componente Box do tipo "form" */}
        <Box component="form" noValidate onSubmit={handleRegistrationSubmit} >

          <DialogContent>
        
            <DialogContentText sx={{mb: 3}}>
              Os dados de um registro de relatório são utilizados para a geração de documentos de relatório.
            </DialogContentText>

            <Box sx={{mb: 2}}>
              <label htmlFor="contained-button-file">
                <Input accept="image/*" id="contained-button-file" multiple type="file" name = "flight_log_file" />
                <Button variant="contained" component="span" color={errorDetected.flight_log ? "error" : "primary"}>
                  {errorDetected.flight_log ? errorMessage.flight_log : "Upload do Log"}
                </Button>
              </label>
            </Box>

            <Box sx={{display: "flex", justifyContent: "space-between"}}>
              <DateTimeInput 
                event = {setStartDate}
                label = {"Inicio do vôo"} 
                helperText = {errorMessage.flight_start_date} 
                error = {errorDetected.flight_start_date} 
                defaultValue = {moment()}
                operation = {"create"}
                />
                <DateTimeInput
                event = {setEndDate}
                name = {"report_end_flight"} 
                label = {"Fim do vôo"} 
                helperText = {errorMessage.flight_end_date} 
                error = {errorDetected.flight_end_date} 
                defaultValue = {moment()}
                operation = {"create"}
              />
            </Box>

            <TextField
              type = "text"
              margin="dense"
              label="Observação"
              fullWidth
              variant="outlined"
              required
              id="report_note"
              name="report_note"
              helperText = {errorMessage.report_note}
              error = {errorDetected.report_note}
            />
              
          </DialogContent>

          {displayAlert.display && 
              <Alert severity={displayAlert.type}>{displayAlert.message}</Alert> 
          }

          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={disabledButton} variant="contained">Criar relatório</Button>
          </DialogActions>

        </Box>
      
      </Dialog>
    </>
  );
});
