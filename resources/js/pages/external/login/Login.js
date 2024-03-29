import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, TextField, Box, Grid, Typography, Container, Avatar } from '@mui/material';
import { useSnackbar } from 'notistack';
import LockIcon from '@mui/icons-material/Lock';
import { useAuth } from '../../../context/Auth';
import { FormValidation } from '../../../utils/FormValidation';

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
const initialFormError = {
    email: { error: false, message: "", test: (value) => FormValidation(value, null, null, /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Email") },
    password: { error: false, message: "", test: (value) => FormValidation(value, 3, 255, null, "Senha") }
};

export function Login() {

    // ============================================================================== VARIABLES ============================================================================== //

    const [formData, setFormData] = React.useState(initialFormData);
    const [formError, setFormError] = React.useState(initialFormError);
    const [loading, setLoading] = React.useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();
    const { enqueueSnackbar } = useSnackbar();

    // ============================================================================== ROUTINES ============================================================================== //

    function handleSubmit() {
        if (!formSubmissionValidation()) {
            return;
        }
        setLoading(true);
        requestServer();
    }

    function formSubmissionValidation() {
        let validation = Object.assign({}, initialFormError);
        let is_valid = true;
        for (let field in formData) {

            const test = validation[field].test(formData[field]);
            validation[field].error = test.error;
            validation[field].message = test.message;

            if (test.error) {
                is_valid = false;
            }
        }
        setFormError(validation);
        return is_valid;
    }

    async function requestServer() {
        try {
            await login(formData);
            navigate("/dashboard", { replace: true });
        } catch (error) {
            console.log(error.message);
            enqueueSnackbar(error.response.data.message, { variant: "error" });
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

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, borderRadius: 1 }}
                            color="primary"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? "Verificando..." : "Acessar"}
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