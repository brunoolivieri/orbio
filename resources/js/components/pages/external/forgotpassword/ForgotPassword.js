import * as React from 'react';
// Raect Router
import { Link } from 'react-router-dom';
// Material UI
import { Button, TextField, Grid, Container, Typography, Avatar } from '@mui/material';
import { makeStyles } from "@mui/styles";
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { useSnackbar } from 'notistack';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
// Custom
import axios from '../../../../services/AxiosApi';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.mode == 'light' ? "#fff" : '#2C2C2C'
    },
    hiperlink: {
        color: theme.palette.mode == 'light' ? "#222" : "#fff",
    }
}));

const initialFormData = { email: "", code: "", new_password: "", new_password_confirmation: "" };
const initialFormError = { email: { error: false, message: "" }, code: { error: false, message: "" }, password: { error: false, message: "" }, password_confirmation: { error: false, message: "" } };

const formValidation = {
    email: {
        test: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value),
        message: "Email inválido"
    },
    code: {
        test: (value) => value.length === 10,
        message: "Código inválido"
    },
    password: {
        test: (value) => /^.{10,}$/.test(value),
        message: "A senha deve ter no mínimo 10 caracteres"
    },
    password_confirmation: {
        test: (value, ref) => value === ref,
        message: "As senhas não coincidem"
    }
}

export const ForgotPassword = () => {

    // ============================================================================== VARIABLES ============================================================================== //

    const [formData, setFormData] = React.useState(initialFormData);
    const [formError, setFormError] = React.useState(initialFormError);
    const [codeSent, setCodeSent] = React.useState(false);
    const [timer, setTimer] = React.useState(0);
    const [loading, setLoading] = React.useState({ send_code: false, change_password: false });
    const classes = useStyles();

    const { enqueueSnackbar } = useSnackbar();

    // ============================================================================== ROUTINES ============================================================================== //

    function handleCodeSubmit() {

        if (codeSubmissionValidation()) return '';

        setLoading({ send_code: true, change_password: false });
        sendCodeServerRequest();

    }

    function handleChangePasswordSubmit() {

        if (!passwordSubmissionValidate()) return '';

        setLoading({ send_code: false, change_password: true });
        changePasswordServerRequest();
    }

    function codeSubmissionValidation() {

        let validation = Object.assign({}, initialFormError);

        if (!formValidation.email.test(formData.email)) {
            validation.email.error = true;
            validation.email.message = formValidation.email.message;
        }

        setFormError(validation);
        return !validation.email.error;

    }

    function passwordSubmissionValidate() {

        let validation = Object.assign({}, initialFormError);

        for (let field in formData) {
            if (field != 'email' && field != 'password_confirmation') {
                if (!formValidation[field].test(formData[field])) {
                    validation[field].error = true;
                    validation[field].message = formValidation[field].message;
                }
            } else if (field != 'email' && field === 'password_confirmation') {
                if (!formValidation.password_confirmation.test(formData.password_confirmation, formData.password)) {
                    validation[field].error = true;
                    validation[field].message = formValidation[field].message;
                }
            }

        }

        setFormError(validation);
        return !(validation.code.error || validation.password.error || validation.password_confirmation.error);

    }

    async function sendCodeServerRequest() {

        try {

            const response = axios.post("/api/auth/password-token", {
                email: formData.email
            });

            successSendCodeResponse(response);

        } catch (error) {
            errorResponse(error.response);
        } finally {
            setLoading({ send_code: false, change_password: false });
        }

    }

    async function changePasswordServerRequest() {

        try {

            const response = axios.post("/api/auth/change-password", {
                token: formData.code,
                new_password: formData.new_password,
                new_password_confirmation: formData.new_password_confirmation
            });

            successChangePasswordResponse(response);

        } catch (error) {
            errorResponse(error.response);
        } finally {
            setLoading({ send_code: false, change_password: false });
        }

    }

    function successSendCodeResponse(response) {
        setTimer(30);
        setCodeSent(true);
        enqueueSnackbar(response.data.message, { variant: "success" });
    }

    function successChangePasswordResponse(response) {
        enqueueSnackbar(response.data.message, { variant: "success" });

        setTimeout(() => {
            window.location.href = "/login";
        }, 2000);
    }

    const errorResponse = (response) => {
        enqueueSnackbar(response.data.message, { variant: "error" });

        let response_errors = {};

        for (let field in response.data.errors) {
            response_errors[field] = {
                error: true,
                message: response.data.errors[field][0]
            }
        }

        setFormError(response_errors);

    }

    const handleInputChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.currentTarget.value });
    }

    React.useEffect(() => {

        let is_mounted = true;
        if (!is_mounted || timer === 0) return '';

        setTimeout(() => {
            setTimer((previously) => previously - 1);
        }, 1000);

        return () => {
            is_mounted = false;
        }

    }, [timer]);

    // ============================================================================== STRUCTURES ============================================================================== //

    return (
        <>
            <Container component="main" maxWidth="xs">

                <Grid container columns={12} spacing={1} sx={{ mt: 8 }}>

                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Avatar sx={{ m: 1, bgcolor: 'success.main' }}>
                            <ChangeCircleIcon />
                        </Avatar>
                    </Grid>

                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Typography component="h1" variant="h5">
                            Recuperar a conta
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Informe o seu endereço de email"
                            name="email"
                            autoFocus
                            onChange={handleInputChange}
                            disabled={timer > 0}
                            error={formError.email.error}
                            helperText={formError.email.message}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        {!loading.send_code &&
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ borderRadius: 1 }}
                                disabled={timer > 0}
                                onClick={handleCodeSubmit}
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
                                sx={{ borderRadius: 1 }}
                            >
                                Enviando código
                            </LoadingButton>
                        }
                    </Grid>
                </Grid>

                <Grid container columns={12}>

                    <Grid item xs={12}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="code"
                            label="Código"
                            type="text"
                            onChange={handleInputChange}
                            disabled={!codeSent}
                            error={formError.code.error}
                            helperText={formError.code.message}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Nova senha"
                            name="password"
                            type="password"
                            autoFocus
                            onChange={handleInputChange}
                            disabled={!codeSent}
                            error={formError.password.error}
                            helperText={formError.password.message}
                        />
                    </Grid>

                    <Grid item xs={12}>
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
                            error={formError.password_confirmation.error}
                            helperText={formError.password_confirmation.message}
                            sx={{ mb: 3 }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        {!loading.change_password &&
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ borderRadius: 1 }}
                                disabled={!codeSent}
                                onClick={handleChangePasswordSubmit}
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
                                sx={{ borderRadius: 1 }}
                            >
                                Alterando senha
                            </LoadingButton>
                        }
                    </Grid>

                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'end', mt: 1 }}>
                        <Link to="/login" className={classes.hiperlink}>
                            Voltar para a página de acesso
                        </Link>
                    </Grid>
                </Grid>

            </Container>
        </>
    )
}