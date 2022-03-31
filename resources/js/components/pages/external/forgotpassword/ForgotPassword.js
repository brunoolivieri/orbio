// IMPORTAÇÃO DOS COMPONENTES REACT
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// IMPORTAÇÃO DOS COMPONENTES CUSTOMIZADOS
import { FormValidation } from '../../../../utils/FormValidation';
import AxiosApi from '../../../../services/AxiosApi';
import { ColorModeToggle } from '../../../structures/color_mode/ToggleColorMode';
import { BackdropLoading } from '../../../structures/backdrop_loading/BackdropLoading';
import { GenericModalDialog } from '../../../structures/generic_modal_dialog/GenericModalDialog';

// IMPORTAÇÃO DOS COMPONENTES MATERIALUI
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { blue } from '@mui/material/colors';
import { makeStyles } from "@mui/styles";

// IMPORTAÇÃO DOS ASSETS
import success_image from "../../../assets/images/success/success.png";
import email_image from "../../../assets/images/email/email.png";
import error_image from "../../../assets/images/error/error.png";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.mode == 'light' ? "#fff" : '#2C2C2C'
    },
    hiperlink: {
        color: theme.palette.mode == 'light' ? "#222" : "#fff",
    }
}))

export function ForgotPassword(){

// ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

    // States utilizados nas validações dos campos 
    const [errorDetected, setErrorDetected] = useState({email: false, code: false, password: false, confirm_password: false}); // State para o efeito de erro - true ou false
    const [errorMessage, setErrorMessage] = useState({email: null, code: null, password: null, confirm_password: null}); // State para a mensagem do erro - objeto com mensagens para cada campo

    // State do envio do código - true se foi enviado, false se não 
    const [codeSent, setCodeSent] = useState(false);

    // State do contador para envio de um novo código 
    const [codeTimer, setTimer] = useState(0);

    // State da realização da operação - ativa o Modal informativo sobre o estado da operação 
    // Neste caso, a operação é envio do código e alteração da senha
    const [operationStatus, setOperationStatus] = useState({type: null, title:null, message: null, image: null});

    // Classes do objeto makeStyles
    const classes = useStyles();

    // State do modal informativo acerca da operação realizada
    const [openGenericModal, setOpenGenericModal] = useState(true);

// ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //
    
    /*
    * Rotina 1A
    * Ponto inicial do processamento do envio do formulário de envio do código para o email
    * Recebe os dados do formulário respectivo, e transforma em um objeto da classe FormData
    * A próxima rotina, 2, validará esses dados
    */
    function handleCodeSubmit(event){
        event.preventDefault();

        // Instância da classe JS FormData - para trabalhar os dados do formulário
        const data = new FormData(event.currentTarget);

        if(dataValidate(data, "SEND_CODE_FORMULARY_VALIDATION")){

            sendCodeRequestServerOperation(data);

        }

    }

    /*
    * Rotina 1B
    * Ponto inicial do processamento do envio do formulário da alteração da senha
    * Recebe os dados do formulário respectivo, e transforma em um objeto da classe FormData
    * A próxima rotina, 2, validará esses dados
    */
    function handleChangePasswordSubmit(event){
        event.preventDefault();

        // Instância da classe JS FormData - para trabalhar os dados do formulário
        const data = new FormData(event.currentTarget);

        if(dataValidate(data, "CHANGE_PASSWORD_FORMULARY_VALIDATION")){

            changePasswordRequestServerOperation(data);
            
        }

    }

    /*
    * Rotina 2AB
    * Validação dos dados no frontend
    * Recebe o objeto Event do evento onSubmit, e o formulário a ser validado
    * Se a validação não falhar, a próxima rotina, 3, é a da comunicação com o Laravel 
    */
    function dataValidate(formData, formulary){

        if(formulary === "SEND_CODE_FORMULARY_VALIDATION"){

            const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

            const emailValidate = FormValidation(formData.get("forgotpass_email_input"), null, null, emailPattern, "EMAIL");

            setErrorDetected({email: emailValidate.error, code: false, password: false, confirm_password: false});
            setErrorMessage({email: emailValidate.message, code: false, password: false, confirm_password: false});

            if(emailValidate.error === true){

                return false;

            }else{

                return true;

            }

        }else if(formulary === "CHANGE_PASSWORD_FORMULARY_VALIDATION"){

            const codePattern = /^[0-9]{4}$/;
            const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

            const codeValidate = FormValidation(formData.get("code_received_input"), 4, 4, codePattern, "CODE");
            const passwordValidate = FormValidation(formData.get("new_password_input"), 8, null, passwordPattern, "PASSWORD");
            const passconfirmValidate = formData.get("new_password_confirmation_input") == formData.get("new_password_input") ? {error: false, message: ""} : {error: true, message: "As senhas são incompátiveis"};

            setErrorDetected({email: false, code: codeValidate.error, password: passwordValidate.error, confirm_password: passconfirmValidate.error});
            setErrorMessage({email: null, code: codeValidate.message, password: passwordValidate.message, confirm_password: passconfirmValidate.message});

            if(codeValidate.error === true || passwordValidate.error === true || passconfirmValidate.error === true){

                return false;

            }else{

                return true;

            }

        }

    }

    /*
    * Rotina 3A
    * Comunicação com o backend 
    * Envio do código de alteração da senha para o email do usuário
    * 
    */
    function sendCodeRequestServerOperation(data){

        setOperationStatus({type: "loading", title: null, message: null, image: null});

        AxiosApi.post("/api/enviar-codigo", {
            email: data.get("forgotpass_email_input")
          })
          .then(function (response) {

            sendCodeServerResponseTreatment(response);

          }).catch((error) => {
              
            sendCodeServerResponseTreatment(error.response);
        })

    }

    /*
    * Rotina 3B
    * Comunicação com o backend 
    * Alteração da senha a partir do código enviado para o email do usuário
    * 
    */
    function changePasswordRequestServerOperation(data){

        setOperationStatus({type: "loading", title: null, message: null, image: null});

        AxiosApi.post("/api/alterar-senha", {
            token: data.get("code_received_input"),
            newPassword: data.get("new_password_input")
          })
          .then(function (response) {

            changePasswordServerResponseTreatment(response);

          }).catch((error) => {

            changePasswordServerResponseTreatment(error.response);

          })

    }

    /*
    * Rotina 4A
    * Tratamento da resposta do servidor para o envio do código para o usuário
    * Se a resposta for de sucesso, o formulário de alteração da senha será liberado
    * Além disso, o botão de envio do código será desabilitado por 60 segundos
    * 
    */
    function sendCodeServerResponseTreatment(response){

        if(response.status === 200){

            setOperationStatus({type: "processed", title: "Código enviado!", message: "O código para alteração da senha foi enviado para o seu email.", image: email_image});

            setTimer(60);
            setCodeSent(true);

            setTimeout(() => {

                setOperationStatus({type: null, title: null, message: null, image: null}); 

            }, 5000)

        }else{

            setOperationStatus({type: "processed", title: "Erro no envio do código!", message: "Ops! O procedimento de envio do código falhou. Tente novamente.", image: error_image});

            setTimeout(() => {

                setOperationStatus({type: null, title: null, message: null, image: null}); 

            }, 5000);

            if(response.data.error == "unregistered_email"){

                setErrorDetected({name: false, email: true, password: false, confirm_password: false});
                setErrorMessage({name: null, email: "Esse email não está registrado", password: null, confirm_password: null});

            }

        }

    }

    /*
    * Rotina 4B
    * Tratamento da resposta do servidor para alteração da senha
    * 
    */
    function changePasswordServerResponseTreatment(response){

        if(response.status === 200){

            setOperationStatus({type: "processed", title: "Sucesso!", message: "A sua senha foi alterada.", image: success_image});

            setTimeout(() => {

                setOperationStatus({type: null, title: null, message: null, image: null}); 

                window.location.href = "/acessar"; 

            }, 4500)

        }else{

            setOperationStatus({type: "processed", title: "Erro na alteração da senha!", message: "Ops! O procedimento de alteração da senha falhou. Tente novamente.", image: error_image});

            setTimeout(() => {

                setOperationStatus({type: null, title: null, message: null, image: null}); 

            }, 4500);

            if(response.data.error == "code"){

                // Atualização do input
                setErrorDetected({email: false, code: true, password: false, confirm_password: false});
                setErrorMessage({email: null, code: "O código está incorreto", password: null, confirm_password: null});

            }

        }

    }

    /*
    * Rotina do contador
    * Ela ocorre quando o código é enviado com sucesso para o email do usuário
    * Se trata de uma função recursiva que gera um cronômetro de 60 segundos
    * A dependência desse useEffect é o state "codeTimer" que é decrementado em 1 enquanto seu valor for maior do que zero
    * Toda vez que o valor desse state variar, a função é chamada, e sua rotina é o decremento em 1 do seu valor, gerando um loop de chamadas
    * O valor desse state é utilizado no texto do botão de enviar o código, que permanece desativado enquanto o valor for maior do que zero
    * 
    */
    useEffect(() => {

        if(codeTimer > 0){

            setTimeout(() => {

                setTimer(codeTimer - 1);

            }, 1000)

        }
        

    }, [codeTimer]);

// ============================================================================== ESTRUTURAÇÃO DA PÁGINA - COMPONENTES DO MATERIAL UI ============================================================================== //

    return(

        <>
        <Box sx={{position: 'absolute', right: '10px', top: '10px'}}>
            <ColorModeToggle />
        </Box>
    
        {operationStatus.type == "loading" &&
            <BackdropLoading />
        }

        {operationStatus.type == "processed" &&
            <GenericModalDialog 
            modal_controller = {{state: openGenericModal, setModalState: setOpenGenericModal, counter: {required: false}}}
            title = {{top: {required: false}, middle: {required: true, text: operationStatus.message}}}
            image = {{required: true, src: operationStatus.image}}
            content_text = ""
            actions = {{
                required: false, 
                close_button_text: {
                    required: false, 
                }, 
                confirmation_default_button: {
                    required: false
                },
                confirmation_button_with_link:{
                    required: false
                }
            }}
            />
        }
        
        <Container component="main" maxWidth="xs">
            
            <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
            >

                <Avatar sx={{ m: 1, color: "black", bgcolor: blue[50]}}>
                    <ManageAccountsIcon />
                </Avatar>

                <Typography component="h1" variant="h5">
                    Recuperar a conta
                </Typography>

                <Box component="form" onSubmit={handleCodeSubmit} noValidate sx={{ mt: 1 }}>

                    <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="forgotpass_email_input"
                    label="Informe o seu endereço de email"
                    name="forgotpass_email_input"
                    autoFocus
                    disabled = {codeTimer > 0 ? true : false}
                    error = {errorDetected.email}
                    helperText = {errorMessage.email}
                    />
                    <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled = {codeTimer > 0 ? true : false}
                    >
                    {codeTimer === 0 ? "Receber código": codeTimer}
                    </Button>    
                </Box>
                <Box component="form" onSubmit={handleChangePasswordSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="code_received_input"
                    label="Código recebido"
                    type="text"
                    id="code_received_input"
                    disabled = {!codeSent} // Disabled recebe a negação do state codeSent
                    error = {errorDetected.code}
                    helperText = {errorMessage.code}
                    />
                    <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="new_password_input"
                    label="Nova senha"
                    name="new_password_input"
                    type = "password"
                    autoFocus
                    disabled = {!codeSent} // Disabled recebe a negação do state codeSent
                    helperText = {errorMessage.password}
                    error = {errorDetected.password}
                    />
                    <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="new_password_confirmation_input"
                    label="Confirmação da senha"
                    name="new_password_confirmation_input"
                    type = "password"
                    autoFocus
                    disabled = {!codeSent} // Disabled recebe a negação do state codeSent
                    helperText = {errorMessage.confirm_password}
                    error = {errorDetected.confirm_password}
                    />
                    <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled = {!codeSent}
                    >
                    Alterar a senha
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link to ="/acessar" className={classes.hiperlink}>
                                Voltar para a página de acesso 
                            </Link>
                        </Grid>
                    </Grid>
                </Box>

            </Box>
        </Container>    
        </>
    )
}