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
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Box from '@mui/material/Box';
import { Alert } from '@mui/material';

// IMPORTAÇÃO DOS COMPONENTES CUSTOMIZADOS
import AxiosApi from '../../../../../services/AxiosApi';
import { GenericSelect } from '../../../input_select/GenericSelect';
import { useAuthentication } from '../../../../context/InternalRoutesAuth/AuthenticationContext';
import { FormValidation } from '../../../../../utils/FormValidation';

/*

- Esse modal é utilizado para construir formulários para a página de administração
- Ele recebe os dados e o tipo de operação, e é construído de acordo com esses dados
- Por enquanto é utilizado apenas para a operação de DELETE e UPDATE de usuários

*/

export function CreateUserFormulary({...props}) {

    // Utilizador do state global de autenticação
    const {AuthData, setAuthData} = useAuthentication();

    // States utilizados nas validações dos campos 
    const [errorDetected, setErrorDetected] = useState({name: false, email: false, profile: false}); // State para o efeito de erro - true ou false
    const [errorMessage, setErrorMessage] = useState({name: null, email: null, profile: null}); // State para a mensagem do erro - objeto com mensagens para cada campo

    // State da mensagem do alerta
    const [displayAlert, setDisplayAlert] = useState({display: false, type: "", message: ""});

    // State da acessibilidade do botão de executar o registro
    const [disabledButton, setDisabledButton] = useState(false);

    // States do formulário
    const [open, setOpen] = React.useState(false);

    // Função para abrir o modal
    const handleClickOpen = () => {
        setOpen(true);
    };

    // Função para fechar o modal
    const handleClose = () => {

        setErrorDetected({name: false, email: false, profile: false});
        setErrorMessage({name: null, email: null, profile: null});
        setDisplayAlert({display: false, type: "", message: ""});
        setDisabledButton(false);

        setOpen(false);

    };

    /*
    * Rotina 1
    * Ponto inicial do processamento do envio do formulário de registro
    * Recebe os dados do formulário, e transforma em um objeto da classe FormData
    * A próxima rotina, 2, validará esses dados
    */ 
    function handleRegistrationSubmit(event){
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
    * Recebe o objeto da classe FormData criado na rotina 1
    * Se a validação não falhar, a próxima rotina, 3, é a da comunicação com o Laravel 
    */
    function dataValidate(formData){

        // Padrão de um email válido
        const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        // Validação dos dados - true para presença de erro e false para ausência
        // O valor final é um objeto com dois atributos: "erro" e "message"
        // Se o atributo "erro" for true, um erro foi detectado, e o atributo "message" terá a mensagem sobre a natureza do erro
        const nameValidate = FormValidation(formData.get("registration_name_input"), 3, null, null, null);
        const emailValidate = FormValidation(formData.get("registration_email_input"), null, null, emailPattern, "EMAIL");
        const profileValidate = Number(formData.get("select_profile")) === 0 ? {error: true, message: "Selecione um perfil"} : {error: false, message: ""};

        // Atualização dos estados responsáveis por manipular os inputs
        setErrorDetected({name: nameValidate.error, email: emailValidate.error, profile: profileValidate.error});
        setErrorMessage({name: nameValidate.message, email: emailValidate.message, profile: profileValidate.message});
        
        // Se o nome, email ou perfil estiverem errados
        if(nameValidate.error || emailValidate.error || profileValidate.error){

          return false;

        }else{

            return true;

        }

    }

    /*
    * Rotina 3
    * Comunicação AJAX com o Laravel utilizando AXIOS
    * Após o recebimento da resposta, é chamada próxima rotina, 4, de tratamento da resposta do servidor
    */
    function requestServerOperation(data){

      let user_id = AuthData.data.id;
      let module_id = 1;
      let action = "escrever";

      AxiosApi.post(`/api/admin-module`, {
        panel: "users_panel",
        auth: `${user_id}.${module_id}.${action}`,
        email: data.get("registration_email_input"),
        nome: data.get("registration_name_input"),
        id_perfil: data.get("select_profile"),
        senha: `User${(Math.floor(Math.random() * 100000000) + 99999999)}`
      })
      .then(function (response) {

          // Tratamento da resposta do servidor
          serverResponseTreatment(response);

      })
      .catch(function (error) {
        
        // Tratamento da resposta do servidor
        serverResponseTreatment(error.response);

      });

    }

    /*
    * Rotina 4
    * Tratamento da resposta do servidor
    * Se for um sucesso, aparece, mo modal, um alerta com a mensagem de sucesso, e o novo registro na tabela de usuários
    */
    function serverResponseTreatment(response){

     if(response.status === 200){

        // Alerta sucesso
        setDisplayAlert({display: true, type: "success", message: "Cadastro realizado com sucesso!"});

        setTimeout(() => {
          
          setDisabledButton(false);
          
          handleClose();

        }, 2000);

      }else{

        if(response.data.error === "email_already_exists"){

          // Atualização do input
          setErrorDetected({name: false, email: true, profile: false});
          setErrorMessage({name: null, email: "Esse email já existe", profile: null});

          // Alerta erro
          setDisplayAlert({display: true, type: "error", message: "O email informado já está cadastrado no sistema"});

          // Habilitar botão de envio
          setDisabledButton(false);

        }else{

          // Alerta
          setDisplayAlert({display: true, type: "error", message: "Erro! Tente novamente."});

          // Habilitar botão de envio
          setDisabledButton(false);

        } 

      }

    }

  return (
    <div>

      {/* Botão para abrir o formulário */}
      <Tooltip title="Novo Usuário">
        <IconButton onClick={handleClickOpen} disabled={AuthData.data.user_powers["1"].profile_powers.escrever == 1 ? false : true}>
          <AddCircleIcon />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>CADASTRO DE USUÁRIO</DialogTitle>

        {/* Formulário da criação/registro do usuário - Componente Box do tipo "form" */}
        <Box component="form" noValidate onSubmit={handleRegistrationSubmit} >

          <DialogContent>
        
            <DialogContentText>
              Quando confirmada e executada a criação do usuário no sistema, o email cadastrado receberá uma orientação para realizar a ativação da conta.
            </DialogContentText>
            
              <TextField
                margin="dense"
                label="Nome completo"
                fullWidth
                variant="outlined"
                required
                id="registration_name_input"
                name="registration_name_input"
                helperText = {errorMessage.name}
                error = {errorDetected.name}
              />
              <TextField
                type = "email"
                margin="dense"
                label="Endereço de email"
                fullWidth
                variant="outlined"
                required
                id="registration_email_input"
                name="registration_email_input"
                helperText = {errorMessage.email}
                error = {errorDetected.email}
              />
              
               <GenericSelect 
               label_text = {"Perfil"} 
               data_source = {"/api/admin-module/create?panel=users_panel&auth=none"} 
               primary_key={"id"} 
               key_content={"nome"} 
               error = {errorDetected.profile} 
               default = {0}  
               name = {"select_profile"} 
               />
              
          </DialogContent>

          {displayAlert.display && 
              <Alert severity={displayAlert.type}>{displayAlert.message}</Alert> 
          }

          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={disabledButton}>Confirmar e enviar email</Button>
          </DialogActions>

        </Box>
      
      </Dialog>
    </div>
  );
}
