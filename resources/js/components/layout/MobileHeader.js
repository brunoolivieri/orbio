import * as React from 'react';
// MUI
import { AppBar, IconButton, Toolbar, Box } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import PropTypes from 'prop-types';
import LogoutIcon from '@mui/icons-material/Logout';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// Custom
import { useAuth } from '../../context/Auth';

const menuOpenIconStyle = {
  color: '#fff'
}

export const MobileHeader = React.memo((props) => {

  const navigate = useNavigate();
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

  function handleToggleTheme() {
    document.body.classList.toggle("dark");
  }

  return (
    <>
      <AppBar position="static" className='shadow-sm z-1'>
        <Toolbar className='flex justify-between items-center'>
          <IconButton
            size="large"
            onClick={onDrawerToggle}
          >
            <MenuOpenIcon style={menuOpenIconStyle} />
          </IconButton>
          <Box className="flex items-center">
            <IconButton
              onClick={handleToggleTheme}
            >
              <Brightness4Icon className='text-white' />
            </IconButton>
            <IconButton
              size="large"
              onClick={handleLogout}
            >
              <LogoutIcon className='text-white' />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );

});

MobileHeader.propTypes = {
  onDrawerToggle: PropTypes.func.isRequired,
};