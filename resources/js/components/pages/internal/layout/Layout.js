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
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

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

let theme = createTheme({
  palette: {
    primary: {
      light: '#63ccff',
      main: '#009be5',
      dark: '#006db3',
    },
  },
  typography: {
    h5: {
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: 0.5,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiTab: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
  mixins: {
    toolbar: {
      minHeight: 48,
    },
  },
});

theme = {
  ...theme,
  components: {
    // Barra lateral esquerda
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#081627',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          backgroundColor: "#233143"
        },
        contained: {
          boxShadow: 'none',
          '&:active': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          marginLeft: theme.spacing(1),
        },
        indicator: {
          height: 3,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
          backgroundColor: theme.palette.common.white,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          margin: '0 16px',
          minWidth: 0,
          padding: 0,
          [theme.breakpoints.up('md')]: {
            padding: 0,
            minWidth: 0,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: theme.spacing(1)
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 4,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgb(255,255,255,0.15)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            color: '#4fc3f7',
          },
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: 14,
          fontWeight: theme.typography.fontWeightMedium,
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: 'inherit',
          minWidth: 'auto',
          marginRight: theme.spacing(2),
          '& svg': {
            fontSize: 20,
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          width: 32,
          height: 32,
        },
      },
    },
  },
};

const drawerWidth = 256;

export function Layout() {

      // Utilizador do state global de autenticação
      const {AuthData, setAuthData} = useAuthentication();

      // Recuperação do token JWT
      const tokenJWT = localStorage.getItem('user_authenticated_token');

      // State da realização da operação - ativa o Modal informativo sobre o estado da operação 
      // Neste caso, a operação é a verificação do token JWT
      const [operationStatus, setOperationStatus] = useState({type: null, status: null, tittle:null, message: null});

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

      const [mobileOpen, setMobileOpen] = React.useState(false);
      const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

      const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
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
      <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <CssBaseline />
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          {isSmUp ? null : (
            <Navigator
              PaperProps={{ style: { width: drawerWidth } }}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
            />
          )}

          <Navigator
            PaperProps={{ style: { width: drawerWidth } }}
            sx={{ display: { sm: 'block', xs: 'none' } }}
          />
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Header onDrawerToggle={handleDrawerToggle} />
          <Box component="main" sx={{ flex: 1, py: 6, px: 4, bgcolor: '#eaeff1' }}>

            {/* Conteúdo variável de cada página */}
            <InternalRoutes /> 

          </Box>
          <Box component="footer" sx={{ p: 2, bgcolor: '#eaeff1' }}>
            <Copyright />
          </Box>
        </Box>
      </Box>
      </ThemeProvider> : ""}
    </>

  ) 

}