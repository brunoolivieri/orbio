// React 
import * as React from 'react';
// Custom
import { HeaderMenu } from "../../../structures/header_menu/HeaderMenu";
import { usePage } from '../../../context/PageContext';
// Material UI
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import { Box, Typography } from '@mui/material';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MapIcon from '@mui/icons-material/Map';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HelpIcon from '@mui/icons-material/Help';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ReportIcon from '@mui/icons-material/Report';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';

export const Header = React.memo(({ ...props }) => {

  const { onDrawerToggle } = props;

  const { pageIndex } = usePage();

  const pages = [
    { icon: <DashboardIcon />, title: "DASHBOARD" },
    { icon: <AdminPanelSettingsIcon sx={{ mr: 1 }} />, title: "ADMINISTRAÇÃO" },
    { icon: <MapIcon sx={{ mr: 1 }} />, title: "PLANOS DE VOO" },
    { icon: <AssignmentIcon sx={{ mr: 1 }} />, title: "ORDENS DE SERVIÇO" },
    { icon: <AssessmentIcon sx={{ mr: 1 }} />, title: "LOGS E RELATÓRIOS" },
    { icon: <ReportIcon sx={{ mr: 1 }} />, title: "INCIDENTES" },
    { icon: <HomeRepairServiceIcon sx={{ mr: 1 }} />, title: "EQUIPAMENTOS" },
    { icon: <HelpIcon sx={{ mr: 1 }} />, title: "SUPORTE" },
    { icon: <AccountCircleIcon sx={{ mr: 1 }} />, title: "MINHA CONTA" }
  ];

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: '#fff', boxShadow: 2, zIndex: 1 }}>
        <Toolbar>
          <IconButton
            size="large"
            aria-label="menu"
            onClick={onDrawerToggle}
          >
            <MenuOpenIcon color="success" />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          </Typography>
          <HeaderMenu />
        </Toolbar>
      </AppBar>
      <AppBar position="static" sx={{ boxShadow: 1, bgcolor: '#16529B' }}>
        <Toolbar>
          <Typography sx={{ mr: 1, ml: 1 }}>{pages[pageIndex].icon}</Typography>
          <Box>
            <Typography variant="h7" fontWeight={600} color={"#fff"}>{pages[pageIndex].title}</Typography>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
});

Header.propTypes = {
  onDrawerToggle: PropTypes.func.isRequired,
};