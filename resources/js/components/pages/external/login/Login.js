// React
import * as React from 'react';
// Custom
import AxiosApi from '../../../../services/AxiosApi';
import { FormValidation } from '../../../../utils/FormValidation';
import { ColorModeToggle } from '../../../structures/color_mode/ToggleColorMode';
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

    // States utilizados nas validações dos campos 
    const [errorDetected, setErrorDetected] = React.useState({ email: false, password: false }); // State para o efeito de erro - true ou false
    const [errorMessage, setErrorMessage] = React.useState({ email: null, password: null }); // State para a mensagem do erro - objeto com mensagens para cada campo

    // State do alerta
    const [displayAlert, setDisplayAlert] = React.useState({ display: false, type: "error", message: "" });

    // Para desabilitar o botão de login
    const [disabled, setDisabled] = React.useState(false);

    // Classes do objeto makeStyles
    const classes = useStyles();

    // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

    /*
    * Rotina 1A
    * Ponto inicial do processamento do envio do formulário de login
    * Recebe os dados do formulário, e transforma em um objeto da classe FormData
    * A próxima rotina, 2, validará esses dados
    */
    function handleLoginSubmit(event) {
        event.preventDefault();

        const data = new FormData(event.currentTarget);

        setDisabled(true);

        if (dataValidate(data)) {

            requestServerOperation(data);

        }

    }

    /*
    * Rotina 2
    * Validação dos dados no frontend
    * Recebe o objeto Event do evento onSubmit, e o formulário a ser validado
    * Se a validação não falhar, a próxima rotina, 3, é a da comunicação com o Laravel 
    */
    function dataValidate(formData) {

        const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

        const emailValidate = FormValidation(formData.get("login_email_input"), null, null, emailPattern, "EMAIL");
        const passwordValidate = FormValidation(formData.get("login_password_input"), null, null, null, null);

        setErrorDetected({ email: emailValidate.error, password: passwordValidate.error });
        setErrorMessage({ email: emailValidate.message, password: passwordValidate.message });

        if (emailValidate.error === true || passwordValidate.error === true) {

            return false;

        } else {

            return true;

        }

    }

    /*
    * Rotina 3
    * Comunicação AJAX com o Laravel utilizando AXIOS
    * Após o recebimento da resposta, é chamada próxima rotina, 4, de tratamento da resposta do servidor
    */
    function requestServerOperation(data) {

        AxiosApi.post("/api/acessar", {
            email: data.get("login_email_input"),
            password: data.get("login_password_input")
        })
            .then(function (response) {

                successServerResponseTreatment(response.data);

            })
            .catch(function (error) {

                errorServerResponseTreatment(error.response.data);

            });

    }

    /*
    * Rotina 4A
    * Tratamento da requisição bem sucedida
    */
    function successServerResponseTreatment(response_data) {

        setDisplayAlert({ display: true, type: "success", message: response_data.message });

        setTimeout(() => {
            window.location.href = "/sistema";
        }, [1000])

    }

    /*
    * Rotina 4B
    * Tratamento da requisição que falhou
    */
    function errorServerResponseTreatment(response_data) {

        setDisabled(false);

        // Erros automatizados

        // Definição dos objetos de erro possíveis de serem retornados pelo validation do Laravel
        let input_errors = {
            email: { error: false, message: null },
            password: { error: false, message: null }
        }

        // Coleta dos objetos de erro existentes na response
        for (let prop in response_data.errors) {

            input_errors[prop] = {
                error: true,
                message: response_data.errors[prop][0]
            }

        }

        setErrorDetected({ email: input_errors.email.error, password: input_errors.password.error });
        setErrorMessage({ email: input_errors.email.message, password: input_errors.password.message });

        // Erros customizados

        if (response_data.error == "activation") {

            setDisplayAlert({ display: true, type: "error", message: "Houve um erro na ativação da conta. Tente novamente ou contate o suporte." });

        } else if (response_data.error == "token") {

            setDisplayAlert({ display: true, type: "error", message: "Erro na autenticação. Tente novamente ou contate o suporte." });

        } else if (response_data.error == "account_disabled") {

            setDisplayAlert({ display: true, type: "error", message: "Essa conta foi desativada. Entre em contato com o suporte para reativá-la." });

        } else if (response_data.error == "invalid_credentials") {

            setDisplayAlert({ display: true, type: "error", message: "Email ou senha incorretos." });

        } else {

            setDisplayAlert({ display: true, type: "error", message: "A operação falhou! Tente novamente ou contate o suporte." });

        }

    }

    // ============================================================================== ESTRUTURAÇÃO DA PÁGINA - COMPONENTES DO MATERIAL UI ============================================================================== //

    return (

        <>
            <Box sx={{ position: 'absolute', right: '10px', top: '10px' }}>
                <ColorModeToggle />
            </Box>
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
                                id="login_email_input"
                                label="Digite o seu email"
                                name="login_email_input"
                                autoFocus
                                helperText={errorMessage.email}
                                error={errorDetected.email}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="login_password_input"
                                label="Digite a sua senha"
                                type="password"
                                id="login_password_input"
                                helperText={errorMessage.password}
                                error={errorDetected.password}
                            />
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Lembrar"
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                color="primary"
                                disabled={disabled}
                            >
                                Acessar
                            </Button>
                            <Grid container sx={{ mb: 2 }}>
                                <Grid item xs >
                                    <Link to="/recuperarsenha" className={classes.hiperlink}>
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