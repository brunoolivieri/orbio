// React
import * as React from 'react';
// Custom
import AxiosApi from '../../../../services/AxiosApi';
import { FormValidation } from '../../../../utils/FormValidation';
// Material UI
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Alert } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { blue } from '@mui/material/colors';
import { makeStyles } from "@mui/styles";
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
// React router dom
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: '#121212'
    },
    hiperlink: {
        color: theme.palette.mode == 'light' ? "#222" : "#fff",
    },
}))

export function Login() {

    // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

    const [controlledInput, setControlledInput] = React.useState({ email: "", password: "" });

    const [fieldError, setFieldError] = React.useState({ email: false, password: false }); // State para o efeito de erro - true ou false
    const [fieldErrorMessage, setFieldErrorMessage] = React.useState({ email: "", password: "" }); // State para a mensagem do erro - objeto com mensagens para cada campo

    const [displayAlert, setDisplayAlert] = React.useState({ display: false, type: "error", message: "" });

    const [loading, setLoading] = React.useState(false);

    const classes = useStyles();

    // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

    function handleLoginSubmit(event) {
        event.preventDefault();

        if (formularyDataValidate()) {

            setLoading(true);
            requestServerOperation();

        }

    }

    function formularyDataValidate() {

        const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

        const emailValidate = FormValidation(controlledInput.email, null, null, emailPattern, "e-mail");
        const passwordValidate = FormValidation(controlledInput.password, null, null, null, null);

        setFieldError({ email: emailValidate.error, password: passwordValidate.error });
        setFieldErrorMessage({ email: emailValidate.message, password: passwordValidate.message });

        // If its true, return false, and vice-versa
        return emailValidate.error || passwordValidate.error ? false : true;

    }

    function requestServerOperation() {

        AxiosApi.post("/api/auth/login", {
            email: controlledInput.email,
            password: controlledInput.password
        })
            .then(function (response) {

                successServerResponseTreatment(response);

            })
            .catch(function (error) {

                setLoading(false);
                errorServerResponseTreatment(error.response);

            });

    }

    function successServerResponseTreatment(response) {

        setDisplayAlert({ display: true, type: "success", message: response.data.message });

        setTimeout(() => {
            window.location.href = "/internal";
        }, [1000])

    }

    function errorServerResponseTreatment(response) {

        const message = response.data.message ? response.data.message : "Erro do servidor";

        setDisplayAlert({ display: true, type: "error", message: message });

        // Errors by key that can be returned from backend validation 
        let request_errors = {
            email: { error: false, message: null },
            password: { error: false, message: null }
        }

        // Get errors by their key 
        for (let prop in response.data.errors) {

            request_errors[prop] = {
                error: true,
                message: response.data.errors[prop][0]
            }

        }

        setFieldError({ email: request_errors.email.error, password: request_errors.password.error });
        setFieldErrorMessage({ email: request_errors.email.message, password: request_errors.password.message });

    }

    const handleInputChange = (event) => {
        setControlledInput({ ...controlledInput, [event.target.name]: event.currentTarget.value });
    }

    // ============================================================================== ESTRUTURAÇÃO DA PÁGINA - COMPONENTES DO MATERIAL UI ============================================================================== //

    return (

        <>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundColor: "#222",
                        backgroundImage: 'url()',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}

                    >
                        <Avatar sx={{ m: 1, color: "black", bgcolor: blue[50], border: "black" }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Acessar
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleLoginSubmit} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Digite o seu email"
                                name="email"
                                autoFocus
                                onChange={handleInputChange}
                                helperText={fieldErrorMessage.email}
                                error={fieldError.email}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Digite a sua senha"
                                type="password"
                                onChange={handleInputChange}
                                helperText={fieldErrorMessage.password}
                                error={fieldError.password}
                            />
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Lembrar"
                            />

                            {!loading &&
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                    color="primary"
                                >
                                    Acessar
                                </Button>
                            }

                            {loading &&
                                <LoadingButton
                                    loading
                                    loadingPosition="start"
                                    startIcon={<SaveIcon />}
                                    variant="outlined"
                                    fullWidth
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Acessando
                                </LoadingButton>
                            }

                            <Grid container sx={{ mb: 2 }}>
                                <Grid item xs >
                                    <Link to="/forgot-password" className={classes.hiperlink}>
                                        Esqueceu a senha?
                                    </Link>
                                </Grid>
                            </Grid>

                            {displayAlert.display &&
                                <Alert severity={displayAlert.type} fullWidth>{displayAlert.message}</Alert>
                            }
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}