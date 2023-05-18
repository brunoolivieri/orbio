import * as React from 'react';
// MUI
import { Box } from "@mui/material";
import { useSnackbar } from 'notistack';
// Custom
import { useAuth } from '../../context/Auth';
import { Menu } from './Menu';
import { BackdropLoading } from "../../components/backdrop/BackdropLoading";
import { SubHeader } from './SubHeader';

export const Layout = ({ children }) => {

  // ================== STATES =================== //

  const [loading, setLoading] = React.useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const { isAuthenticated, verifyAuthentication, logout } = useAuth();

  // =========================================== FUNCTIONS ======================= //

  React.useEffect(() => {
    const fetch = async () => {
      try {
        await verifyAuthentication();
        setLoading(false);
      } catch (error) {
        console.log(error.message)
        await logout();
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      }
    }
    fetch();
  }, []);

  // ================ STRUCTURES  ============= //

  if (loading) {
    return <BackdropLoading />;
  }

  if (!loading && isAuthenticated) {

    return (
      <Box className='flex min-h-screen'>
        <Menu />
        <Box className="grow bg-white">
          <SubHeader />
          <Box component="main" className='grow w-full m-auto overflow-hidden'>
            {children}
          </Box>
        </Box>
      </Box>
    )
  }
}