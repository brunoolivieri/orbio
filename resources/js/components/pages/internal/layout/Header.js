// IMPORTAÇÃO DOS COMPONENTES CUSTOMIZADOS
import { usePagination } from '../../../context/Pagination/PaginationContext';
import {HeaderMenu} from "../../../structures/header_menu/HeaderMenu";
import { ColorModeToggle } from '../../../structures/color_mode/ToggleColorMode';

// IMPORTAÇÃO DOS COMPONENTES MATERIALUI
import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { makeStyles } from "@mui/styles";
import { Icon } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  header_top: {
    background: theme.palette.mode == 'light' ? '#101F33' : '#121212',
    boxShadow: '1px -1px 11px 0px rgba(0,0,0,0.75)',
  },
  header_bottom: {
    background: theme.palette.mode == 'light' ? '#fff' : '#1E1E1E',
    boxShadow: '1px -1px 11px 0px rgba(0,0,0,0.75)',
    color: theme.palette.mode == 'light' ? '#121212' : '#fff',
  }
}));

function Header(props) {

  const { onDrawerToggle } = props;

  const {actualPage}= usePagination();

  // Classes do objeto makeStyles
  const classes = useStyles();

  return (
    <>
      <AppBar position="sticky" elevation={0}>
        <Toolbar className={classes.header_top}>
          <Grid container spacing={1} alignItems="center">
            <Grid item>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={onDrawerToggle}
                edge="start"
              >
                <MenuIcon />
              </IconButton>
            </Grid>
            <Grid item xs />
            <Grid item>
              <ColorModeToggle />
            </Grid>
            <Grid item>
              <HeaderMenu />
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <AppBar
        component="div"
        color="primary"
        position="static"
        elevation={0}
        sx={{ zIndex: 0 }}
      >
        <Toolbar className={classes.header_bottom}>
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs>
              <Typography color="inherit" variant="h5" component="h1">
                {actualPage}
              </Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </>
  );
}

Header.propTypes = {
  onDrawerToggle: PropTypes.func.isRequired,
};

export default Header;