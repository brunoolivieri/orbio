import * as React from 'react';
// Material UI
import { Button, TextField, Box, Grid, Typography, Container, Avatar, FormControlLabel, Checkbox } from '@mui/material';
import { makeStyles } from "@mui/styles";
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { useSnackbar } from 'notistack';
import LockIcon from '@mui/icons-material/Lock';
// Custom
import axios from '../../../../services/AxiosApi';
import { FormValidation } from '../../../../utils/FormValidation';
// React router dom
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: '#121212'
    },
    hiperlink: {
        color: theme.palette.mode == 'light' ? "#222" : "#fff",
    },
}));

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                ORBIO
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const initialControlledInput = { email: "", password: "" };
const initialFieldError = { email: false, password: false };
const initialFieldErrorMessage = { email: "", password: "" };

export function Login() {

    // ============================================================================== VARIABLES ============================================================================== //

    const [controlledInput, setControlledInput] = React.useState(initialControlledInput);
    const [fieldError, setFieldError] = React.useState(initialFieldError);
    const [fieldErrorMessage, setFieldErrorMessage] = React.useState(initialFieldErrorMessage);
    const [loading, setLoading] = React.useState(false);

    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();

    // ============================================================================== ROUTINES ============================================================================== //

    function handleSubmit() {
        if (!formValidation()) {
            return '';
        }
        setLoading(true);
        requestServer();
    }

    function formValidation() {

        const emailValidate = FormValidation(controlledInput.email, null, null, /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "e-mail");
        const passwordValidate = FormValidation(controlledInput.password);

        setFieldError({ email: emailValidate.error, password: passwordValidate.error });
        setFieldErrorMessage({ email: emailValidate.message, password: passwordValidate.message });

        return !(emailValidate.error || passwordValidate.error);

    }

    function requestServer() {
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
        handleOpenSnackbar(response.data.message, "success");
        setTimeout(() => {
            window.location.href = "/internal";
        }, [1000])
    }

    function errorResponse(response) {
        setLoading(false);
        handleOpenSnackbar(response.data.message, "error");

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
                    <Avatar sx={{ m: 1, bgcolor: 'success.main' }}>
                        <LockIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Acessar
                    </Typography>
                    <Box sx={{ mt: 1 }}>

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
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
                            label="Password"
                            type="password"
                            id="password"
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
                                sx={{ mt: 3, mb: 2, borderRadius: 1 }}
                                color="primary"
                                onClick={handleSubmit}
                            >
                                Login
                            </Button>
                        }

                        {loading &&
                            <LoadingButton
                                loading
                                loadingPosition="start"
                                startIcon={<SaveIcon />}
                                variant="outlined"
                                fullWidth
                                sx={{ mt: 3, mb: 2, borderRadius: 1 }}
                            >
                                Carregando
                            </LoadingButton>
                        }

                        <Grid container>
                            <Grid item>
                                <Link to="/forgot-password" variant="body2" className={classes.hiperlink}>
                                    Esqueceu a senha?
                                </Link>
                            </Grid>
                        </Grid>

                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </>
    )
}