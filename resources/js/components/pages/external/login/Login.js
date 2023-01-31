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
// React router dom
import { Link, redirect } from 'react-router-dom';

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
const initialFieldError = { email: { error: false, message: "" }, password: { error: false, message: "" } };

const formValidation = {
    email: {
        test: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value),
        message: "Email inválido"
    },
    password: {
        test: (value) => value != null,
        message: "Informe a sua senha"
    }
}

export function Login() {

    // ============================================================================== VARIABLES ============================================================================== //

    const [formData, setFormData] = React.useState(initialControlledInput);
    const [formError, setFormError] = React.useState(initialFieldError);
    const [loading, setLoading] = React.useState(false);

    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();

    // ============================================================================== ROUTINES ============================================================================== //

    function handleSubmit() {

        if (!formValidate) return '';

        setLoading(true);
        requestServer();
    }

    function formValidate() {

        let validation = Object.assign({}, formError);
        for (let field in formData) {
            if (!formValidation[field].test(formData[field])) {
                validation[field].error = true,
                    validation[field].message = formValidation[field].message;
            } else {
                validation[field].error = false;
                validation[field].message = "";
            }
        }

        setFormError(validation);
        return !(validation.email.error || validation.password.error);

    }

    async function requestServer() {
        try {
            const response = axios.post("/api/auth/login", formData);
            successResponse(response);
        } catch (error) {
            errorResponse(error.response);
        } finally {
            setLoading(false);
        }
    }

    function successResponse(response) {
        handleOpenSnackbar(response.data.message, "success");
        setTimeout(() => {
            return redirect("/internal");
        }, [1000])
    }

    function errorResponse(response) {
        handleOpenSnackbar(response.data.message, "error");

        let response_errors = {};
        for (let field in response.data.errors) {
            response_errors[field] = {
                error: true,
                message: response.data.errors[field][0]
            }
        }

        setFormError(response_errors);
    }

    function handleInputChange(e) {
        setFormData({ ...formData, [e.target.name]: e.currentTarget.value });
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
                            helperText={formError.email.message}
                            error={formError.email.error}
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
                            helperText={formError.password.message}
                            error={formError.password.error}
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