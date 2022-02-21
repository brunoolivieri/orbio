// IMPORTAÇÃO DOS COMPONENTES REACT
import { useState } from 'react';
import { Link } from 'react-router-dom';

// IMPORTAÇÃO DOS COMPONENTES CUSTOMIZADOS
import AxiosApi from '../../../../services/AxiosApi';
import { FormValidation } from '../../../../services/FormValidation';

// IMPORTAÇÃO DOS COMPONENTES MATERIALUI
import * as React from 'react';
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

export function Login(){

// ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

    // States utilizados nas validações dos campos 
    const [errorDetected, setErrorDetected] = useState({email: false, password: false}); // State para o efeito de erro - true ou false
    const [errorMessage, setErrorMessage] = useState({email: null, password: null}); // State para a mensagem do erro - objeto com mensagens para cada campo

    // State do alerta
    const [displayAlert, setDisplayAlert]= useState({display: false, message: ""});

// ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

    /*
    * Rotina 1A
    * Ponto inicial do processamento do envio do formulário de login
    * Recebe os dados do formulário, e transforma em um objeto da classe FormData
    * A próxima rotina, 2, validará esses dados
    */ 
    function handleLoginSubmit(event) {
        event.preventDefault();

        // Instância da classe JS FormData - para trabalhar os dados do formulário
        const data = new FormData(event.currentTarget);

        // Validação dos dados do formulário
        // A comunicação com o backend só é realizada se o retorno for true
        if(dataValidate(data)){

            // Inicialização da requisição para o servidor
            requestServerOperation(data);

        }

    }

    /*
    * Rotina 2
    * Validação dos dados no frontend
    * Recebe o objeto Event do evento onSubmit, e o formulário a ser validado
    * Se a validação não falhar, a próxima rotina, 3, é a da comunicação com o Laravel 
    */
    function dataValidate(formData){

        // Padrão de um email válido
        const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        // Validação dos dados - true para presença de erro e false para ausência
        // Se utilizada a função FormValidation é retornado um objeto com dois atributos: "erro" e "message"
        // Se o atributo "erro" for true, um erro foi detectado, e o atributo "message" terá a mensagem sobre a natureza do erro
        const emailValidate = FormValidation(formData.get("login_email_input"), null, null, emailPattern, "EMAIL");
        const passwordValidate = FormValidation(formData.get("login_password_input"), null, null, null, null);

        // Atualização dos estados responsáveis por manipular os inputs
        setErrorDetected({email: emailValidate.error, password: passwordValidate.error});
        setErrorMessage({email: emailValidate.message, password: passwordValidate.message});

        // Se o email ou a senha estiverem errados
        if(emailValidate.error === true || passwordValidate.error === true){

            return false;

        }else{

            return true;

        }

    }

    /*
    * Rotina 3
    * Comunicação AJAX com o Laravel utilizando AXIOS
    * Após o recebimento da resposta, é chamada próxima rotina, 4, de tratamento da resposta do servidor
    */
    function requestServerOperation(data){

        AxiosApi.post("/api/acessar", {
            email: data.get("login_email_input"),
            password: data.get("login_password_input")
          })
          .then(function (response) {

            console.log(response)

            // Tratamento da resposta do servidor
            serverResponseTreatment(response);

          })
          .catch(function (error) {

            // Tratamento da resposta do servidor
            serverResponseTreatment(error.response);

        });

    }

    /*
    * Rotina 4
    * Tratamento da resposta do servidor
    * Se for um sucesso, o usuário é redirecionado para a rota do sistema
    */
    function serverResponseTreatment(response){  
        
        if(response.status === 200){

            // Armazena o Token JWT
            localStorage.removeItem('user_authenticated_token');
            localStorage.setItem('user_authenticated_token', JSON.stringify(response.data.token));

            window.location.href = "/sistema"; 

        }else{

            if(response.data.error == "email_not_exists" || response.data.error == "password"){

                setDisplayAlert({display: true, message: "Email ou senha incorretos."});

            }else if(response.data.error == "activation"){

                setDisplayAlert({display: true, message: "Houve um erro na ativação da conta. Tente novamente ou contate o suporte."});

            }else if(response.data.error == "token"){

                setDisplayAlert({display: true, message: "Erro na autenticação. Tente novamente ou contate o suporte."});

            }else if(response.data.error == "account_disabled"){
                
                setDisplayAlert({display: true, message: "Essa conta foi desativada. Entre em contato com o suporte para reativá-la."});

            }else if(response.data.error == "server"){

                setDisplayAlert({display: true, message: "Erro do servidor! Tente novamente ou contate o suporte."});

            }

        }

    }

// ============================================================================== ESTRUTURAÇÃO DA PÁGINA - COMPONENTES DO MATERIAL UI ============================================================================== //

    return(

        <>     
        <Grid container component="main" sx={{ height: '100vh' }}>
            <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
                backgroundImage: 'url(https://news.microsoft.com/wp-content/uploads/prod/sites/42/2018/05/DJI_Hero-1920x1080.jpg)',
                backgroundRepeat: 'no-repeat',
                backgroundColor: (t) =>
                t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
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
                <Avatar sx={{ m: 1, color: "black", bgcolor: blue[50], border: "black"}}>
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
                    helperText = {errorMessage.email}
                    error = {errorDetected.email}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="login_password_input"
                    label="Digite a sua senha"
                    type="password"
                    id="login_password_input"
                    helperText = {errorMessage.password}
                    error = {errorDetected.password}
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
                >
                    Acessar
                </Button>
                <Grid container sx={{mb: 2}}>
                    <Grid item xs >
                    <Link to ="/recuperarsenha">
                        Esqueceu a senha?
                    </Link>
                    </Grid>
                </Grid>
                {displayAlert.display && 
                <Alert severity="error" fullWidth>{displayAlert.message}</Alert> 
                }
                </Box>
            </Box>
            </Grid>
        </Grid>
        </>
    )
}