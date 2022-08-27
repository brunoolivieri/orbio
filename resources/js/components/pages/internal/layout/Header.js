// React 
import * as React from 'react';
// Custom
import { HeaderMenu } from "../../../structures/header_menu/HeaderMenu";
// Material UI
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import { Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

export const Header = React.memo(({ ...props }) => {

  const { onDrawerToggle } = props;

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: '#fff', boxShadow: 2, zIndex: 1 }}>
        <Toolbar>
          <IconButton
            size="large"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={onDrawerToggle}
          >
            <MenuIcon color="success" />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          </Typography>
          <HeaderMenu />
        </Toolbar>
      </AppBar>
      <AppBar position="static" sx={{ boxShadow: 1 }}>
        <Toolbar>
          <AdminPanelSettingsIcon sx={{ mr: 1 }} /><Typography variant="h5" color={"#fff"}>DASHBOARD</Typography>
        </Toolbar>
      </AppBar>
    </>
  );
});

Header.propTypes = {
  onDrawerToggle: PropTypes.func.isRequired,
};