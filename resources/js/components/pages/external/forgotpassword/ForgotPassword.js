import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button, TextField, Grid, Container, Typography, Avatar } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { useSnackbar } from 'notistack';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
// Custom
import axios from '../../../../services/AxiosApi';
import { FormValidation } from '../../../../utils/FormValidation';

const initialFormData = { email: "", code: "", password: "", password_confirmation: "" };
const initialFormError = { email: { error: false, message: "" }, code: { error: false, message: "" }, password: { error: false, message: "" }, password_confirmation: { error: false, message: "" } };

export function ForgotPassword() {

    // ============================================================================== VARIABLES ============================================================================== //

    const { enqueueSnackbar } = useSnackbar();

    const [formData, setFormData] = React.useState(initialFormData);
    const [formError, setFormError] = React.useState(initialFormError);
    const [codeSent, setCodeSent] = React.useState(false);
    const [timer, setTimer] = React.useState(0);
    const [loading, setLoading] = React.useState({ send_code: false, change_password: false });

    // ============================================================================== ROUTINES ============================================================================== //

    function handleCodeSubmit() {
        if (!codeSubmissionValidation()) {
            return;
        }

        setLoading({ send_code: true, change_password: false });
        sendCodeServerRequest();
    }

    function handleChangePasswordSubmit() {
        if (!passwordSubmissionValidation()) {
            return;
        }

        setLoading({ send_code: false, change_password: true });
        changePasswordServerRequest();
    }

    function codeSubmissionValidation() {
        let validation = Object.assign({}, initialFormError);

        validation["email"] = FormValidation(formData["email"], null, null, /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "email");

        setFormError(validation);
        return !validation.email.error;
    }

    function passwordSubmissionValidation() {
        let validation = Object.assign({}, initialFormError);

        validation["code"] = FormValidation(formData["code"], null, null);
        validation["password"] = FormValidation(formData.password, 3, 255);
        validation["password_confirmation"] = formData.password_confirmation == formData.password ? { error: false, message: "" } : { error: true, message: "As senhas são incompátiveis." };

        setFormError(validation);
        return !(validation.code.error || validation.password.error || validation.password_confirmation.error);
    }

    async function sendCodeServerRequest() {
        try {
            const response = await axios.post(`${process.env.MIX_APP_URL}/api/get-password-token`, {
                email: formData.email
            });
            enqueueSnackbar(response.data.message, { variant: "success" });
            setTimer(30);
            setCodeSent(true);
        } catch (error) {
            console.log(error.response)
            errorResponse(error.response);
        } finally {
            setLoading({ send_code: false, change_password: false });
        }
    }

    async function changePasswordServerRequest() {
        try {
            const response = await axios.post(`${process.env.MIX_APP_URL}/api/change-password`, {
                token: formData.code,
                password: formData.password,
                password_confirmation: formData.password_confirmation
            });
            enqueueSnackbar(response.data.message, { variant: "success" });
            setTimeout(() => {
                window.location.replace(`${process.env.MIX_APP_URL}/login`);
            }, 2000);
        } catch (error) {
            errorResponse(error.response);
        } finally {
            setLoading({ send_code: false, change_password: false });
        }
    }

    function errorResponse(response) {
        enqueueSnackbar(response.data.message, { variant: "error" });
        if (response.status === 422) {
            let response_errors = Object.assign({}, initialFormError);
            for (let field in response.data.errors) {
                response_errors[field] = {
                    error: true,
                    message: response.data.errors[field][0]
                }
            }
            setFormError(response_errors);
        }
    }

    React.useEffect(() => {

        let is_mounted = true;
        if (!is_mounted || timer === 0) {
            return;
        }

        setTimeout(() => {
            setTimer((previously) => previously - 1);
        }, 1000);

        return () => {
            is_mounted = false;
        }

    }, [timer]);

    function handleInputChange(event) {
        setFormData({ ...formData, [event.target.name]: event.currentTarget.value });
    }

    // ============================================================================== JSX ============================================================================== //

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
                            name="password_confirmation"
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
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ borderRadius: 1 }}
                            disabled={!codeSent || loading.change_password}
                            onClick={handleChangePasswordSubmit}
                        >
                            {loading.change_password ? "Enviando..." : "Alterar a senha"}
                        </Button>
                    </Grid>

                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'end', mt: 1 }}>
                        <Link to="/login" style={{ color: 'inherit' }}>
                            Voltar para a página de acesso
                        </Link>
                    </Grid>
                </Grid>

            </Container>
        </>
    )
}