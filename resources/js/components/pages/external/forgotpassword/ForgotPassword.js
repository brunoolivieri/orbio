// IMPORTAÇÃO DOS COMPONENTES REACT
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// IMPORTAÇÃO DOS COMPONENTES CUSTOMIZADOS
import { FormValidation } from '../../../../utils/FormValidation';
import AxiosApi from '../../../../services/AxiosApi';
import {ScreenDarkFilter} from "../../../structures/screenDarkFilter/ScreenDarkFilter";
import { ColorModeToggle } from '../../../structures/color_mode/ToggleColorMode';

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
    const [operationStatus, setOperationStatus] = useState({type: null, status: null, tittle:null, message: null});

    // Classes do objeto makeStyles
    const classes = useStyles();

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

            // Inicialização da requisição para o servidor
            requestServerOperation(data, "SEND_CODE");

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

            // Inicialização da requisição para o servidor
            requestServerOperation(data, "CHANGE_PASSWORD");
            
        }

    }

    /*
    * Rotina 2
    * Validação dos dados no frontend
    * Recebe o objeto Event do evento onSubmit, e o formulário a ser validado
    * Se a validação não falhar, a próxima rotina, 3, é a da comunicação com o Laravel 
    */
    function dataValidate(formData, formulary){

        if(formulary === "SEND_CODE_FORMULARY_VALIDATION"){

            // Padrão de um email válido
            const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

            // Validação do dado - é retornado um objeto com dois atributos: "erro" e "message"
            // Se o atributo "erro" for true, um erro foi detectado, e o atributo "message" terá a mensagem sobre a natureza do erro
            const emailValidate = FormValidation(formData.get("forgotpass_email_input"), null, null, emailPattern, "EMAIL");

            // Atualização dos estados responsáveis por manipular os inputs
            setErrorDetected({email: emailValidate.error, code: false, password: false, confirm_password: false});
            setErrorMessage({email: emailValidate.message, code: false, password: false, confirm_password: false});

            // Se o campo email estiver errado
            if(emailValidate.error === true){

                return false;

            }else{

                return true;

            }

        }else if(formulary === "CHANGE_PASSWORD_FORMULARY_VALIDATION"){

            // Regex para validação
            const codePattern = /^[0-9]{4}$/;
            const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

            // Validação do dado - é retornado um objeto com dois atributos: "erro" e "message"
            // Se o atributo "erro" for true, um erro foi detectado, e o atributo "message" terá a mensagem sobre a natureza do erro
            const codeValidate = FormValidation(formData.get("code_received_input"), 4, 4, codePattern, "CODE");
            const passwordValidate = FormValidation(formData.get("new_password_input"), 8, null, passwordPattern, "PASSWORD");
            const passconfirmValidate = formData.get("new_password_confirmation_input") == formData.get("new_password_input") ? {error: false, message: ""} : {error: true, message: "As senhas são incompátiveis"};

            // Atualização dos estados responsáveis por manipular os inputs
            setErrorDetected({email: false, code: codeValidate.error, password: passwordValidate.error, confirm_password: passconfirmValidate.error});
            setErrorMessage({email: null, code: codeValidate.message, password: passwordValidate.message, confirm_password: passconfirmValidate.message});

            // Se algum campo estiver errado
            if(codeValidate.error === true || passwordValidate.error === true || passconfirmValidate.error === true){

                return false;

            }else{

                return true;

            }

        }

    }

    /*
    * Rotina 3
    * Comunicação AJAX com o Laravel utilizando AXIOS
    * Após o recebimento da resposta, é chamada próxima rotina, 4, de tratamento da resposta do servidor
    */
    function requestServerOperation(data, operation){

        // Tela de loading
        setOperationStatus({type: "loading", status: true, tittle: "Processando....", message: null});

        // Requisição Ajax para enviar o código
        if(operation === "SEND_CODE"){

            AxiosApi.post("/api/enviar-codigo", {
                email: data.get("forgotpass_email_input")
              })
              .then(function (response) {
    
                // Tratamento da resposta do servidor
                serverResponseTreatment(response, "SEND_CODE");
    
              })
              .catch(function (error) {
    
                console.log(error);
    
            });
        
        // Requisição Ajax para alterar a senha
        }else if(operation === "CHANGE_PASSWORD"){

            AxiosApi.post("/api/alterar-senha", {
                token: data.get("code_received_input"),
                newPassword: data.get("new_password_input")
              })
              .then(function (response) {
    
                // Tratamento da resposta do servidor
                serverResponseTreatment(response, "CHANGE_PASSWORD");
    
              })
              .catch(function (error) {
    
                console.log(error);
    
            });

        }

    }

    /*
    * Rotina 4
    * Tratamento da resposta do servidor
    * Para envio do código, e para alteração da senha, existem diferentes tratamentos de sucesso e falha
    * A próxima rotina, 5, ocorrerá apenas no caso de sucesso de envio do código para o email
    */
    function serverResponseTreatment(response, operation){

        if(operation === "SEND_CODE"){

            if(response.status === 200){

                // Libera os campos para alteração da senha
                // Desabilita o botão para envio de um novo código por 60 segundos
                setTimer(60);
                setCodeSent(true);

                // Modal com mensagem de sucesso
                setOperationStatus({type: "send_code", status: true, tittle: "Código enviado!", message: "O código para alteração da senha foi enviado para o seu email."});

                setTimeout(() => {

                    // Desaparece o Modal
                    setOperationStatus({type: null, status: null, tittle: null, message: null}); 
    
                }, 4500)

            }else{

                // Modal com mensagem de erro
                setOperationStatus({type: "send_code", status: false, tittle: "Erro no envio do código!", message: "Ops! O procedimento de envio do código falhou. Tente novamente."});

                setTimeout(() => {

                    // Desaparece o Modal
                    setOperationStatus({type: null, status: null, tittle: null, message: null}); 
    
                }, 4500);

                if(response.data.error == "email"){

                    // Atualização do input
                    setErrorDetected({name: false, email: true, password: false, confirm_password: false});
                    setErrorMessage({name: null, email: "Esse email não está registrado", password: null, confirm_password: null});

                }

            }

        }else if(operation === "CHANGE_PASSWORD"){

            if(response.status === 200){

                // Modal com mensagem de sucesso
                setOperationStatus({type: "change_password", status: true, tittle: "Sucesso!", message: "A sua senha foi alterada."});

                setTimeout(() => {

                    // Desaparece o Modal
                    setOperationStatus({type: null, status: null, tittle: null, message: null}); 

                    // REDIRECIONAMENTO PARA A PÁGINA DE LOGIN
                    window.location.href = "/acessar"; 
    
                }, 4500)

            }else{

                // Modal com mensagem de erro
                setOperationStatus({type: "change_password", status: false, tittle: "Erro na alteração da senha!", message: "Ops! O procedimento de alteração da senha falhou. Tente novamente."});

                setTimeout(() => {

                    // Desaparece o Modal
                    setOperationStatus({type: null, status: null, tittle: null, message: null}); 
    
                }, 4500);

                if(response.data.error == "code"){

                    // Atualização do input
                    setErrorDetected({email: false, code: true, password: false, confirm_password: false});
                    setErrorMessage({email: null, code: "O código está incorreto", password: null, confirm_password: null});

                }

            }

        }

    }

    /*
    * Rotina 5
    * Essa rotina ocorre quando o código é enviado com sucesso para o email do usuário
    * Se trata de uma função recursiva que, por causa da sua lógica, gera um cronômetro de 60 segundos
    * A dependência desse useEffect é o state "codeTimer" que é decrementado em 1 enquanto seu valor for maior do que zero
    * Toda vez que o valor desse state variar, a função é chamada, e sua rotina é o decremento em 1 do seu valor, gerando um loop de chamadas
    * O valor desse state é utilizado no texto do botão de enviar o código, e que é desativado enquanto for maior do que zero - se for zero, o botão é habilitado e com o texto "Enviar"
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

                {/* Renderização condicional do componente ScreenDarkFilter */}
                {operationStatus.type != null && <ScreenDarkFilter {...operationStatus} />}

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