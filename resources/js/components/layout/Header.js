import * as React from 'react';
import { useNavigate } from 'react-router-dom';
// Mui
import { Box, Toolbar, Typography, IconButton, styled, Tooltip } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import MuiAppBar from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import { useSnackbar } from 'notistack';
// Custom
import { useAuth } from '../../context/Auth';

const drawerWidth = 210;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open'
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

export function Header(props) {

    const { logout } = useAuth();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

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

    return (
        <AppBar position="fixed" open={props.open} sx={{ bgcolor: "#00458C", boxShadow: 0 }} className='border-b border-gray-200'>
            <Toolbar className='flex justify-between items-center'>
                <Box className="flex items-center">
                    <IconButton
                        color="inherit"
                        onClick={() => props.handleDrawerOpen()}
                        edge="start"
                        sx={{
                            marginRight: 2
                        }}
                    >
                        <MenuIcon style={{ color: '#fff' }} />
                    </IconButton>
                    <Typography variant="h6" fontWeight={500} noWrap component="div" className='font-sans text-white'>
                        ORBIO
                    </Typography>
                </Box>
                <Box>
                    <Tooltip title="Sair">
                        <IconButton onClick={handleLogout}>
                            <LogoutIcon style={{ color: '#fff' }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Toolbar>
        </AppBar>
    )
}