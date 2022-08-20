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
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

export const Header = React.memo(({ ...props }) => {

  const { onDrawerToggle } = props;

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: '#fff' }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={onDrawerToggle}
          >
            <FontAwesomeIcon icon={faBars} color="#007937" />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Typography variant="h1" sx={{ fontSize: '20px', color: '#007937' }}>{props.page}</Typography>
          </Typography>
          <HeaderMenu />
        </Toolbar>
      </AppBar>
    </>
  );
});

Header.propTypes = {
  onDrawerToggle: PropTypes.func.isRequired,
};