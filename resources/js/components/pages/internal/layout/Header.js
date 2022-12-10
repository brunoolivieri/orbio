import * as React from 'react';
// Material UI
import { AppBar, IconButton, Toolbar, Box, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MapIcon from '@mui/icons-material/Map';
import HelpIcon from '@mui/icons-material/Help';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ReportIcon from '@mui/icons-material/Report';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import PropTypes from 'prop-types';
// Custom
import { HeaderMenu } from "../../../shared/header_menu/HeaderMenu";
import { usePage } from '../../../context/PageContext';

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

  const { onDrawerToggle } = props;
  const { pageIndex } = usePage();

  const pages = [
    { icon: <DashboardIcon />, title: "DASHBOARD" },
    { icon: <AdminPanelSettingsIcon sx={{ mr: 1 }} />, title: "ADMINISTRAÇÃO" },
    { icon: <MapIcon sx={{ mr: 1 }} />, title: "PLANOS DE VOO E LOGS" },
    { icon: <AssignmentIcon sx={{ mr: 1 }} />, title: "ORDENS DE SERVIÇO" },
    { icon: <AssessmentIcon sx={{ mr: 1 }} />, title: "RELATÓRIOS" },
    { icon: <ReportIcon sx={{ mr: 1 }} />, title: "INCIDENTES" },
    { icon: <HomeRepairServiceIcon sx={{ mr: 1 }} />, title: "EQUIPAMENTOS" },
    { icon: <HelpIcon sx={{ mr: 1 }} />, title: "SUPORTE" },
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
          <HeaderMenu />
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