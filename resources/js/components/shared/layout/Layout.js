import * as React from 'react';
// Material UI
import { Tooltip, IconButton, Grid, TextField, InputAdornment, Box, Chip, Paper } from "@mui/material";
// Custom
import { InternalRoutes } from '../../../routes/index';
import { useAuth } from '../../context/Auth';
import { MenuMobile } from './MenuMobile';
import { MenuDesktop } from './MenuDesktop';
import { Header } from './Header';
import { BackdropLoading } from "../backdrop/BackdropLoading";

const drawerWidth = 265;

export const Layout = () => {

  // ================== STATES =================== //

  const [loading, setLoading] = React.useState(true);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { isAuthenticated, verifyAuthentication, logout } = useAuth();

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
          <Box sx={{ flexGrow: 1 }}>
            <Header onDrawerToggle={handleDrawerToggle} />
            <Box component="main" sx={{ flexGrow: 1, py: 6, px: 4 }}>

              <Paper sx={{ maxWidth: "100%", margin: 'auto', overflow: 'hidden' }}>
                <InternalRoutes />
              </Paper>

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