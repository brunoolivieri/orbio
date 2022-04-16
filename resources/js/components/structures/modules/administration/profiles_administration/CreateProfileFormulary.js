// IMPORTAÇÃO DOS COMPONENTES REACT
import { useState } from 'react';
import React from 'react';

// IMPORTAÇÃO DOS COMPONENTES CUSTOMIZADOS
import { useAuthentication } from '../../../../context/InternalRoutesAuth/AuthenticationContext';
import AxiosApi from '../../../../../services/AxiosApi';
import { FormValidation } from '../../../../../utils/FormValidation';

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
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Box from '@mui/material/Box';
import { Alert } from '@mui/material';

// IMPORTAÇÃO DOS ÍCONES DO FONTS AWESOME
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';

export function CreateProfileFormulary() {

// ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

    // Utilizador do state global de autenticação
    const {AuthData, setAuthData} = useAuthentication();

    // States do formulário
    const [open, setOpen] = React.useState(false);

    // States utilizados nas validações dos campos 
    const [errorDetected, setErrorDetected] = useState({name: false}); // State para o efeito de erro - true ou false
    const [errorMessage, setErrorMessage] = useState({name: null}); // State para a mensagem do erro - objeto com mensagens para cada campo

    // State da mensagem do alerta
    const [displayAlert, setDisplayAlert] = useState({display: false, type: "", message: ""});

    // State da acessibilidade do botão de executar o registro
    const [disabledButton, setDisabledButton] = useState(false);

// ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

    // Função para abrir o modal
    const handleClickOpen = () => {
        setOpen(true);
    };

    // Função para fechar o modal
    const handleClose = () => {
        
      setErrorDetected({name: false});
      setErrorMessage({name: null});
      setDisplayAlert({display: false, type: "", message: ""});
      setDisabledButton(false);

      setOpen(false);

    };

    /*
    * Rotina 1
    * Ponto inicial do processamento do envio do formulário de registro
    */ 
    const handleRegistrationProfile = (event) => {
      event.preventDefault();

      // Instância da classe JS FormData - para trabalhar os dados do formulário
      const data = new FormData(event.currentTarget);

        // Validação dos dados do formulário
        // A comunicação com o backend só é realizada se o retorno for true
        if(dataValidate(data)){

          // Botão é desabilitado
          setDisabledButton(true);

          // Inicialização da requisição para o servidor
          requestServerOperation(data);

        }

    }

    /*
    * Rotina 2
    * Validação dos dados no frontend
    */
    function dataValidate(formData){

      // Validação dos dados - true para presença de erro e false para ausência
      // O valor final é um objeto com dois atributos: "erro" e "message"
      // Se o atributo "erro" for true, um erro foi detectado, e o atributo "message" terá a mensagem sobre a natureza do erro
      const nameValidate = FormValidation(formData.get("registration_name_input"), 3, null, null, null);

      // Atualização dos estados responsáveis por manipular os inputs
      setErrorDetected({name: nameValidate.error});
      setErrorMessage({name: nameValidate.message});
      
      // Se o nome ou acesso estiverem errados
      if(nameValidate.error){

        return false;

      }else{

          return true;

      }

    }

    /*
    * Rotina 3
    * Comunicação AJAX com o Laravel utilizando AXIOS
    */
    function requestServerOperation(data){

      let user_id = AuthData.data.id;
      let module_id = 1;
      let action = "escrever";

      AxiosApi.post("/api/admin-module-profile", {
        auth: `${user_id}.${module_id}.${action}`,
        name: data.get("registration_name_input")
      })
      .then(function (response) {

        successServerResponseTreatment();  

      })
      .catch(function (error) {
        
        errorServerResponseTreatment(error.response.data);

      });

    }

    /*
    * Rotina 4A
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
    * Rotina 4B
    * Tratamento da resposta de uma requisição falha
    */
    function errorServerResponseTreatment(response_data){

      setDisabledButton(false);

      let error_message = (response_data.message != "" && response_data.message != undefined) ? response_data.message : "Houve um erro na realização da operação!";
      setDisplayAlert({display: true, type: "error", message: error_message});

      // Definição dos objetos de erro possíveis de serem retornados pelo validation do Laravel
      let input_errors = {
        name: {error: false, message: null}
      }

      // Coleta dos objetos de erro existentes na response
      for(let prop in response_data.errors){

        input_errors[prop] = {
          error: true, 
          message: response_data.errors[prop][0]
        }

      }

      setErrorDetected({name: input_errors.name.error});
      setErrorMessage({name: input_errors.name.message});

    }

// ============================================================================== ESTRUTURAÇÃO DA PÁGINA - MATERIAL UI ============================================================================== //

  return (
    <>
      <Tooltip title="Novo Perfil">
        <IconButton onClick={handleClickOpen} disabled={AuthData.data.user_powers["1"].profile_powers.escrever == 1 ? false : true}>
          <FontAwesomeIcon icon={faSquarePlus} color={AuthData.data.user_powers["1"].profile_powers.ler == 1 ? "#00713A" : "#808991"} size = "sm"/>
        </IconButton>
      </Tooltip>
      
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>CADASTRO DE PERFIL</DialogTitle>

        {/* Formulário da criação/registro do usuário - Componente Box do tipo "form" */}
        <Box component="form" noValidate onSubmit={handleRegistrationProfile} >

          <DialogContent>

            <DialogContentText>
              Perfis criados são diferentes dos perfis nativos do sistema. Um novo perfil deve ser criado apenas sob demanda, e, com a mesma condição, editado e excluído.
            </DialogContentText>

            <TextField
              margin="dense"
              id="registration_name_input"
              name="registration_name_input"
              label="Nome do novo perfil"
              fullWidth
              variant="outlined"
              helperText = {errorMessage.name}
              error = {errorDetected.name}
            />
          </DialogContent>

          {displayAlert.display && 
              <Alert severity={displayAlert.type}>{displayAlert.message}</Alert> 
          }

          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={disabledButton}>Confirmar</Button>
          </DialogActions>

        </Box>

      </Dialog>
    </>
  );
}
