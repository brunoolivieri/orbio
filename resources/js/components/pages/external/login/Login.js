import * as React from 'react';
// React router dom
import { Link, redirect } from 'react-router-dom';
// Material UI
import { Button, TextField, Box, Grid, Typography, Container, Avatar, FormControlLabel, Checkbox } from '@mui/material';
import { useSnackbar } from 'notistack';
import LockIcon from '@mui/icons-material/Lock';
// Custom
import axios from '../../../../services/AxiosApi';

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

const initialFormData = { email: "", password: "" };
const initialFormError = { email: { error: false, message: "" }, password: { error: false, message: "" } };

const formValidation = {
    email: {
        test: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value),
        message: "Email inválido"
    },
    password: {
        test: (value) => value != "",
        message: "Informe a sua senha"
    }
}

export function Login() {

    // ============================================================================== VARIABLES ============================================================================== //

    const [formData, setFormData] = React.useState(initialFormData);
    const [formError, setFormError] = React.useState(initialFormError);
    const [loading, setLoading] = React.useState(false);

    const { enqueueSnackbar } = useSnackbar();

    // ============================================================================== ROUTINES ============================================================================== //

    function handleSubmit() {

        if (!formValidate()) return '';

        setLoading(true);
        requestServer();
    }

    function formValidate() {

        let validation = Object.assign({}, initialFormError);

        for (let field in formData) {
            if (!formValidation[field].test(formData[field])) {
                validation[field].error = true;
                validation[field].message = formValidation[field].message;
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
        enqueueSnackbar(response.data.message, { variant: "success" });

        setTimeout(() => {
            return redirect("/internal");
        }, [1000])
    }

    function errorResponse(response) {
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

    function handleInputChange(e) {
        setFormData({ ...formData, [e.target.name]: e.currentTarget.value });
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

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, borderRadius: 1 }}
                            color="primary"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? "Carregando" : "Login"}
                        </Button>

                        <Grid container>
                            <Grid item>
                                <Link to="/forgot-password" variant="body2" style={{ color: 'inherit' }}>
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