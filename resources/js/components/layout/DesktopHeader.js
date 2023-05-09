import * as React from 'react';
// Mui
import { Box, Toolbar, Typography, IconButton, styled } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';

const drawerWidth = 210;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

export function DesktopHeader(props) {

    function handleToggleTheme() {
        document.body.classList.toggle("dark");
    }

    return (
        <AppBar position="fixed" open={open}>
            <Toolbar className='flex justify-between items-center'>
                <Box className="flex items-center">
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={() => props.handleDrawerOpen()}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon className='text-white' />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        ORBIO
                    </Typography>
                </Box>
                <IconButton
                    onClick={handleToggleTheme}
                >
                    <Brightness4Icon className='text-white' />
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}