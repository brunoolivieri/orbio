import * as React from 'react';
// Mui
import { Box, Toolbar, Typography, IconButton, styled } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';

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

    return (
        <AppBar position="fixed" open={props.open} sx={{ bgcolor: "#00458C" }}>
            <Toolbar className='flex justify-between items-center'>
                <Box className="flex items-center">
                    <IconButton
                        color="inherit"
                        onClick={() => props.handleDrawerOpen()}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(props.open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon className='text-white' />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" className='font-sans'>
                        ORBIO
                    </Typography>
                </Box>
            </Toolbar>
        </AppBar>
    )
}