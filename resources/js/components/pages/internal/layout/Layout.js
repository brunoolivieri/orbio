// React
import * as React from 'react';
// Custom
import { useAuthentication } from "../../../context/InternalRoutesAuth/AuthenticationContext"; // State global de autenticação
import AxiosApi from "../../../../services/AxiosApi"; // Axios para comunicação com o backend via AJAX
import { Navigator } from './Navigator';
import { Header } from './Header';
import { InternalRoutes } from "../../../../routes/ReactRouter";
import { BackdropLoading } from "../../../structures/backdrop_loading/BackdropLoading";
import { GenericModalDialog } from "../../../structures/generic_modal_dialog/GenericModalDialog";
// Material UI
import Box from '@mui/material/Box';
// Assets
import ErrorImage from "../../../assets/images/Error/Error_md.png";

const drawerWidth = 265;

export const Layout = React.memo(() => {

  // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

  const { AuthData, setAuthData } = useAuthentication();

  const [operationStatus, setOperationStatus] = React.useState({ type: null, title: null, message: null, image: null });

  const [menuOpen, setMenuOpen] = React.useState(false);

  // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

  React.useEffect(() => {

    setOperationStatus({ type: "loading", title: "Processando....", message: null });

    AxiosApi.post("/api/get-auth-data")
      .then(function (response) {

        setOperationStatus({ type: null, title: null, message: null, image: null });

        setAuthData({ status: true, data: response.data });

      })
      .catch(() => {

        setOperationStatus({ type: "error", title: "Acesso não autorizado!", message: "Houve um erro na sua autenticação. Tente novamente ou contate o suporte.", image: ErrorImage });

        setTimeout(() => {
          window.document.href = "/api/auth/logout";
        }, [3000]);

      });

  }, []);

  const handleDrawerToggle = () => {
    setMenuOpen(!menuOpen);
  };

  // =============================================================== ESTRUTURAÇÃO DA PÁGINA  =============================================================== //

  return (

    <>
      {operationStatus.type == "loading" &&
        <BackdropLoading />
      }

      {operationStatus.type == "error" &&
        <GenericModalDialog
          modal_controller={{ state: true, setModalState: null, counter: { required: false } }}
          title={{ top: { required: true, text: operationStatus.title }, middle: { required: false } }}
          image={{ required: true, src: operationStatus.image }}
          lottie={{ required: false }}
          content_text={operationStatus.message}
          actions={{
            required: false,
            close_button_text: {
              required: false
            },
            confirmation_default_button: {
              required: false
            },
            confirmation_button_with_link: {
              required: false,
            }
          }}
        />
      }

      {AuthData.status &&
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#EAEFF1' }}>
          <Box
            component="nav"
            sx={{ flexShrink: { sm: 0 } }}
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
            <Box component="main" sx={{ flex: 1, py: 6, px: 4 }}>

              {/* Conteúdo variável de cada página */}
              {AuthData.status &&
                <InternalRoutes />
              }

            </Box>
            <Box component="footer">
              {/* <Copyright /> */}
            </Box>
          </Box>
        </Box>
      }
    </>

  )

});