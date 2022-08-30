// React
import * as React from 'react';
// Custom
import { FormValidation } from '../../../../utils/FormValidation';
import AxiosApi from '../../../../services/AxiosApi';
// Material UI
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { makeStyles } from "@mui/styles";
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { useSnackbar } from 'notistack';
// Fonts awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsersGear } from '@fortawesome/free-solid-svg-icons';
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

export const ForgotPassword = () => {

    // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

    const [controlledInput, setControlledInput] = React.useState({ email: "", code: "", new_password: "", new_password_confirmation: "" });

    const [fieldError, setFieldError] = React.useState({ email: false, code: false, new_password: false, new_password_confirmation: false }); // State para o efeito de erro - true ou false
    const [fieldErrorMessage, setFiedlErrorMessage] = React.useState({ email: "", code: "", new_password: "", new_password_confirmation: "" }); // State para a mensagem do erro - objeto com mensagens para cada campo

    const [codeSent, setCodeSent] = React.useState(false);

    const [codeTimer, setTimer] = React.useState(0);

    const [loading, setLoading] = React.useState({ send_code: false, change_password: false });

    const classes = useStyles();

    // Context do snackbar
    const { enqueueSnackbar } = useSnackbar();

    // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

    const handleCodeSubmit = (event) => {
        event.preventDefault();

        if (formularyDataValidate("SEND_CODE")) {

            setLoading({ send_code: true, change_password: false });
            sendCodeServerRequest();

        }

    }

    const handleChangePasswordSubmit = (event) => {
        event.preventDefault();

        if (formularyDataValidate("CHANGE_PASSWORD")) {

            setLoading({ send_code: false, change_password: true });
            changePasswordServerRequest();

        }

    }

    const formularyDataValidate = (formulary) => {

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

    const sendCodeServerRequest = () => {

        AxiosApi.post("/api/auth/password-token", {
            email: controlledInput.email
        })
            .then(function (response) {

                setLoading({ send_code: false, change_password: false });
                sendCodeSuccessServerResponseTreatment(response);

            }).catch((error) => {

                setLoading({ send_code: false, change_password: false });
                sendCodeErrorServerResponseTreatment(error.response);

            });

    }

    const changePasswordServerRequest = () => {

        AxiosApi.post("/api/auth/change-password", {
            token: controlledInput.code,
            new_password: controlledInput.new_password,
            new_password_confirmation: controlledInput.new_password_confirmation
        })
            .then(function (response) {

                setLoading({ send_code: false, change_password: false });
                changePasswordSuccessServerResponseTreatment(response);

            }).catch((error) => {

                setLoading({ send_code: false, change_password: false });
                changePasswordErrorServerResponseTreatment(error.response);

            });

    }

    const sendCodeSuccessServerResponseTreatment = (response) => {

        handleOpenSnackbar(response.data.message, "success");

        setTimer(60);
        setCodeSent(true);

    }

    const sendCodeErrorServerResponseTreatment = (response) => {

        handleOpenSnackbar("Erro. Tente novamente.", "error");

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

    }

    const changePasswordSuccessServerResponseTreatment = (response) => {

        handleOpenSnackbar(response.data.message, "success");

        setTimeout(() => {
            window.location.href = "/login";
        }, 2000);


    }

    const changePasswordErrorServerResponseTreatment = (response) => {

        handleOpenSnackbar("Erro do servidor", "error");

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

    function handleOpenSnackbar(text, variant) {
        enqueueSnackbar(text, { variant });
    }

    // ============================================================================== ESTRUTURAÇÃO DA PÁGINA - COMPONENTES DO MATERIAL UI ============================================================================== //

    return (
        <>
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Box sx={{ mb: 1 }}>
                        <FontAwesomeIcon icon={faUsersGear} color={'#00713A'} size={"2x"} />
                    </Box>

                    <Typography component="h1" variant="h5">
                        Recuperar a conta
                    </Typography>

                    <Box component="form" onSubmit={handleCodeSubmit} noValidate sx={{ mt: 2 }}>

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

                        {!loading.send_code &&
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 1, mb: 2, borderRadius: 5 }}
                                disabled={codeTimer > 0}
                            >
                                {codeTimer === 0 ? "Enviar código" : codeTimer}
                            </Button>
                        }

                        {loading.send_code &&
                            <LoadingButton
                                loading
                                loadingPosition="start"
                                startIcon={<SaveIcon />}
                                variant="outlined"
                                type="submit"
                                fullWidth
                                sx={{ mt: 1, mb: 2, borderRadius: 5 }}
                            >
                                Enviando código
                            </LoadingButton>
                        }

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

                        {!loading.change_password &&
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 1, mb: 2, borderRadius: 5 }}
                                disabled={!codeSent}
                            >
                                Alterar a senha
                            </Button>
                        }

                        {loading.change_password &&
                            <LoadingButton
                                loading
                                loadingPosition="start"
                                startIcon={<SaveIcon />}
                                variant="outlined"
                                type="submit"
                                fullWidth
                                sx={{ mt: 1, mb: 2, borderRadius: 5 }}
                            >
                                Alterando senha
                            </LoadingButton>
                        }

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