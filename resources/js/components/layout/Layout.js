import * as React from 'react';
// MUI
import { Box } from "@mui/material";
import { useSnackbar } from 'notistack';
// Custom
import { useAuth } from '../../context/Auth';
import { MenuMobile } from './MenuMobile';
import { MenuDesktop } from './MenuDesktop';
import { MobileHeader } from './MobileHeader';
import { BackdropLoading } from "../../components/backdrop/BackdropLoading";
import { SubHeader } from './SubHeader';

const drawerWidth = 265;

export const Layout = ({ children }) => {

  // ================== STATES =================== //

  const [loading, setLoading] = React.useState(true);
  const [menuOpen, setMenuOpen] = React.useState(false);

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

  function handleDrawerToggle() {
    setMenuOpen(!menuOpen);
  }

  // ================ STRUCTURES  ============= //

  if (loading) {
    return <BackdropLoading />;
  }

  if (!loading && isAuthenticated) {

    return (
      <>
        <Box className='flex min-h-screen'>
          <MenuDesktop />
          <Box
            component="nav"
            sx={{ flexShrink: { sm: 0 } }}
          >
            <MenuMobile
              PaperProps={{ style: { width: drawerWidth } }}
              variant="temporary"
              open={menuOpen}
              onClose={handleDrawerToggle}
            />
          </Box>
          <Box className="grow bg-white dark:bg-[#1F2937]">
            <MobileHeader onDrawerToggle={handleDrawerToggle} />
            <SubHeader />
            <Box component="main" className='grow max-w-full m-auto overflow-hidden'>

              {children}

            </Box>
          </Box>
        </Box>
      </>
    )
  }
}