import * as React from 'react';
// React router dom
import { Link } from 'react-router-dom';
// Material UI
import { Button, TextField, Box, Grid, Typography, Container, Avatar, FormControlLabel, Checkbox } from '@mui/material';
import { useSnackbar } from 'notistack';
import LockIcon from '@mui/icons-material/Lock';
// Custom
import { useAuth } from '../../../context/Auth';
import { FormValidation } from '../../../../utils/FormValidation';

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

export function Login() {

    // ============================================================================== VARIABLES ============================================================================== //

    const [formData, setFormData] = React.useState(initialFormData);
    const [formError, setFormError] = React.useState(initialFormError);
    const [loading, setLoading] = React.useState(false);

    const { login } = useAuth();
    const { enqueueSnackbar } = useSnackbar();

    // ============================================================================== ROUTINES ============================================================================== //

    function handleSubmit() {

        if (!formSubmissionValidation()) return '';

        setLoading(true);
        requestServer();
    }

    function formSubmissionValidation() {

        let validation = Object.assign({}, initialFormError);

        for (let field in formData) {
            if (field === "email") {
                validation[field] = FormValidation(formData[field], null, null, /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Email");
            } else if (field === "password") {
                validation[field] = FormValidation(formData[field], 3, 255, null, "Senha");
            }
        }

        setFormError(validation);
        return !(validation.email.error || validation.password.error);

    }

    async function requestServer() {
        try {
            await login(formData);
        } catch (error) {
            console.log(error);
            enqueueSnackbar(error.response.data.message, { variant: "error" });
        } finally {
            setLoading(false);
        }
    }

    function handleInputChange(e) {
        setFormData({ ...formData, [e.target.name]: e.currentTarget.value });
    }

    // ============================================================================== JSX ============================================================================== //

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