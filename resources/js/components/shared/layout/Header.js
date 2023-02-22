import * as React from 'react';
import { AppBar, IconButton, Toolbar, Box, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MapIcon from '@mui/icons-material/Map';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssessmentIcon from '@mui/icons-material/Assessment';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import PropTypes from 'prop-types';
import LogoutIcon from '@mui/icons-material/Logout';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// Custom
import { useAuth } from '../../context/Auth';
import { usePage } from '../../context/PageContext';

const headerStyle = {
  boxShadow: 2,
  zIndex: 1,
  bgcolor: '#004795'
}

const subHeaderStyle = {
  boxShadow: 1,
  bgcolor: '#FCFCFC',
  color: '#007937'
}

const menuOpenIconStyle = {
  color: '#fff'
}

export const Header = React.memo((props) => {

  const navigate = useNavigate();
  const { pageIndex } = usePage();
  const { enqueueSnackbar } = useSnackbar();
  const { logout } = useAuth();
  const { onDrawerToggle } = props;

  async function handleLogout() {
    try {
      await logout();
      enqueueSnackbar("Sessão finalizada", { variant: "success" });
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1000);
    } catch (e) {
      console.log(e);
      enqueueSnackbar(e.response.data.message, { variant: "error" });
    }
  }

  const pages = [
    { icon: <DashboardIcon />, title: "DASHBOARD" },
    { icon: <AdminPanelSettingsIcon sx={{ mr: 1 }} />, title: "ADMINISTRAÇÃO" },
    { icon: <MapIcon sx={{ mr: 1 }} />, title: "PLANOS DE VOO E LOGS" },
    { icon: <AssignmentIcon sx={{ mr: 1 }} />, title: "ORDENS DE SERVIÇO" },
    { icon: <AssessmentIcon sx={{ mr: 1 }} />, title: "RELATÓRIOS" },
    { icon: <HomeRepairServiceIcon sx={{ mr: 1 }} />, title: "EQUIPAMENTOS" },
    { icon: <AccountCircleIcon sx={{ mr: 1 }} />, title: "MINHA CONTA" }
  ];

  return (
    <>
      <AppBar position="static" sx={headerStyle}>
        <Toolbar>
          <IconButton
            size="large"
            aria-label="menu"
            onClick={onDrawerToggle}
          >
            <MenuOpenIcon style={menuOpenIconStyle} />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          </Typography>
          <IconButton
            size="large"
            aria-label="menu"
            onClick={handleLogout}
          >
            <LogoutIcon color="success" style={{ color: '#fff' }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <AppBar position="static" sx={subHeaderStyle}>
        <Toolbar>
          <Box>
            <Typography variant="h7" fontWeight={600}>{pages[pageIndex].title}</Typography>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
});

Header.propTypes = {
  onDrawerToggle: PropTypes.func.isRequired,
};