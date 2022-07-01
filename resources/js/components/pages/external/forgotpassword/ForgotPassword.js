// React
import * as React from 'react';
// Custom
import { FormValidation } from '../../../../utils/FormValidation';
import AxiosApi from '../../../../services/AxiosApi';
import { BackdropLoading } from '../../../structures/backdrop_loading/BackdropLoading';
import { ModalInformative } from '../../../structures/generic_modal_dialog/ModalInformative';
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
import SuccessImage from "../../../assets/images/Success/Success_md.png";
import ErrorImage from "../../../assets/images/Error/Error_md.png";
// Raect Router
import { Link } from 'react-router-dom';

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

    // Form fields states
    const [controlledInput, setControlledInput] = React.useState({ email: "", code: "", new_password: "", new_password_confirmation: "" });

    // Fields error states
    const [fieldError, setFieldError] = React.useState({ email: false, code: false, new_password: false, new_password_confirmation: false }); // State para o efeito de erro - true ou false
    const [fieldErrorMessage, setFiedlErrorMessage] = React.useState({ email: "", code: "", new_password: "", new_password_confirmation: "" }); // State para a mensagem do erro - objeto com mensagens para cada campo

    // Code request status
    const [codeSent, setCodeSent] = React.useState(false);

    // Timer for send another code
    const [codeTimer, setTimer] = React.useState(0);

    // Display modal with the current operation status
    const [operation, setOperation] = React.useState({ current: "", title: "", message: "", image: "" });

    // Classes from make styles
    const classes = useStyles();

    // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

    function handleCodeSubmit(event) {
        event.preventDefault();

        if (formularyDataValidate("SEND_CODE")) {

            sendCodeServerRequest();

        }

    }

    function handleChangePasswordSubmit(event) {
        event.preventDefault();

        if (formularyDataValidate("CHANGE_PASSWORD")) {

            changePasswordServerRequest();

        }

    }

    function formularyDataValidate(formulary) {

        if (formulary === "SEND_CODE") {

            const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
            const emailValidate = FormValidation(controlledInput.email, null, null, emailPattern, "e-mail");

            setFieldError({ email: emailValidate.error, code: false, new_password: false, new_password_confirmation: false });
            setFiedlErrorMessage({ email: emailValidate.message, code: false, new_password: false, new_password_confirmation: false });

            return !emailValidate.error;

        } else if (formulary === "CHANGE_PASSWORD") {

            const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

            const codeValidate = controlledInput.code.length == 10 ? { error: false, message: "" } : { error: true, message: "código inválido" };
            const passwordValidate = FormValidation(controlledInput.new_password, 8, null, passwordPattern, "senha");
            const passwordConfirmValidate = controlledInput.new_password == controlledInput.new_password_confirmation ? { error: false, message: "" } : { error: true, message: "As senhas são incompátiveis" };

            setFieldError({ email: false, code: codeValidate.error, new_password: passwordValidate.error, new_password_confirmation: passwordConfirmValidate.error });
            setFiedlErrorMessage({ email: "", code: codeValidate.message, new_password: passwordValidate.message, new_password_confirmation: passwordConfirmValidate.message });

            return !(codeValidate.error || passwordValidate.error || passwordConfirmValidate.error);

        }

    }

    function sendCodeServerRequest() {

        setOperation({ current: "loading", title: "", message: "", image: "" });

        AxiosApi.post("/api/auth/password-token", {
            email: controlledInput.email
        })
            .then(function (response) {

                sendCodeSuccessServerResponseTreatment(response);

            }).catch((error) => {

                sendCodeErrorServerResponseTreatment(error.response);

            });

    }

    function changePasswordServerRequest() {

        setOperation({ current: "loading", title: null, message: "", image: null });

        AxiosApi.post("/api/auth/change-password", {
            token: controlledInput.code,
            new_password: controlledInput.new_password,
            new_password_confirmation: controlledInput.new_password_confirmation
        })
            .then(function (response) {

                changePasswordSuccessServerResponseTreatment(response);

            }).catch((error) => {

                changePasswordErrorServerResponseTreatment(error.response);

            });

    }

    function sendCodeSuccessServerResponseTreatment(response) {

        setOperation({ current: "concluded", title: "Código enviado!", message: response.data.message, image: SuccessImage });

        setTimer(60);
        setCodeSent(true);

        setTimeout(() => {

            setOperation({ current: "", title: "", message: "", image: "" });

        }, 2000);

    }

    function sendCodeErrorServerResponseTreatment(response) {

        const error_message = response.data.message ? response.data.message : "Houve um erro no envio do email. Tente novamente.";

        setOperation({ current: "concluded", title: "Erro no envio do código!", message: error_message, image: ErrorImage });

        let request_errors = {
            email: { error: false, message: "" }
        }

        for (let prop in response.data.errors) {

            request_errors[prop] = {
                error: true,
                message: response.data.errors[prop][0]
            }

        }

        setFieldError({ name: false, email: request_errors.email.error, new_password: false, new_password_confirmation: false });
        setFiedlErrorMessage({ name: "", email: request_errors.email.message, new_password: "", new_password_confirmation: "" });

        setTimeout(() => {

            setOperation({ current: "", title: "", message: "", image: "" });

        }, 2000);

    }

    function changePasswordSuccessServerResponseTreatment(response) {

        setOperation({ current: "concluded", title: response.data.message, message: "", image: SuccessImage });

        setTimeout(() => {

            setOperation({ current: "", title: "", message: "", image: "" });

            window.location.href = "/login";

        }, 2000);


    }

    function changePasswordErrorServerResponseTreatment(response) {

        const error_message = response.data.message ? response.data.message : "Houve um erro na alteração da senha. Tente novamente.";

        setOperation({ current: "concluded", title: error_message, message: "", image: ErrorImage });

        // Errors by key that can be returned from backend validation 
        let request_errors = {
            token: { error: false, message: "" },
            new_password: { error: false, message: "" },
            new_password_confirmation: { error: false, message: "" }
        }

        // Get errors by their key 
        for (let prop in response.data.errors) {

            request_errors[prop] = {
                error: true,
                message: response.data.errors[prop][0]
            }

        }

        setFieldError({ name: request_errors.name.error, email: request_errors.email.error, new_password: request_errors.new_password.error, new_password_confirmation: request_errors.new_password_confirmation.error });
        setFiedlErrorMessage({ name: request_errors.name.error, email: request_errors.email.message, new_password: request_errors.new_password.message, new_password_confirmation: request_errors.new_password_confirmation.message });

        setTimeout(() => {

            setOperation({ current: "", title: "", message: "", image: "" });

        }, 2000);

    }

    const handleInputChange = (event) => {
        setControlledInput({ ...controlledInput, [event.target.name]: event.currentTarget.value });
    }

    React.useEffect(() => {

        if (codeTimer > 0) {

            setTimeout(() => {

                setTimer(codeTimer - 1);

            }, 1000);

        }

    }, [codeTimer]);

    // ============================================================================== ESTRUTURAÇÃO DA PÁGINA - COMPONENTES DO MATERIAL UI ============================================================================== //

    return (

        <>

            {operation.current === "loading" &&
                <BackdropLoading />
            }

            {operation.current === "concluded" &&
                <ModalInformative
                    image={operation.image}
                    title={operation.title}
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
                            label="Informe o seu endereço de email"
                            name="email"
                            autoFocus
                            onChange={handleInputChange}
                            disabled={codeTimer > 0}
                            error={fieldError.email}
                            helperText={fieldErrorMessage.email}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={codeTimer > 0}
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
                            label="Código"
                            type="text"
                            onChange={handleInputChange}
                            disabled={!codeSent}
                            error={fieldError.code}
                            helperText={fieldErrorMessage.code}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Nova senha"
                            name="new_password"
                            type="password"
                            autoFocus
                            onChange={handleInputChange}
                            disabled={!codeSent}
                            helperText={fieldErrorMessage.new_password}
                            error={fieldError.new_password}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Confirmação da senha"
                            name="new_password_confirmation"
                            type="password"
                            autoFocus
                            onChange={handleInputChange}
                            disabled={!codeSent}
                            helperText={fieldErrorMessage.new_password_confirmation}
                            error={fieldError.new_password_confirmation}
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
                                <Link to="/login" className={classes.hiperlink}>
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