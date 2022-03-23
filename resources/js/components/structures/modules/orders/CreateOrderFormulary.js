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

export function CreateOrderFormulary({...props}){

    // Utilizador do state global de autenticação
    const {AuthData, setAuthData} = useAuthentication();

    // States utilizados nas validações dos campos 
    const [errorDetected, setErrorDetected] = useState({order_start_date: false, order_end_date: false, numOS: false, creator_name: false, pilot_name: false, client_name: false, order_note: false}); 
    const [errorMessage, setErrorMessage] = useState({order_start_date: "", order_end_date: "", numOS: "", creator_name: "", pilot_name: "", client_name: "", order_note: ""}); 

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

        setErrorDetected({order_start_date: false, order_end_date: false, numOS: false, creator_name: false, pilot_name: false, client_name: false, order_note: false});
        setErrorMessage({order_start_date: "", order_end_date: "", numOS: "", creator_name: "", pilot_name: "", client_name: "", order_note: ""});
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
      const creatorNameValidate = FormValidation(formData.get("creator_name"), 3, null, null, null);
      const pilotNameValidate = FormValidation(formData.get("pilot_name"), 3, null, null, null);
      const clientNameValidate = FormValidation(formData.get("client_name"), 3, null, null, null);
      const orderNoteValidate = FormValidation(formData.get("order_note"), 3, null, null, null);

      // Atualização dos estados responsáveis por manipular os inputs
      setErrorDetected({order_start_date: startDateValidate.error, order_end_date: endDateValidate.error, numOS: numOsValidate.error, creator_name: creatorNameValidate.error, pilot_name: pilotNameValidate.error, client_name: clientNameValidate.error, order_note: orderNoteValidate.error});
      setErrorMessage({order_start_date: startDateValidate.message, order_end_date: endDateValidate.message, numOS: numOsValidate.message, creator_name: creatorNameValidate.message, pilot_name: pilotNameValidate.message, client_name: clientNameValidate.message, order_note: orderNoteValidate.message});
    
      if(startDateValidate.error || endDateValidate.error || numOsValidate.error || creatorNameValidate.error || pilotNameValidate.error || clientNameValidate.error || orderNoteValidate.error){

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
          <Tooltip title="Nova Ordem">
            <IconButton onClick={handleClickOpen} disabled={AuthData.data.user_powers["2"].profile_powers.escrever == 1 ? false : true}>
              <AddCircleIcon />
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

                <Box sx={{display: "flex", justifyContent: "space-between"}}>
                  <DateTimeInput 
                    event = {setStartDate}
                    label = {"Inicio da ordem de serviço"} 
                    helperText = {errorMessage.flight_start_date} 
                    error = {errorDetected.flight_start_date} 
                    defaultValue = {null}
                    operation = {"create"}
                    />
                    <DateTimeInput
                    event = {setEndDate}
                    label = {"Fim da ordem de serviço"} 
                    helperText = {errorMessage.flight_end_date} 
                    error = {errorDetected.flight_end_date} 
                    defaultValue = {null}
                    operation = {"create"}
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
                />

                <TextField
                  type = "text"
                  margin="dense"
                  label="Plano de vôo vinculado"
                  fullWidth
                  variant="outlined"
                  required
                  id="flight_plan"
                  name="flight_plan"
                  helperText = {errorMessage.flight_id}
                  error = {errorDetected.flight_id}
                />

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
                <Button type="submit" disabled={disabledButton}>Criar relatório</Button>
              </DialogActions>
    
            </Box>
          
          </Dialog>
        </>
    );

}