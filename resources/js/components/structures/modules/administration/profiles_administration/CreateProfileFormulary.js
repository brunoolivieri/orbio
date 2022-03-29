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

/*

- Esse modal é utilizado para construir formulários para a página de administração
- Ele recebe os dados e o tipo de operação, e é construído de acordo com esses dados
- Por enquanto é utilizado apenas para a operação de DELETE e UPDATE de usuários

*/

export function CreateProfileFormulary() {

    // Utilizador do state global de autenticação
    const {AuthData, setAuthData} = useAuthentication();

    // States do formulário
    const [open, setOpen] = React.useState(false);

    // State da acessibilidade do botão de executar o registro
    const [disabledButton, setDisabledButton] = useState(false);

    // States utilizados nas validações dos campos 
    const [errorDetected, setErrorDetected] = useState({name: false, access: false}); // State para o efeito de erro - true ou false
    const [errorMessage, setErrorMessage] = useState({name: false, access: false}); // State para a mensagem do erro - objeto com mensagens para cada campo

    // State da mensagem do alerta
    const [displayAlert, setDisplayAlert] = useState({display: false, type: "", message: ""});

    // Função para abrir o modal
    const handleClickOpen = () => {
        setOpen(true);
    };

    // Função para fechar o modal
    const handleClose = () => {
        
      setErrorDetected({name: false, access: false});
      setErrorMessage({name: null, access: null});
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
    * Recebe o objeto da classe FormData criado na rotina 1
    * Se a validação não falhar, a próxima rotina, 3, é a da comunicação com o Laravel 
    */
    function dataValidate(formData){

      // Validação dos dados - true para presença de erro e false para ausência
      // O valor final é um objeto com dois atributos: "erro" e "message"
      // Se o atributo "erro" for true, um erro foi detectado, e o atributo "message" terá a mensagem sobre a natureza do erro
      const nameValidate = FormValidation(formData.get("registration_name_input"), 3, null, null, null);
      const accessValidate = Number(formData.get("registration_access_input")) === 0 ? {error: true, message: "Defina o nível de acesso (1 - 4)"} : {error: false, message: ""};

      // Atualização dos estados responsáveis por manipular os inputs
      setErrorDetected({name: nameValidate.error, access: accessValidate.error});
      setErrorMessage({name: nameValidate.message, access: accessValidate.message});
      
      // Se o nome ou acesso estiverem errados
      if(nameValidate.error || accessValidate.error){

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

      AxiosApi.post("/api/admin-module?", {
        panel: "profiles_panel",
        auth: `${user_id}.${module_id}.${action}`,
        nome: data.get("registration_name_input"),
        acesso_geral: data.get("registration_access_input")
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
        
          handleClose();

        }, 2000);

      }else{

        if(response.data.error){

           if(response.data.error === "name"){

            // Atualização do input
            setErrorDetected({name: true, access: false});
            setErrorMessage({name: "Esse perfil já existe!", access: null});

            // Alerta erro
            setDisplayAlert({display: true, type: "error", message: "Já existe um perfil cadastrado com esse nome"});

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
    
    }

  return (
    <div>

      {/* Botão para abrir o formulário */}
      {/* Botão para abrir o formulário */}
      <Tooltip title="Novo Perfil">
        <IconButton onClick={handleClickOpen} disabled={AuthData.data.user_powers["1"].profile_powers.escrever == 1 ? false : true}>
          <AddCircleIcon />
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
            <TextField
              type = "number"
              margin="dense"
              id="registration_access_input"
              name="registration_access_input"
              label="Acesso geral"
              fullWidth
              variant="outlined"
              InputProps={{ inputProps: { min: 1, max: 4 } }}
              helperText = {errorMessage.access}
              error = {errorDetected.access}
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
    </div>
  );
}
