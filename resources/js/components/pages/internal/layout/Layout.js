// IMPORTAÇÃO DOS COMPONENTES REACT
import { useEffect, useState } from "react"; // Hook useEffect

// IMPORTAÇÃO DOS COMPONENTES CUSTOMIZADOS
import { useAuthentication } from "../../../context/InternalRoutesAuth/AuthenticationContext"; // State global de autenticação
import AxiosApi from "../../../../services/AxiosApi"; // Axios para comunicação com o backend via AJAX
import Navigator from './Navigator';
import Header from './Header';
import { ScreenDarkFilter } from "../../../structures/screenDarkFilter/ScreenDarkFilter";
import { InternalRoutes } from "../../../../routes/ReactRouter";

// IMPORTAÇÃO DOS COMPONENTES MATERIALUI
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { useTheme } from "@emotion/react";
import { makeStyles } from "@mui/styles";

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
    backgroundColor: theme.palette.mode == 'light' ? '#eaeff1' : '#1A1919'
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
      const [operationStatus, setOperationStatus] = useState({type: null, status: null, tittle:null, message: null});

      // Classes do objeto makeStyles
      const classes = useStyles();

// ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

      useEffect(() => {

        // Ativação da tela de login com o componente ScreenDarkFilter
        setOperationStatus({type: "loading", status: true, tittle: "Processando....", message: null});

        // Decodificação do token JWT
        // Se falhar, o usuário é redirecionado para a página de acesso
        AxiosApi.post("/api/get-token-data", {
          token: tokenJWT
          })
          .then(function (response) {
  
          if(response.status === 200){

             // Preenchimento do state global de autenticação com os dados do Token decodificado
             setAuthData({status: true, data: response.data.tokenData});

             // Desaparece a tela de carregamento
             setOperationStatus({type: null, status: null, tittle: null, message: null}); 
        
          }else if(response.status === 500){

              // Token é removido do localstorage
              localStorage.removeItem('user_authenticated_token');

              // Aparece um Modal alertando sobre o erro
              // Neste caso, a autenticação do Token JWT falhou
              setOperationStatus({type: "token_jwt", status: false, tittle: "Acesso não autorizado!", message: "Houve um erro na sua autenticação. Tente novamente ou contate o suporte."});
  
          }
  
          })
          .catch(function (error) {

            // Token é removido do localstorage
            localStorage.removeItem('user_authenticated_token');

            // Aparece um Modal alertando sobre o erro
            // Neste caso, a autenticação do Token JWT falhou
            setOperationStatus({type: "token_jwt", status: false, tittle: "Acesso não autorizado!", message: "Houve um erro na sua autenticação. Tente novamente ou contate o suporte."});
  
          });

      },[]);

      const [menuOpen, setMenuOpen] = useState(true);

      const handleDrawerToggle = () => {
        setMenuOpen(!menuOpen);
      };

  // =============================================================== //

  /*

  - A estruturação da página é realizada apenas apenas a confirmação do Token do usuário
  - E também é realizado dessa forma para impedir que a estrutura monte antes da validação do Token

  */

  return (
    <>
    {/* Renderização condicional do componente ScreenDarkFilter */}
    {operationStatus.type != null && <ScreenDarkFilter {...operationStatus} />}

    {AuthData.status ? 
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
            <InternalRoutes /> 

          </Box>
          <Box component="footer" sx={{ p: 2, bgcolor: theme.palette.mode == 'light' ? '#eaeff1' : '#1A1919' }}>
            <Copyright />
          </Box>
        </Box>
      </Box> : ""}
    </>

  ) 

}