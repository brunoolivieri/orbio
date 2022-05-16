// React
import * as React from 'react';
// Custom
import { FormValidation } from '../../../../utils/FormValidation';
import AxiosApi from '../../../../services/AxiosApi';
import { BackdropLoading } from '../../../structures/backdrop_loading/BackdropLoading';
import { GenericModalDialog } from '../../../structures/generic_modal_dialog/GenericModalDialog';
// Material UI
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
// Assets
import { SuccessAnimation } from '../../../assets/lotties/SuccessLottie';
import { ErrorAnimation } from '../../../assets/lotties/ErrorLottie';
// Raect Router
import { Link } from 'react-router-dom';
// Lottie

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.mode == 'light' ? "#fff" : '#2C2C2C'
    },
    hiperlink: {
        color: theme.palette.mode == 'light' ? "#222" : "#fff",
    }
}))

export function ForgotPassword() {

    // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

    // States utilizados nas validações dos campos 
    const [errorDetected, setErrorDetected] = React.useState({ email: false, code: false, password: false, confirm_password: false }); // State para o efeito de erro - true ou false
    const [errorMessage, setErrorMessage] = React.useState({ email: null, code: null, password: null, confirm_password: null }); // State para a mensagem do erro - objeto com mensagens para cada campo

    // State do envio do código - true se foi enviado, false se não 
    const [codeSent, setCodeSent] = React.useState(false);

    // State do contador para envio de um novo código 
    const [codeTimer, setTimer] = React.useState(0);

    // State da realização da operação - ativa o Modal informativo sobre o estado da operação 
    // Neste caso, a operação é envio do código e alteração da senha
    const [operationStatus, setOperationStatus] = React.useState({ type: null, title: null, message: null, image: null });

    // Classes do objeto makeStyles
    const classes = useStyles();

    // State do modal informativo acerca da operação realizada
    const [openGenericModal, setOpenGenericModal] = React.useState(true);

    // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

    /*
    * Rotina 1A
    * Ponto inicial do processamento do envio do formulário de envio do código para o email
    * Recebe os dados do formulário respectivo, e transforma em um objeto da classe FormData
    * A próxima rotina, 2, validará esses dados
    */
    function handleCodeSubmit(event) {
        event.preventDefault();

        // Instância da classe JS FormData - para trabalhar os dados do formulário
        const data = new FormData(event.currentTarget);

        // dataValidate(data, "SEND_CODE_FORMULARY_VALIDATION")
        if (formDataValidate(data, "SEND_CODE_FORMULARY_VALIDATION")) {

            sendCodeRequestServerOperation(data);

        }

    }

    /*
    * Rotina 1B
    * Ponto inicial do processamento do envio do formulário da alteração da senha
    * Recebe os dados do formulário respectivo, e transforma em um objeto da classe FormData
    * A próxima rotina, 2, validará esses dados
    */
    function handleChangePasswordSubmit(event) {
        event.preventDefault();

        // Instância da classe JS FormData - para trabalhar os dados do formulário
        const data = new FormData(event.currentTarget);

        if (formDataValidate(data, "CHANGE_PASSWORD_FORMULARY_VALIDATION")) {

            changePasswordRequestServerOperation(data);

        }

    }

    /*
    * Rotina 2AB
    * Validação dos dados no frontend
    * Recebe o objeto Event do evento onSubmit, e o formulário a ser validado
    * Se a validação não falhar, a próxima rotina, 3, é a da comunicação com o Laravel 
    */
    function formDataValidate(formData, formulary) {

        if (formulary === "SEND_CODE_FORMULARY_VALIDATION") {

            const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
            const emailValidate = FormValidation(formData.get("email"), null, null, emailPattern, "EMAIL");

            setErrorDetected({ email: emailValidate.error, code: false, password: false, confirm_password: false });
            setErrorMessage({ email: emailValidate.message, code: false, password: false, confirm_password: false });

            if (emailValidate.error === true) {

                return false;

            } else {

                return true;

            }

        } else if (formulary === "CHANGE_PASSWORD_FORMULARY_VALIDATION") {

            const codePattern = /^[0-9]{4}$/;
            const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

            const codeValidate = FormValidation(formData.get("code"), 4, 4, codePattern, "CODE");
            const passwordValidate = FormValidation(formData.get("new_password"), 8, null, passwordPattern, "PASSWORD");
            const passconfirmValidate = formData.get("new_password_confirmation") == formData.get("new_password") ? { error: false, message: "" } : { error: true, message: "As senhas são incompátiveis" };

            setErrorDetected({ email: false, code: codeValidate.error, password: passwordValidate.error, confirm_password: passconfirmValidate.error });
            setErrorMessage({ email: null, code: codeValidate.message, password: passwordValidate.message, confirm_password: passconfirmValidate.message });

            if (codeValidate.error === true || passwordValidate.error === true || passconfirmValidate.error === true) {

                return false;

            } else {

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
    function sendCodeRequestServerOperation(data) {

        setOperationStatus({ type: "loading", title: null, message: null, image: null });

        AxiosApi.post("/api/enviar-codigo", {
            email: data.get("email")
        })
            .then(function () {

                sendCodeSuccessServerResponseTreatment();

            }).catch((error) => {

                sendCodeErrorServerResponseTreatment(error.response.data);

            })

    }

    /*
    * Rotina 3B
    * Comunicação com o backend 
    * Alteração da senha a partir do código enviado para o email do usuário
    * 
    */
    function changePasswordRequestServerOperation(data) {

        setOperationStatus({ type: "loading", title: null, message: null, image: null });

        AxiosApi.post("/api/alterar-senha", {
            token: data.get("code"),
            new_password: data.get("new_password"),
            new_password_confirmation: data.get("new_password")
        })
            .then(function () {

                changePasswordSuccessServerResponseTreatment();

            }).catch((error) => {

                changePasswordErrorServerResponseTreatment(error.response.data);

            })

    }

    /*
    * Rotina 4A
    * Tratamento da resposta do servidor para o envio do código para o usuário
    * Se a resposta for de sucesso, o formulário de alteração da senha será liberado
    * Além disso, o botão de envio do código será desabilitado por 60 segundos
    * 
    */
    function sendCodeSuccessServerResponseTreatment() {

        setOperationStatus({ type: "processed", title: "Código enviado!", message: "Sucesso! Confira o seu e-mail.", animation: SuccessAnimation });

        setTimer(60);
        setCodeSent(true);

        setTimeout(() => {

            setOperationStatus({ type: null, title: null, message: null, image: null });

        }, 4000)

    }

    function sendCodeErrorServerResponseTreatment(response_data) {

        let error_message = (response_data.message != "" && response_data.message != undefined) ? response_data.message : "Houve um erro no envio do email. Tente novamente.";

        setOperationStatus({ type: "processed", title: "Erro no envio do código!", message: error_message, animation: ErrorAnimation });

        // Definição dos objetos de erro possíveis de serem retornados pelo validation do Laravel
        let input_errors = {
            email: { error: false, message: null }
        }

        // Coleta dos objetos de erro existentes na response
        for (let prop in response_data.errors) {

            input_errors[prop] = {
                error: true,
                message: response_data.errors[prop][0]
            }

        }

        setErrorDetected({ name: false, email: input_errors.email.error, password: false, confirm_password: false });
        setErrorMessage({ name: false, email: input_errors.email.message, password: null, confirm_password: null });

        setTimeout(() => {

            setOperationStatus({ type: null, title: null, message: null, image: null });

        }, 4000);

    }

    function changePasswordSuccessServerResponseTreatment() {

        setOperationStatus({ type: "processed", title: "Sucesso!", message: "A sua senha foi alterada.", animation: SuccessAnimation });

        setTimeout(() => {

            setOperationStatus({ type: null, title: null, message: null, image: null });

            window.location.href = "/acessar";

        }, 4000)


    }

    function changePasswordErrorServerResponseTreatment(response_data) {

        let error_message = (response_data.message != "" && response_data.message != undefined) ? response_data.message : "Houve um erro na alteração da senha. Tente novamente.";

        setOperationStatus({ type: "processed", title: "Erro na alteração da senha!", message: error_message, animation: ErrorAnimation });

        // Definição dos objetos de erro possíveis de serem retornados pelo validation do Laravel
        let input_errors = {
            token: { error: false, message: null },
            new_password: { error: false, message: null },
            new_password_confirmation: { error: false, message: null }
        }

        // Coleta dos objetos de erro existentes na response
        for (let prop in response_data.errors) {

            input_errors[prop] = {
                error: true,
                message: response_data.errors[prop][0]
            }

        }

        setErrorDetected({ name: input_errors.name.error, email: input_errors.email.error, password: input_errors.new_password.error, confirm_password: input_errors.new_password_confirmation.error });
        setErrorMessage({ name: input_errors.name.error, email: input_errors.email.message, password: input_errors.new_password.message, confirm_password: input_errors.new_password_confirmation.message });

        setTimeout(() => {

            setOperationStatus({ type: null, title: null, message: null, image: null });

        }, 4000);

    }

    /*
    * Rotina do contador
    * 
    */
    React.useEffect(() => {

        if (codeTimer > 0) {

            setTimeout(() => {

                setTimer(codeTimer - 1);

            }, 1000)

        }


    }, [codeTimer]);

    // ============================================================================== ESTRUTURAÇÃO DA PÁGINA - COMPONENTES DO MATERIAL UI ============================================================================== //

    return (

        <>

            {operationStatus.type == "loading" &&
                <BackdropLoading />
            }

            {operationStatus.type == "processed" &&
                <GenericModalDialog
                    modal_controller={{ state: openGenericModal, setModalState: setOpenGenericModal, counter: { required: false } }}
                    title={{ top: { required: false }, middle: { required: true, text: operationStatus.message } }}
                    image={{required: false}}
                    lottie = {{required: true, animation: operationStatus.animation()}}
                    content_text=""
                    actions={{
                        required: false,
                        close_button_text: {
                            required: false,
                        },
                        confirmation_default_button: {
                            required: false
                        },
                        confirmation_button_with_link: {
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

                    <Avatar sx={{ m: 1, color: "black", bgcolor: blue[50] }}>
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
                            id="email"
                            label="Informe o seu endereço de email"
                            name="email"
                            autoFocus
                            disabled={codeTimer > 0 ? true : false}
                            error={errorDetected.email}
                            helperText={errorMessage.email}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={codeTimer > 0 ? true : false}
                        >
                            {codeTimer === 0 ? "Receber código" : codeTimer}
                        </Button>
                    </Box>
                    <Box component="form" onSubmit={handleChangePasswordSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="code"
                            label="Código recebido"
                            type="text"
                            id="code"
                            disabled={!codeSent} // Disabled recebe a negação do state codeSent
                            error={errorDetected.code}
                            helperText={errorMessage.code}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="new_password"
                            label="Nova senha"
                            name="new_password"
                            type="password"
                            autoFocus
                            disabled={!codeSent} // Disabled recebe a negação do state codeSent
                            helperText={errorMessage.password}
                            error={errorDetected.password}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="new_password_confirmation"
                            label="Confirmação da senha"
                            name="new_password_confirmation"
                            type="password"
                            autoFocus
                            disabled={!codeSent} // Disabled recebe a negação do state codeSent
                            helperText={errorMessage.confirm_password}
                            error={errorDetected.confirm_password}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={!codeSent}
                        >
                            Alterar a senha
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link to="/acessar" className={classes.hiperlink}>
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