// React
import * as React from 'react';
// Material UI
import { Button, TextField, FormControlLabel, Checkbox, Paper, Box, Grid, Typography, Alert } from '@mui/material';
import { makeStyles } from "@mui/styles";
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
// Custom
import axios from '../../../../services/AxiosApi';
import { FormValidation } from '../../../../utils/FormValidation';
// Fonts awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';
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

    // ============================================================================== VARIABLES ============================================================================== //

    const [controlledInput, setControlledInput] = React.useState({ email: "", password: "" });
    const [fieldError, setFieldError] = React.useState({ email: false, password: false });
    const [fieldErrorMessage, setFieldErrorMessage] = React.useState({ email: "", password: "" });
    const [alert, setAlert] = React.useState({ show: false, type: "error", message: "" });
    const [loading, setLoading] = React.useState(false);
    const classes = useStyles();

    // ============================================================================== ROUTINES ============================================================================== //

    function handleLoginSubmit(e) {
        e.preventDefault();
        if (formValidation()) {
            setLoading(true);
            requestServerOperation();
        }
    }

    function formValidation() {

        const emailValidate = FormValidation(controlledInput.email, null, null, /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "e-mail");
        const passwordValidate = FormValidation(controlledInput.password);

        setFieldError({ email: emailValidate.error, password: passwordValidate.error });
        setFieldErrorMessage({ email: emailValidate.message, password: passwordValidate.message });

        return !(emailValidate.error || passwordValidate.error);

    }

    function requestServerOperation() {
        axios.post("/api/auth/login", {
            email: controlledInput.email,
            password: controlledInput.password
        })
            .then(function (response) {
                successResponse(response);
            })
            .catch(function (error) {
                errorResponse(error.response);
            });
    }

    function successResponse(response) {
        setAlert({ show: true, type: "success", message: response.data.message });
        setTimeout(() => {
            window.location.href = "/internal";
        }, [1000])
    }

    function errorResponse(response) {
        setLoading(false);
        setAlert({ show: true, type: "error", message: response.data.message });

        let request_errors = {
            email: { error: false, message: null },
            password: { error: false, message: null }
        }

        for (let prop in response.data.errors) {

            request_errors[prop] = {
                error: true,
                message: response.data.errors[prop][0]
            }
        }

        setFieldError({ email: request_errors.email.error, password: request_errors.password.error });
        setFieldErrorMessage({ email: request_errors.email.message, password: request_errors.password.message });
    }

    function handleInputChange(e) {
        setControlledInput({ ...controlledInput, [e.target.name]: e.currentTarget.value });
    }

    // ============================================================================== STRUCTURES ============================================================================== //

    return (
        <>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundColor: "#111",
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
                        <Box sx={{ mb: 1 }}>
                            <FontAwesomeIcon icon={faRightToBracket} color={'#00713A'} size={"2x"} />
                        </Box>

                        <Typography component="h1" variant="h5">
                            Acessar a conta
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
                                    sx={{ mt: 1, mb: 2, borderRadius: 2 }}
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
                                    sx={{ mt: 1, mb: 2, borderRadius: 5 }}
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

                            {alert.show &&
                                <Alert severity={alert.type} fullWidth>{alert.message}</Alert>
                            }
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}