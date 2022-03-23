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
import Box from '@mui/material/Box';
import { Alert } from '@mui/material';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

// IMPORTAÇÃO DOS COMPONENTES CUSTOMIZADOS
import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';
import { FormValidation } from '../../../../utils/FormValidation';
import AxiosApi from '../../../../services/AxiosApi';
import { DateTimeInput } from '../../date_picker/DateTimeInput';

import moment from 'moment';

export function UpdateDeleteOrderFormulary({data, operation, refresh_setter}){

    // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

    // Utilizador do state global de autenticação
    const {AuthData, setAuthData} = useAuthentication();

    // States do formulário
    const [open, setOpen] = useState(false);

    // State da operação a ser realizada
    const [formOperation, setOperation] = useState(operation);

    // States utilizados nas validações dos campos 
    const [errorDetected, setErrorDetected] = useState({order_start_date: false, order_end_date: false, numOS: false, creator_name: false, pilot_name: false, client_name: false, order_note: false}); 
    const [errorMessage, setErrorMessage] = useState({order_start_date: "", order_end_date: "", numOS: "", creator_name: "", pilot_name: "", client_name: "", order_note: ""}); 

    // State da mensagem do alerta
    const [displayAlert, setDisplayAlert] = useState({display: false, type: "", message: ""});

    // State da acessibilidade do botão de executar o registro
    const [disabledButton, setDisabledButton] = useState(false);

    // States dos inputs de data
    const [startDate, setStartDate] = useState(data.flight_start_date);
    const [endDate, setEndDate] = useState(data.flight_end_date);

     // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

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
    * Captura do envio do formulário
    * 
    */ 
    const handleSubmitOperation = (event) => {
      event.preventDefault();

      // Instância da classe JS FormData - para trabalhar os dados do formulário
      const data = new FormData(event.currentTarget);

      if(operation === "update"){

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

      }else if(operation === "delete"){

          setDisabledButton(true);

         // Inicialização da requisição para o servidor
         requestServerOperation(data, operation);

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

      if(operation === "update"){

        AxiosApi.patch(`/api/orders-module/update`, {
          auth: `${logged_user_id}.${module_id}.${module_action}`,
          order_start: moment(startDate).format('YYYY-MM-DD hh:mm:ss'),
          order_end: moment(endDate).format('YYYY-MM-DD hh:mm:ss'),
          order_numos: data.get("order_numos"),
          creator_name: data.get("creator_name"),
          pilot_name: data.get("pilot_name"),
          client_name: data.get("client_name"),
          order_note: data.get("order_note"),
          order_status: data.get("status"),
          flight_plan: data.get("flight_plan")
        })
        .then(function (response) {
  
            serverResponseTreatment(response);
  
        })
        .catch(function (error) {
          
          serverResponseTreatment(error.response);
  
        });

      }else if(operation === "delete"){

        AxiosApi.delete(`/api/orders-module/${data.get("id_input")}?auth=${logged_user_id}.${module_id}.${module_action}`)
        .then(function (response) {
  
            serverResponseTreatment(response);
  
        })
        .catch(function (error) {
          
          serverResponseTreatment(error.response);
  
        });

      }

    }

     /*
    * Rotina 5
    * Tratamento da resposta da requisição AXIOS
    * Possui dois casos: o Update e o Delete
    * 
    */
    function serverResponseTreatment(response){

      if(response.status === 200){

        if(operation === "update"){

          refresh_setter(true);

          setDisplayAlert({display: true, type: "success", message: "Atualização realizada com sucesso!"});

        }else{

          refresh_setter(true);

          setDisplayAlert({display: true, type: "success", message: "Deleção realizada com sucesso!"});

        }

        setTimeout(() => {

          setDisabledButton(false);

          handleClose();

        }, 2000);

      }else{

        setDisabledButton(false);

        setDisplayAlert({display: true, type: "error", message: "Erro! Tente novamente."});

      }

    }

    // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

    // Se o perfil do usuário logado não tiver o poder de LER quanto ao módulo de "Administração", os botão serão desabilitados - porque o usuário não terá permissão para isso 
    // Ou, se o registro atual, da tabela, tiver um número de acesso menor (quanto menor, maior o poder) ou igual ao do usuário logado, os botão serão desabilitados - Super Admin não edita Super Admin, Admin não edita Admin, etc 
    const deleteButton = <IconButton 
    disabled={AuthData.data.user_powers["3"].profile_powers.escrever == 1 ? (data.access <= AuthData.data.general_access ? true : false) : true} 
    value = {data.id} onClick={handleClickOpen}
    ><DeleteIcon 
    style={{ fill: AuthData.data.user_powers["3"].profile_powers.escrever == 1 ? (data.access <= AuthData.data.general_access ? "#808991" : "#D4353B") : "#808991"}} 
    /></IconButton>

    const updateButton = <IconButton 
    disabled={AuthData.data.user_powers["3"].profile_powers.escrever == 1 ? false : true} 
    value = {data.id} onClick={handleClickOpen}
    ><EditIcon 
    style={{ fill: AuthData.data.user_powers["3"].profile_powers.escrever == 1 ? (data.access <= AuthData.data.general_access ? "#808991" : "#009BE5") : "#808991"}} 
    /></IconButton>

    return (
        <>
    
          {/* Botão que abre o Modal - pode ser o de atualização ou de deleção, depende da operação */}
          {operation === "update" ? updateButton : deleteButton}
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{operation === "update" ? "ATUALIZAÇÃO" : "DELEÇÃO"} | ORDEM DE SERVIÇO (ID: {data.order_id})</DialogTitle>
    
            {/* Formulário da criação/registro do usuário - Componente Box do tipo "form" */}
            <Box component="form" noValidate onSubmit={handleSubmitOperation} >
    
              <DialogContent>

                <Box sx={{display: "flex", justifyContent: "space-between"}}>
                  <DateTimeInput 
                    event = {setStartDate}
                    label = {"Inicio da ordem de serviço"} 
                    helperText = {errorMessage.order_start_date} 
                    error = {errorDetected.order_start_date} 
                    defaultValue = {data.order_start_date}
                    operation = {operation}
                    />
                    <DateTimeInput
                    event = {setEndDate}
                    label = {"Fim da ordem de serviço"} 
                    helperText = {errorMessage.order_start_date} 
                    error = {errorDetected.order_start_date} 
                    defaultValue = {data.order_end_date}
                    operation = {operation}
                  />
                </Box>

                <TextField
                  type = "text"
                  margin="dense"
                  label="ID da ordem de serviço"
                  fullWidth
                  variant="outlined"
                  required
                  id="order_id"
                  name="order_id"
                  defaultValue = {data.order_id}
                  InputProps={{
                    readOnly: true 
                  }}
                />

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
                  defaultValue = {data.numOS}
                  InputProps={{
                    readOnly: operation == "delete" ? true : false
                  }}
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
                  defaultValue = {data.creator_name}
                  InputProps={{
                    readOnly: operation == "delete" ? true : false
                  }}
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
                  defaultValue = {data.pilot_name}
                  InputProps={{
                    readOnly: operation == "delete" ? true : false
                  }}
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
                  defaultValue = {data.client_name}
                  InputProps={{
                    readOnly: operation == "delete" ? true : false
                  }}
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
                  defaultValue = {data.flight_plan_id}
                  InputProps={{
                    readOnly: operation == "delete" ? true : false
                  }}
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
                  defaultValue = {data.order_note}
                  InputProps={{
                    readOnly: operation == "delete" ? true : false
                  }}
                />

                <TextField
                  margin="dense"
                  id="status"
                  name="status"
                  label="Status"
                  type="number"
                  fullWidth
                  variant="outlined"
                  defaultValue={data.order_status}
                  InputProps={{
                      inputProps: { min: 0, max: 1 },
                      readOnly: operation == "delete" ? true : false
                  }}
                />
    
              </DialogContent>
    
              {displayAlert.display && 
                  <Alert severity={displayAlert.type}>{displayAlert.message}</Alert> 
              }
              
              <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button type="submit" disabled={disabledButton}>Confirmar {operation === "update" ? "atualização" : "deleção"}</Button>
              </DialogActions>
    
            </Box>
    
            
          </Dialog>
        </>
    
      );

    
}