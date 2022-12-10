import * as React from 'react';
// Material UI
import { Button, TextField, Grid, Box, Container, Typography } from '@mui/material';
import { makeStyles } from "@mui/styles";
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { useSnackbar } from 'notistack';
// Custom
import { FormValidation } from '../../../../utils/FormValidation';
import axios from '../../../../services/AxiosApi';
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

    // ============================================================================== VARIABLES ============================================================================== //

    const [controlledInput, setControlledInput] = React.useState({ email: "", code: "", new_password: "", new_password_confirmation: "" });
    const [fieldError, setFieldError] = React.useState({ email: false, code: false, new_password: false, new_password_confirmation: false });
    const [fieldErrorMessage, setFiedlErrorMessage] = React.useState({ email: "", code: "", new_password: "", new_password_confirmation: "" });
    const [codeSent, setCodeSent] = React.useState(false);
    const [timer, setTimer] = React.useState(0);
    const [loading, setLoading] = React.useState({ send_code: false, change_password: false });
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();

    // ============================================================================== ROUTINES ============================================================================== //

    function handleCodeSubmit(e) {
        e.preventDefault();
        if (formSendCodeValidation()) {
            setLoading({ send_code: true, change_password: false });
            sendCodeServerRequest();
        }
    }

    function handleChangePasswordSubmit(e) {
        e.preventDefault();
        if (formChangePasswordValidation()) {
            setLoading({ send_code: false, change_password: true });
            changePasswordServerRequest();
        }
    }

    function formSendCodeValidation() {

        const emailValidate = FormValidation(controlledInput.email, null, null, /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "e-mail");

        setFieldError({ email: emailValidate.error, code: false, new_password: false, new_password_confirmation: false });
        setFiedlErrorMessage({ email: emailValidate.message, code: false, new_password: false, new_password_confirmation: false });

        return !emailValidate.error;

    }

    function formChangePasswordValidation() {

        const codeValidate = controlledInput.code.length == 10 ? { error: false, message: "" } : { error: true, message: "código inválido" };
        const passwordValidate = FormValidation(controlledInput.new_password, 8, null, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, "senha");
        const passwordConfirmValidate = controlledInput.new_password == controlledInput.new_password_confirmation ? { error: false, message: "" } : { error: true, message: "As senhas são incompátiveis" };

        setFieldError({ email: false, code: codeValidate.error, new_password: passwordValidate.error, new_password_confirmation: passwordConfirmValidate.error });
        setFiedlErrorMessage({ email: "", code: codeValidate.message, new_password: passwordValidate.message, new_password_confirmation: passwordConfirmValidate.message });

        return !(codeValidate.error || passwordValidate.error || passwordConfirmValidate.error);

    }

    function sendCodeServerRequest() {
        axios.post("/api/auth/password-token", {
            email: controlledInput.email
        })
            .then(function (response) {
                successSendCodeResponse();
                handleOpenSnackbar(response.data.message, "success");
            }).catch((error) => {
                setLoading({ send_code: false, change_password: false });
                errorResponse(error.response);
            });
    }

    function changePasswordServerRequest() {
        axios.post("/api/auth/change-password", {
            token: controlledInput.code,
            new_password: controlledInput.new_password,
            new_password_confirmation: controlledInput.new_password_confirmation
        })
            .then(function (response) {
                successChangePasswordResponse();
                handleOpenSnackbar(response.data.message, "success");
            }).catch((error) => {
                setLoading({ send_code: false, change_password: false });
                errorResponse(error.response);
            });
    }

    function successSendCodeResponse() {
        setTimer(10);
        setCodeSent(true);
        setLoading({ send_code: false, change_password: false });
    }

    function successChangePasswordResponse() {
        setLoading({ send_code: false, change_password: false });
        setTimeout(() => {
            window.location.href = "/login";
        }, 2000);
    }

    const errorResponse = (response) => {
        handleOpenSnackbar(response.data.message, "error");

        let request_errors = {
            email: { error: false, message: "" },
            token: { error: false, message: "" },
            new_password: { error: false, message: "" },
            new_password_confirmation: { error: false, message: "" }
        }

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
        if (timer === 0) {
            return ''
        }
        setTimeout(() => {
            setTimer((previously) => previously - 1);
        }, 1000);
    }, [timer])

    function handleOpenSnackbar(text, variant) {
        enqueueSnackbar(text, { variant });
    }

    // ============================================================================== STRUCTURES ============================================================================== //

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
                            disabled={timer > 0}
                            error={fieldError.email}
                            helperText={fieldErrorMessage.email}
                        />

                        {!loading.send_code &&
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 1, mb: 2, borderRadius: 5 }}
                                disabled={timer > 0}
                            >
                                {timer === 0 ? "Enviar código" : timer}
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