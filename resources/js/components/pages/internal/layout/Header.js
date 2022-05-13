// React 
import * as React from 'react';
// Custom
import { usePagination } from '../../../context/Pagination/PaginationContext';
import { HeaderMenu } from "../../../structures/header_menu/HeaderMenu";
// Material UI
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import { Typography } from '@mui/material';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

export const Header = React.memo((props) => {

  const { onDrawerToggle } = props;

  const { actualPage } = usePagination();

  return (
    <>
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{backgroundColor: '#00458C'}}>
          <Grid container spacing={1} alignItems="center">
            <Grid item>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={onDrawerToggle}
                edge="start"
              >
                <FontAwesomeIcon icon={faBars} />
              </IconButton>
            </Grid>
            <Grid item xs />
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
        <Toolbar sx={{backgroundColor: '#00458C'}}>
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs sx={{color: "#fff"}}>
              <Typography variant="h1" fontSize={'20px'}>{actualPage}</Typography> 
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </>
  );
});

Header.propTypes = {
  onDrawerToggle: PropTypes.func.isRequired,
};