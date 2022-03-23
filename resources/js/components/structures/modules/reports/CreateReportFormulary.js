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
import { Input, Tooltip } from '@mui/material';
import { IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import { Alert } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { DateTimeInput } from '../../date_picker/DateTimeInput';

// IMPORTAÇÃO DOS COMPONENTES CUSTOMIZADOS
import AxiosApi from '../../../../services/AxiosApi';
import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';
import { FormValidation } from '../../../../utils/FormValidation';

// IMPORTAÇÃO DE BIBLIOTECAS EXTERNAS
import moment from 'moment';

/*

- Esse modal é utilizado para construir formulários para a página de administração
- Ele recebe os dados e o tipo de operação, e é construído de acordo com esses dados
- Por enquanto é utilizado apenas para a operação de DELETE e UPDATE de usuários

*/

export const CreateReportFormulary = React.memo(({...props}) => {

    // Utilizador do state global de autenticação
    const {AuthData, setAuthData} = useAuthentication();

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
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();

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

      let randomLogTest = "[Log_"+ (Math.floor(Math.random() * 100000000) + 99999999) + "_]";

      AxiosApi.post(`/api/reports-module?`, {
        auth: `${logged_user_id}.${module_id}.${module_action}`,
        flight_start: moment(startDate).format('YYYY-MM-DD hh:mm:ss'),
        flight_end: moment(endDate).format('YYYY-MM-DD hh:mm:ss'),
        flight_log: randomLogTest,
        report_note: data.get("report_note")
      })
      .then(function (response) {

          serverResponseTreatment(response);

      })
      .catch(function (error) {
        
        serverResponseTreatment(error.response);

      });

    }

    /*
    * Rotina 5
    * Tratamento da resposta do servidor
    * Se for um sucesso, aparece, mo modal, um alerta com a mensagem de sucesso, e o novo registro na tabela de usuários
    */
    function serverResponseTreatment(response){

     if(response.status === 200){

        setDisplayAlert({display: true, type: "success", message: "Cadastro realizado com sucesso!"});

        setTimeout(() => {
          
          setDisabledButton(false);
          
          handleClose();

        }, 2000);

      }else{

        setDisplayAlert({display: true, type: "error", message: "Erro! Tente novamente."});

        setDisabledButton(false);

      }

    }

  return (
    <>
      {/* Botão para abrir o formulário */}
      <Tooltip title="Novo Relatório">
        <IconButton onClick={handleClickOpen} disabled={AuthData.data.user_powers["1"].profile_powers.escrever == 1 ? false : true}>
          <AddCircleIcon />
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


            <Box sx={{display: "flex", justifyContent: "space-between"}}>
              <DateTimeInput 
                event = {setStartDate}
                label = {"Inicio do vôo"} 
                helperText = {errorMessage.flight_start_date} 
                error = {errorDetected.flight_start_date} 
                defaultValue = {null}
                operation = {"create"}
                />
                <DateTimeInput
                event = {setEndDate}
                name = {"report_end_flight"} 
                label = {"Fim do vôo"} 
                helperText = {errorMessage.flight_end_date} 
                error = {errorDetected.flight_end_date} 
                defaultValue = {null}
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

            <Box sx={{ display: 'flex', justifyContent: "flex-start", mt: 1 }}>
              <label htmlFor="contained-button-file">
                <Input accept="image/*" id="contained-button-file" multiple type="file" sx={{display: "none"}} name= {"report_log_flight"} />
                <Button variant="contained" component="span">
                  Upload
                </Button>
              </label>
            </Box>
              
            {/* FUTURO: INPUT DO TIPO DE RELATÓRIO - IRÁ DEFINIR O TIPO DO DOCUMENTO */}
              
          </DialogContent>

          {displayAlert.display && 
              <Alert severity={displayAlert.type}>{displayAlert.message}</Alert> 
          }

          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={disabledButton}>Criar relatório</Button>
          </DialogActions>

        </Box>
      
      </Dialog>
    </>
  );
});
