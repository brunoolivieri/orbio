// IMPORTAÇÃO DOS COMPONENTES NATIVOS 
import { useState, memo } from 'react';

// IMPORTAÇÃO DOS COMPONENTES PARA O MATERIAL UI
import { Tooltip } from '@mui/material';
import { IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import { Box } from '@mui/system';
import { Button } from '@mui/material';
import { Typography } from '@mui/material';

// IMPORTAÇÃO DOS ÍCONES DO FONTS AWESOME
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';

// IMPORTAÇÃO DOS COMPONENTES CUSTOMIZADOS
import AxiosApi from "../../../../../services/AxiosApi";
import { FormValidation } from '../../../../../utils/FormValidation';
import { GenericModalDialog } from '../../../../structures/generic_modal_dialog/GenericModalDialog';

// IMPORTAÇÃO DOS ASSETS
import dangerImage from "../../../../assets/images/Error/error.png";

// OUTROS
import moment from 'moment';
import { useSnackbar } from 'notistack';

export const BasicDataPanel = memo((props) => {

// ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

    // States referentes ao formulário
    const [editMode, setEditMode] = useState(false);
    const [saveNecessary, setSaveNecessary] = useState(false);

    // States de validação dos campos
    const [errorDetected, setErrorDetected] = useState({name: false, email: false, actual_password: false, new_password: false}); // State para o efeito de erro - true ou false
    const [errorMessage, setErrorMessage] = useState({name: "", email: "", actual_password: "", new_password: ""}); // State para a mensagem do erro - objeto com mensagens para cada campo

    // States dos inputs de senha
    const [password, setPassword] = useState({update: false, actual_password: null, new_password: null});

    // State do modal informativo acerca da desativação da conta
    const [openGenericModal, setOpenGenericModal] = useState(false);

    const { enqueueSnackbar } = useSnackbar();

// ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

    function enableFieldsEdition(){

        setEditMode(!editMode);

    }

    function enableSaveButton(){

        setSaveNecessary(true);

    }

    function reloadFormulary(){

        props.reload_setter(!props.reload_state);

    }

    function temporarilyDisableAccount(){
        
        console.log("DESATIVAÇÃO DA CONTA")
        


    }

    /*
    * Rotina 1
    * Ponto inicial do processamento do envio do formulário 
    * Recebe os dados do formulário, e transforma em um objeto da classe FormData
    * A próxima rotina, 2, validará esses dados
    */ 
    function handleSubmitForm(event){
        event.preventDefault();

        const data = new FormData(event.currentTarget);

        if(dataValidate(data)){
  
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

        // Regex para validação
        const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

        const nameValidate = FormValidation(formData.get("user_fullname"), 3, null, null, null);
        const emailValidate = FormValidation(formData.get("user_email"), null, null, emailPattern, "EMAIL");
        const actualPasswordValidate = password.update ? FormValidation(password.actual_password, 8, null, passwordPattern, "PASSWORD") : {error: false, message: ""};
        const newPasswordValidate = password.update ? FormValidation(password.new_password, 8, null, passwordPattern, "PASSWORD") : {error: false, message: ""};
  
        setErrorDetected({name: nameValidate.error, email: emailValidate.error, actual_password: actualPasswordValidate.error, new_password: newPasswordValidate.error});
        setErrorMessage({name: nameValidate.message, email: emailValidate.message, actual_password: actualPasswordValidate.message, new_password: newPasswordValidate.message});
        
        if(nameValidate.error || emailValidate.error || actualPasswordValidate.error || newPasswordValidate.error || (password.update ? passwordsAreEqual() : false)){

            return false;

        }else{

            return true;
  
        }
  
    }

    /*
    * Subrotina da rotina 2
    * Verifica se a nova senha e a anterior são iguais 
    * O retorno true configura um erro
    * 
    */
    function passwordsAreEqual(){

        if(password.actual_password == password.new_password){

            handleOpenSnackbar("Erro! A nova senha não pode ser igual à atual", "error");

            return true;

        }else{

            return false;

        }

    }

    /*
    * Rotina 3
    * Comunicação AJAX com o Laravel utilizando AXIOS
    * Após o recebimento da resposta, é chamada próxima rotina, 4, de tratamento da resposta do servidor
    */
    function requestServerOperation(data){

        let request_data = {};

        if(password.update){

            request_data = {
                email: data.get("user_email"),
                name: data.get("user_fullname"),
                actual_password: password.actual_password,
                new_password: password.new_password
            };

        }else{

            request_data = {
                email: data.get("user_email"),
                name: data.get("user_fullname")
            };

        }

        AxiosApi.patch(`/api/update-basic-data/${props.userid}`, request_data)
        .then(function (response) {
  
            serverResponseTreatment(response);
  
        })
        .catch(function (error) {
          
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
            
            handleOpenSnackbar("Dados atualizados com sucesso!", "success");

            props.reload_setter(!props.reload_state);

            setEditMode(false);

            setPassword({update: false, actual_password: null, new_password: null});
   
         }else{
   
           if(response.data.error === "email_already_exists"){
   
            setErrorDetected({name: false, email: true});
            setErrorMessage({name: null, email: "Esse email já existe"});

            handleOpenSnackbar("Erro! O email já existe", "error");

            setDisabledButton(false);
   
           }else if(response.data.error === "wrong_password"){
            
            handleOpenSnackbar("Erro! A senha está incorreta", "error");
   
            setDisabledButton(false);
   
           }else{

            handleOpenSnackbar("Erro do servidor!", "error");
   
            setDisabledButton(false);

           }
   
        }
   
       }

       function handleOpenSnackbar(text, variant){

        enqueueSnackbar(text, { variant });
    
      };

// ============================================================================== ESTRUTURAÇÃO DA PÁGINA - COMPONENTES DO MATERIAL UI ============================================================================== //

    return(
        <>
        <Grid container spacing={1} alignItems="center">

            {saveNecessary && <Grid item>
                <Tooltip title="Salvar Alterações">
                    <IconButton form = "user_account_basic_form" type="submit">
                        <PublishedWithChangesIcon />         
                    </IconButton>
                </Tooltip>  
            </Grid>}

            <Grid item>
                <Tooltip title="Editar">
                    <IconButton onClick={enableFieldsEdition}>
                        <FontAwesomeIcon icon={faPenToSquare} size = "sm"/>
                    </IconButton>
                </Tooltip> 
            </Grid>

            <Grid item>
                <Tooltip title="Reload">
                    <IconButton onClick = {reloadFormulary}>
                        <FontAwesomeIcon icon={faArrowRotateRight} size = "sm" />
                    </IconButton>
                </Tooltip> 
            </Grid>

            <Grid item>
                <GenericModalDialog 
                modal_controller = {{state: openGenericModal, setModalState: setOpenGenericModal, counter: {required: false}}}
                title = {{top: {required: false}, middle: {required: false}}}
                image = {{required: true, src: dangerImage}}
                content_text = {"A desativação é imediata. O login ainda será possível, mas a conta terá acesso mínimo ao sistema."}
                actions = {{
                    required: true, 
                    close_button_text: {
                        required: true,
                        text: "Cancelar"
                    }, 
                    confirmation_default_button: {
                        required: true, 
                        text: "Desativar a conta", 
                        event: temporarilyDisableAccount
                    },
                    confirmation_button_with_link:{
                        required: false
                    }
                }}
                />
            </Grid>

        </Grid>
    
        <Box component="form" id = "user_account_basic_form" noValidate onSubmit={handleSubmitForm} sx={{ mt: 2 }} >
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="user_fullname"
                        name="user_fullname"
                        label="Nome completo"
                        fullWidth
                        variant="outlined"
                        defaultValue={props.name}
                        helperText = {errorMessage.name}
                        error = {errorDetected.name}
                        onChange={enableSaveButton}
                        InputProps={{
                            readOnly: !editMode,
                        }}
                        focused={editMode}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="user_email"
                        name="user_email"
                        label="Email"
                        fullWidth
                        variant="outlined"
                        defaultValue={props.email}
                        helperText = {errorMessage.email}
                        error = {errorDetected.email}
                        onChange={enableSaveButton}
                        InputProps={{
                            readOnly: !editMode,
                        }}
                        focused={editMode}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="profile_type"
                        name="profile_type"
                        label="Perfil de usuário"
                        fullWidth
                        variant="outlined"
                        defaultValue={props.profile}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="user_last_access"
                        name="user_last_access"
                        label="Data do último acesso"
                        fullWidth
                        variant="outlined"
                        defaultValue={moment(props.last_access).format('DD-MM-YYYY hh:mm')}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="user_last_update"
                        name="user_last_update"
                        label="Data da última atualização"
                        fullWidth
                        defaultValue={moment(props.last_update).format('DD-MM-YYYY hh:mm')}
                        variant="outlined"
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Grid>
            </Grid>

            <Box >
                <Typography variant="inherit" sx={{m: "10px 0px 10px 0px"}}>Alteração da senha.</Typography >
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="actual_password"
                        label="Senha atual"
                        type="password"
                        fullWidth
                        value={password.actual_password}
                        variant="outlined"
                        helperText = {errorMessage.actual_password}
                        error = {errorDetected.actual_password}
                        onChange={(e) => { enableSaveButton(); setPassword({update: true, actual_password: e.currentTarget.value, new_password: password.new_password}); }}
                        InputProps={{
                            readOnly: !editMode,
                        }}
                        focused={editMode}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="new_password"
                        label="Nova senha"
                        type="password"
                        fullWidth
                        value={password.new_password}
                        variant="outlined"
                        helperText = {errorMessage.new_password}
                        error = {errorDetected.new_password}
                        onChange={(e) => { enableSaveButton(); setPassword({update: true, actual_password: password.actual_password, new_password: e.currentTarget.value}); }}
                        InputProps={{
                            readOnly: !editMode,
                        }}
                        focused={editMode}
                    />
                </Grid>
            </Grid>
        </Box>

        <Box >
            <Typography variant="inherit" sx={{m: "10px 0px 10px 0px"}}>Desativação da conta.</Typography >
        </Box>

        <Grid container spacing={3}>
            <Grid item>
                <Button variant="contained" color="error" onClick = {() => {setOpenModal(!openModal)}}>
                    Desativar conta temporariamente
                </Button> 
            </Grid>
        </Grid>
        
        </>
    );
  
});