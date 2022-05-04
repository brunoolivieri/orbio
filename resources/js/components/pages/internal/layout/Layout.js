// REACT
import { useEffect, useState } from "react"; // Hook useEffect

// CUSTOM
import { useAuthentication } from "../../../context/InternalRoutesAuth/AuthenticationContext"; // State global de autenticação
import AxiosApi from "../../../../services/AxiosApi"; // Axios para comunicação com o backend via AJAX
import Navigator from './Navigator';
import Header from './Header';
import { InternalRoutes } from "../../../../routes/ReactRouter";
import { BackdropLoading } from "../../../structures/backdrop_loading/BackdropLoading";
import { GenericModalDialog } from "../../../structures/generic_modal_dialog/GenericModalDialog";

// MATERIALUI
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { useTheme } from "@emotion/react";
import { makeStyles } from "@mui/styles";

// ASSETS
import error_image from "../../../assets/images/error/error.png";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      <Link color="inherit" href="https://www.embrapa.br/">
        Embrapa
      </Link>{' '}
      {new Date().getFullYear()}.
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.mode == 'light' ? '#eaeff1' : '#1A1919',
    "&.MuiPaper-root":{
      backgroundColor:"#333" // Teste
    }
  }
}))


const drawerWidth = 256;

export function Layout() {

// ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

      const theme = useTheme();

      // Utilizador do state global de autenticação
      const {AuthData, setAuthData} = useAuthentication();

      // Recuperação do token JWT
      const tokenJWT = localStorage.getItem('user_authenticated_token');

      // State da realização da operação - ativa o Modal informativo sobre o estado da operação 
      // Neste caso, a operação é a verificação do token JWT
      const [operationStatus, setOperationStatus] = useState({type: null, title:null, message: null, image: null});

      // Classes do objeto makeStyles
      const classes = useStyles();

// ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

      useEffect(() => {

        setOperationStatus({type: "loading", title: "Processando....", message: null});

        AxiosApi.post("/api/get-token-data", {
          token: tokenJWT
          })
          .then(function (response) {
  
          if(response.status === 200){

            setAuthData({status: true, data: response.data.tokenData});

            setOperationStatus({type: null, title: null, message: null, image: null}); 
        
          }else if(response.status === 500){

            localStorage.removeItem('user_authenticated_token');

            setOperationStatus({type: "auth_error", title: "Acesso não autorizado!", message: "Houve um erro na sua autenticação. Tente novamente ou contate o suporte.", image: error_image});
  
          }
  
          })
          .catch(function (error) {

            localStorage.removeItem('user_authenticated_token');

            setOperationStatus({type: "auth_error", title: "Acesso não autorizado!", message: "Houve um erro na sua autenticação. Tente novamente ou contate o suporte.", image: error_image});
  
          });

      },[]);

      const [menuOpen, setMenuOpen] = useState(false);

      const handleDrawerToggle = () => {
        setMenuOpen(!menuOpen);
      };

  // =============================================================== //

  return (

    <>
      {operationStatus.type == "loading" &&
        <BackdropLoading />
      }

      {operationStatus.type == "auth_error" &&
        <GenericModalDialog 
        modal_controller = {{state: true, setModalState: null, counter: {required: false}}}
        title = {{top: {required: true, text: operationStatus.title}, middle: {required: false}}}
        image = {{required: true, src: operationStatus.image}}
        content_text = {operationStatus.message}
        actions = {{
            required: true, 
            close_button_text: {
              required: false
            }, 
            confirmation_default_button: {
                required: false
            },
            confirmation_button_with_link:{
                required: true,
                href: "/acessar",
                text: "Voltar para o login"
            }
        }}
        />
      }

      {AuthData.status && 
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          <Box
            component="nav"
            sx={{flexShrink: { sm: 0 }}}
          >
            
            <Navigator
              PaperProps={{ style: { width: drawerWidth } }}
              variant="temporary"
              open={menuOpen}
              onClose={handleDrawerToggle}
            />

        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Header onDrawerToggle={handleDrawerToggle} />
          <Box component="main" sx={{ flex: 1, py: 6, px: 4 }} className={classes.root}>

            {/* Conteúdo variável de cada página */}
            {AuthData.status && 
              <InternalRoutes /> 
            }
  
          </Box>
          <Box component="footer" sx={{ p: 2, bgcolor: theme.palette.mode == 'light' ? '#eaeff1' : '#1A1919' }}>
            <Copyright />
          </Box>
        </Box>
      </Box> 
      }
    </>

  ) 

}