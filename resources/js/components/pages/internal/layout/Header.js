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
import { Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

export const Header = React.memo(({ ...props }) => {

  const { onDrawerToggle } = props;

  const { page } = usePage();

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
      <AppBar position="static" sx={{ boxShadow: 1, bgcolor: '#16529B' }}>
        <Toolbar>
          {page &&
            <>
              <AdminPanelSettingsIcon sx={{ mr: 1 }} /><Typography variant="h7" fontWeight={600} color={"#fff"}>{page}</Typography>
            </>
          }

        </Toolbar>
      </AppBar>
    </>
  );
});

Header.propTypes = {
  onDrawerToggle: PropTypes.func.isRequired,
};