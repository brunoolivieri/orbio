import * as React from 'react';
// Material UI
import Box from '@mui/material/Box';
// Custom
import { InternalRoutes } from "../../../../routes/index";
import { useAuth } from '../../../context/Auth';
import { NavigatorToggle } from './NavigatorToggle';
import { NavigatorFixed } from './NavigatorFixed';
import { Header } from './Header';
import { BackdropLoading } from "../../../shared/backdrop/BackdropLoading";

const drawerWidth = 265;

export const Layout = () => {

  // ================== STATES =================== //

  const [loading, setLoading] = React.useState(true);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { user, isAuthenticated, verifyAuthentication, logout } = useAuth();

  // =========================================== FUNCTIONS ======================= //

  React.useEffect(() => {

    const fetch = async () => {
      await verifyAuthentication();
      setLoading(false);
    }

    fetch();

  }, []);

  function handleDrawerToggle() {
    setMenuOpen(!menuOpen);
  }

  // ================ JSX  ============= //

  if (loading) {
    return <BackdropLoading />;
  }

  if (loading && !isAuthenticated) {
    logout();
  }

  if (!loading && isAuthenticated) {

    return (
      <>
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#FCFCFC' }}>
          <NavigatorFixed />
          <Box
            component="nav"
            sx={{ flexShrink: { sm: 0 } }}
          >

            <NavigatorToggle
              PaperProps={{ style: { width: drawerWidth } }}
              variant="temporary"
              open={menuOpen}
              onClose={handleDrawerToggle}
            />

          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Header onDrawerToggle={handleDrawerToggle} />
            <Box component="main" sx={{ flexGrow: 1, py: 6, px: 4 }}>

              <InternalRoutes />

            </Box>
            <Box component="footer">
              {/* <Copyright /> */}
            </Box>
          </Box>
        </Box>
      </>
    )
  }
}